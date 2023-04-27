import type { ChatMessage } from 'chatgpt'

export interface RequestOptions {
  model?: string
  message: string
  lastContext?: { conversationId?: string; parentMessageId?: string }
  process?: (chat: ChatMessage) => void
  systemMessage?: string
}
