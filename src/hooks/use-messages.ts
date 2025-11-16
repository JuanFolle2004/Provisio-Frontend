import { useState, useEffect, useRef } from 'react'
import { type Message, messageService } from '@/services/api/message.service.ts'



export const useMessages = (groupId: number) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)
  const hasLoadedRef = useRef(false) // ✅ Prevenir recargas

  // Cargar mensajes iniciales SOLO UNA VEZ por groupId
  useEffect(() => {
    if (!groupId) return

    // ✅ Reset cuando cambia el grupo
    hasLoadedRef.current = false
    setMessages([])

    const loadMessages = async () => {
      if (hasLoadedRef.current) return // ✅ Ya cargado

      setIsLoading(true)
      setError(null)
      try {
        const response = await messageService.getMessages(groupId)
        const fetchedMessages = Array.isArray(response.data)
          ? response.data
          : [response.data]
        setMessages(fetchedMessages)
        hasLoadedRef.current = true // ✅ Marcar como cargado
      } catch (err: any) {
        setError(err.message || 'Error al cargar mensajes')
      } finally {
        setIsLoading(false)
      }
    }

    loadMessages()
  }, [groupId]) // ✅ Solo recargar si cambia groupId

  const sendMessage = async (content: string, userId: number) => {
    if (!content.trim() || isSending) return

    setIsSending(true)
    setError(null)

    try {
      const response = await messageService.sendMessage({
        content,
        group_id: groupId,
        user_id: userId,
      })

      const newMessage = Array.isArray(response.data)
        ? response.data[0]
        : response.data

      return newMessage
    } catch (err: any) {
      const errorMsg = err.message || 'Error al enviar mensaje'
      setError(errorMsg)
      throw err
    } finally {
      setIsSending(false)
    }
  }

  const addMessage = (message: Message) => {
    setMessages((prev) => {

      // Si el mensaje tiene ID positivo (real), remover cualquier temporal
      if (message.id > 0) {
        const filtered = prev.filter(m => !(m.id < 0 && m.content === message.content))
        if (filtered.some(m => m.id === message.id)) {
          return filtered
        }
        return [...filtered, message]
      }

      return [...prev, message]
    })
  }

  const removeMessage = (messageId: number) => {

    setMessages((prev) => prev.filter(m => m.id !== messageId))
  }

  return {
    messages,
    isLoading,
    error,
    isSending,
    sendMessage,
    addMessage,
    removeMessage,
  }
}