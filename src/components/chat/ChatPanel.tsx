import { FormEvent, useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getMessages, sendMessage } from '@/api/chat'
import type { ChatMessage } from '@/api/types'
import { Loader } from '@/components/common/Loader'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useSocket } from '@/hooks'

interface ChatPanelProps {
  groupId: string
}

export const ChatPanel = ({ groupId }: ChatPanelProps) => {
  const [message, setMessage] = useState('')
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const queryClient = useQueryClient()
  const socket = useSocket()

  const { data: messages, isPending } = useQuery({
    queryKey: ['groups', groupId, 'messages'],
    queryFn: () => getMessages(groupId),
  })

  const sendMessageMutation = useMutation({
    mutationFn: (body: string) => sendMessage(groupId, body),
    onSuccess: (newMessage) => {
      queryClient.setQueryData<ChatMessage[]>(['groups', groupId, 'messages'], (prev = []) => [
        ...prev,
        newMessage,
      ])
      setMessage('')
      scrollToBottom()
    },
    onError: () => toast.error('No pudimos enviar tu mensaje. Intenta nuevamente.'),
  })

  const scrollToBottom = () => {
    const viewport = viewportRef.current
    if (!viewport) return
    viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' })
  }

  useEffect(() => {
    if (!socket) return

    const handleIncoming = (incoming: ChatMessage) => {
      if (incoming.groupId !== groupId) return
      queryClient.setQueryData<ChatMessage[]>(['groups', groupId, 'messages'], (prev = []) => [
        ...prev,
        incoming,
      ])
      scrollToBottom()
    }

    socket.on('chat:message', handleIncoming)

    return () => {
      socket.off('chat:message', handleIncoming)
    }
  }, [socket, groupId, queryClient])

  useEffect(() => {
    scrollToBottom()
  }, [messages?.length])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!message.trim()) return
    sendMessageMutation.mutate(message.trim())
  }

  return (
    <div className="flex h-full flex-col rounded-xl border">
      <div ref={viewportRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {isPending ? (
          <Loader />
        ) : messages?.length ? (
          messages.map((item) => (
            <div key={item.id} className="flex flex-col gap-1 rounded-md bg-muted/40 p-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{item.senderName}</span>
                <span>{new Date(item.createdAt).toLocaleTimeString()}</span>
              </div>
              <p className="text-sm leading-relaxed">{item.body}</p>
            </div>
          ))
        ) : (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Aún no hay mensajes. ¡Inicia la conversación!
          </p>
        )}
      </div>
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Escribe un mensaje"
            rows={2}
            required
          />
          <Button type="submit" disabled={sendMessageMutation.isPending}>
            {sendMessageMutation.isPending ? 'Enviando…' : 'Enviar'}
          </Button>
        </div>
      </form>
    </div>
  )
}
