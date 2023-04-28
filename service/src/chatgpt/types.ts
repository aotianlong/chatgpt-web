import type { ChatMessage } from 'chatgpt'

export interface RequestOptions {
  accessKey: string
  model?: string
  message: string
  lastContext?: { conversationId?: string; parentMessageId?: string }
  process?: (chat: ChatMessage) => void
  systemMessage?: string
}
