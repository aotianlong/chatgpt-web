import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { post } from '@/utils/request'
import { useAuthStore, useSettingStore } from '@/store'

export function fetchChatAPI<T = any>(
  prompt: string,
  options?: { conversationId?: string; parentMessageId?: string },
  signal?: GenericAbortSignal,
) {
  return post<T>({
    url: '/chat',
    data: { prompt, options },
    signal,
  })
}

export function fetchChatConfig<T = any>() {
  return post<T>({
    url: '/config',
  })
}

export function fetchChatAPIProcessWithLocalServer<T = any>(
  params: {
    model?: string
    prompt: string
    options?: { conversationId?: string; parentMessageId?: string }
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  const settingStore = useSettingStore()

  return post<T>({
    url: '/chat-process',
    data: { model: params.model, prompt: params.prompt, options: params.options, systemMessage: settingStore.systemMessage },
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  })
}

export const fetchChatAPIProcess = fetchChatAPIProcessWithLocalServer

export function fetchChatAPIProcessWithYingjin<T = any>(
  params: {
    model?: string
    prompt: string
    options?: { conversationId?: string; parentMessageId?: string }
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  const settingStore = useSettingStore()
  const authStore = useAuthStore()

  return post<T>({
    url: 'https://openai.yingjin.pro/api/visitor/openai/chat',
    data: { stream: true, model: params.model, messages: [{ role: 'user', content: params.prompt }] },
    signal: params.signal,
    headers: { accessKey: authStore.token },
    onDownloadProgress: params.onDownloadProgress,
  })
}

export function fetchSession<T>() {
  return post<T>({
    url: '/session',
  })
}

export function fetchVerify<T>(token: string) {
  return post<T>({
    url: '/verify',
    data: { token },
  })
}

export function sendCode<T>(phone: string) {
  return post<T>({
    url: '/sendCode',
    data: { phone },
  })
}

export function checkCode<T>(phone: string, code: string) {
  return post<T>({
    url: '/checkCode',
    data: {
      phone,
      code,
    },
  })
}

export function accountInfo<T>(accessKey: string) {
  return post<T>({
    url: '/accountInfo',
    data: {
      accessKey,
    },
  })
}
