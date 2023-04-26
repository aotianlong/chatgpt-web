import axios from 'axios'
import type { SendMessageOptions } from 'chatgpt'
import type { RequestOptions } from '../chatgpt/types'
import { sendResponse } from '../utils'
const timeoutMs: number = !isNaN(+process.env.TIMEOUT_MS) ? +process.env.TIMEOUT_MS : 30 * 1000
const ErrorCodeMessage: Record<string, string> = {
  401: '[OpenAI] 提供错误的API密钥 | Incorrect API key provided',
  403: '[OpenAI] 服务器拒绝访问，请稍后再试 | Server refused to access, please try again later',
  502: '[OpenAI] 错误的网关 |  Bad Gateway',
  503: '[OpenAI] 服务器繁忙，请稍后再试 | Server is busy, please try again later',
  504: '[OpenAI] 网关超时 | Gateway Time-out',
  500: '[OpenAI] 服务器繁忙，请稍后再试 | Internal Server Error',
}
const OPENAI_API_BASE_URL = process.env.OPENAI_API_BASE_URL
const OPENAI_API_MODEL = process.env.OPENAI_API_MODEL
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const model = 'xy-openai-gpt4'

async function chatReplyProcess(options: RequestOptions) {
  const { message, lastContext, process, systemMessage } = options
  try {
    const options: SendMessageOptions = { timeoutMs }

    const headers = { 'Content-Type': 'application/json;charset=utf-8', 'accessKey': OPENAI_API_KEY }
    global.console.log('headers', headers)
    const response = await axios.post(
      'https://openai.yingjin.pro/api/visitor/openai/chat',
      {
        model,
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],

      },
      { headers },
    )

    /*
    const response = await api.sendMessage(message, {
      ...options,
      onProgress: (partialResponse) => {
        process?.(partialResponse)
      },
    })
		*/

    const data = response.data
    global.console.log('data', data)

    return sendResponse({ type: 'Success', data })
  }
  catch (error: any) {
    const code = error.statusCode
    global.console.log(error)
    if (Reflect.has(ErrorCodeMessage, code))
      return sendResponse({ type: 'Fail', message: ErrorCodeMessage[code] })
    return sendResponse({ type: 'Fail', message: error.message ?? 'Please check the back-end console' })
  }
}

export { chatReplyProcess }
