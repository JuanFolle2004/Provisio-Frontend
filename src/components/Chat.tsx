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
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            animation: 'fadeIn 0.2s ease-out',
          }}
        />

        {/* Modal */}
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            width: '90%',
            maxWidth: '500px',
            height: '600px',
            maxHeight: '90vh',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'slideUp 0.3s ease-out',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '1rem 1.5rem',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f9fafb',
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>Chat del Grupo</h3>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#6b7280' }}>
                {messages.length} mensajes
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#6b7280',
                padding: '0.5rem',
                borderRadius: '6px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6'
                e.currentTarget.style.color = '#111827'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#6b7280'
              }}
            >
              ✕
            </button>
          </div>

          {/* Mensajes */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              backgroundColor: '#f9fafb',
              scrollBehavior: 'smooth',
            }}
          >
            {messages.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '3rem 1rem',
                  color: '#9ca3af',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
                <p>No hay mensajes todavía</p>
                <p style={{ fontSize: '0.875rem' }}>¡Sé el primero en escribir!</p>
              </div>
            ) : (
              <>
                {messages.map((msg) => {
                  const isMyMessage = msg.author === me?.username

                  return (
                    <div
                      key={msg.id}
                      style={{
                        padding: '0.75rem 1rem',
                        backgroundColor: isMyMessage ? '#dbeafe' : 'white',
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        cursor: 'pointer',
                        borderLeft: isMyMessage ? '3px solid #3b82f6' : 'none',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'baseline',
                          marginBottom: '0.25rem',
                        }}
                      >
                        <strong
                          style={{
                            color: isMyMessage ? '#1e40af' : '#3b82f6',
                            fontSize: '0.875rem',
                          }}
                        >
                          {msg.author || 'Usuario'} {isMyMessage && '(Tú)'}
                        </strong>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            color: '#9ca3af',
                          }}
                        >
                        {msg.time}
                      </span>
                      </div>
                      <p
                        style={{
                          margin: 0,
                          color: '#374151',
                          lineHeight: '1.5',
                        }}
                      >
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
            style={{
              padding: '1rem',
              borderTop: '1px solid #e5e7eb',
              backgroundColor: 'white',
              display: 'flex',
              gap: '0.5rem',
            }}
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={!me?.id ? 'Cargando usuario...' : 'Escribe un mensaje...'}
              disabled={!me?.id || isSending}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                opacity: !me?.id ? 0.5 : 1,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || !me?.id || isSending}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: newMessage.trim() && me?.id && !isSending ? '#3b82f6' : '#d1d5db',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '500',
                cursor: newMessage.trim() && me?.id && !isSending ? 'pointer' : 'not-allowed',
                transition: 'background-color 0.2s, transform 0.1s',
                fontSize: '0.875rem',
              }}
              onMouseEnter={(e) => {
                if (newMessage.trim() && me?.id && !isSending) {
                  e.currentTarget.style.backgroundColor = '#2563eb'
                }
              }}
              onMouseLeave={(e) => {
                if (newMessage.trim() && me?.id && !isSending) {
                  e.currentTarget.style.backgroundColor = '#3b82f6'
                }
              }}
              onMouseDown={(e) => {
                if (newMessage.trim() && me?.id && !isSending) {
                  e.currentTarget.style.transform = 'scale(0.95)'
                }
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
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
      `}</style>
      </>
    );
}