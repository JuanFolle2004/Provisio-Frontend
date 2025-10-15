import { apiFetch } from './client'
import type { ChatMessage } from './types'

export const getMessages = (groupId: string) =>
  apiFetch<ChatMessage[]>(/groups//messages)

export const sendMessage = (groupId: string, body: string) =>
  apiFetch<ChatMessage>(/groups//messages, {
    method: 'POST',
    json: { body },
  })
