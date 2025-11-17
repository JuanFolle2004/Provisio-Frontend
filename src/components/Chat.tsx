import { useEffect, useRef, useState } from 'react'
import { useMessages } from '@/hooks/use-messages.ts'
import { useMe } from '@/hooks/use.Me.ts'
import { useEcho, useEchoPublic } from '@laravel/echo-react'
import type { Message } from '@/services/api/message.service.ts'
import { getAuthToken } from '@/config/api.ts'
import Pusher from 'pusher-js'

export const Chat = ({
                       groupId,
                       isOpen,
                       closeChat,
                     }: {
  groupId: number
  isOpen: boolean
  closeChat: () => void
}) => {
  const [newMessage, setNewMessage] = useState('')
  const { messages, sendMessage, addMessage, isSending,removeMessage } = useMessages(groupId)
  const { me, fetchMe } = useMe()
  const token = getAuthToken();

  useEffect(() => {
    fetchMe();
  },[token])


  const channelName = `chat.group.${groupId}`
  const {leave} = useEcho<Message>(
    channelName,
    '.MessageSentEvent',
    (e: any) => {
      console.log('🔥 Received msg:', e) // ← Este log debería aparecer
      const msg: Message = {
        id: e.id,
        author: e.author,
        content: e.content,
        time: e.time,
      }
      addMessage(msg)
    }
  )



  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return;
    if (!me?.id) return;
    const optimisticId = Math.floor(Math.random() * 1000000) * -1
    const optimisticMessage: Message = {
      id: optimisticId,
      author: me.username || me.name || 'Tú',
      content: newMessage.trim(),
      time: new Date().toLocaleTimeString('es-UY', {
        hour: '2-digit',
        minute: '2-digit'
      }),
    }
    addMessage(optimisticMessage)
    const messageToSend = newMessage.trim()
    setNewMessage('')
    try {
      const sentMessage = await sendMessage(messageToSend, me.id)
      removeMessage(optimisticId)
      if (sentMessage) {addMessage(sentMessage)}
    } catch (error) {
      removeMessage(optimisticId)
      console.error(error)
      alert('No se pudo enviar el mensaje. Intenta de nuevo.')
      setNewMessage(messageToSend)
    }
  }
  const onClose = () => {
    leave()
    closeChat()
  }

// Efecto para hacer scroll cuando cambian los mensajes
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll suave cuando llegan mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (!isOpen) return null

  return (
    <>
      {/* Overlay oscuro */}
      <div
        onClick={onClose}
        className="fixed inset-0  !mt-0 bg-black/50 z-[999] animate-fadeIn"
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl w-[90%] max-w-[500px] h-[600px] max-h-[90vh] z-[1000] flex flex-col overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="m-0 text-xl font-semibold">Chat del Grupo</h3>
            <p className="mt-1 text-sm text-gray-500">
              {messages.length} mensajes
            </p>
          </div>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-2xl cursor-pointer text-gray-500 p-2 rounded-md transition-all hover:bg-gray-100 hover:text-gray-900"
          >
            ✕
          </button>
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50 scroll-smooth">
          {messages.length === 0 ? (
            <div className="text-center py-12 px-4 text-gray-400">
              <div className="text-5xl mb-4">💬</div>
              <p>No hay mensajes todavía</p>
              <p className="text-sm">¡Sé el primero en escribir!</p>
            </div>
          ) : (
            <>
              {messages.map((msg) => {
                const isMyMessage = msg.author === me?.username

                return (
                  <div
                    key={msg.id}
                    className={`
                      px-4 py-3 rounded-lg shadow-sm transition-all cursor-pointer
                      hover:-translate-y-0.5 hover:shadow-md
                      ${isMyMessage
                        ? 'bg-blue-100 border-l-[3px] border-blue-500'
                        : 'bg-white'
                      }
                    `}
                  >
                    <div className="flex justify-between items-baseline mb-1">
                      <strong className={`text-sm ${isMyMessage ? 'text-blue-800' : 'text-blue-500'}`}>
                        {msg.author || 'Usuario'} {isMyMessage && '(Tú)'}
                      </strong>
                      <span className="text-xs text-gray-400">
                        {msg.time}
                      </span>
                    </div>
                    <p className="m-0 text-gray-700 leading-6">
                      {msg.content}
                    </p>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input de mensaje */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t border-gray-200 bg-white flex gap-2"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={!me?.id ? 'Cargando usuario...' : 'Escribe un mensaje...'}
            disabled={!me?.id || isSending}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none transition-colors focus:border-blue-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || !me?.id || isSending}
            className="px-6 py-3 bg-blue-500 text-white border-none rounded-lg font-medium text-sm transition-all hover:bg-blue-600 active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSending ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      </div>

      {/* Estilos de animación */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, -45%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}