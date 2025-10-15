import { io, type Socket } from 'socket.io-client'

import { env } from '@/config/env'

let socket: Socket | null = null

export const connectSocket = (token: string) => {
  if (socket?.connected) {
    return socket
  }

  socket = io(env.backendBaseUrl, {
    auth: {
      token,
    },
    transports: ['websocket'],
    autoConnect: true,
  })

  return socket
}

export const getSocket = () => socket

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
