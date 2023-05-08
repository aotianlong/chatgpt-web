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

export function fetchChatAPIProcess<T = any>(
  params: {
    model?: string
    prompt: string
    options?: { conversationId?: string; parentMessageId?: string }
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  const settingStore = useSettingStore()
  const authStore = useAuthStore()

  let data: Record<string, any> = {
    model: params.model,
    // prompt: params.prompt,
		messages: [
			{
				role: 'user',
				content: params.prompt,
			}
		],
    options: params.options,
  }

  if (authStore.isChatGPTAPI) {
    data = {
      ...data,
      systemMessage: settingStore.systemMessage,
      temperature: settingStore.temperature,
      top_p: settingStore.top_p,
			stream: true,
    }
  }

  return post<T>({
    // url: '/chat-process',
		url: 'https://openai.yingjin.pro/v1/chat/completions',
    data,
    signal: params.signal,
    onDownloadProgress: (progress) => {
			let text = ''
		  let { response } = progress.event.currentTarget
			response = response.replace(/data: /g, '').replace(/\n\n/g, '\n').replace('[DONE]', '')
			console.log('response', response)
			response = response.split(/\n/).map((item: string) => {
				console.log('item', item, 'text', text)
				if (item === '') return item
				const itemJson = JSON.parse(item)
				text += itemJson.choices[0].delta.content || ''
				itemJson.text = text
				return JSON.stringify(itemJson)
			}).join('\n')
			console.log('response', response)
			return params.onDownloadProgress({
				event: {
					target: {
						response: response,
						responseText: response
					}
				}
			})
		},
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

