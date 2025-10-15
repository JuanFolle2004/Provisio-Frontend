import { useEffect, useState } from 'react'

import { useAuthStore } from '@/store/authStore'
import { connectSocket, disconnectSocket, getSocket } from '@/services/socket'

export const useSocket = () => {
  const token = useAuthStore((state) => state.token)
  const [socketId, setSocketId] = useState<string | null>(getSocket()?.id ?? null)

  useEffect(() => {
    if (!token) {
      disconnectSocket()
      setSocketId(null)
      return
    }

    const socket = connectSocket(token)

    const handleConnect = () => setSocketId(socket.id)
    const handleDisconnect = () => setSocketId(null)

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)

    if (socket.connected) {
      handleConnect()
    }

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
    }
  }, [token])

  return getSocket()
}
