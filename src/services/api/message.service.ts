import { httpClient } from '../httpClient'

export type Message = {
  id: number
  author: string
  content: string
  time: string
}

export type SendMessageData = {
  content: string
  group_id: number
  user_id: number
}

type MessageResponse = {
  data: Message | Message[]
}

export const messageService = {
  // Obtener mensajes de un grupo
  getMessages: (groupId: number) =>
    httpClient.get<MessageResponse>(`/messages/${groupId}`),

  // Enviar un mensaje
  sendMessage: (data: SendMessageData) =>
    httpClient.post<MessageResponse>('/messages', data),
}