import axios from 'axios'
import type { ChatMessage, SendMessageOptions } from 'chatgpt'
import type { Request } from 'express'
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
async function chatReplyProcess(options: RequestOptions) {
  const { accessKey, message, lastContext, process, systemMessage } = options
  let { model } = options
  model ||= 'xy-openai-gpt4-32k'
  try {
    const options: SendMessageOptions = { timeoutMs }

    const headers = { 'Content-Type': 'application/json;charset=utf-8', 'accessKey': accessKey }
    global.console.log('headers', headers, 'model', model)
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

    const data = response.data.data
    if (response.data?.code === 12002) {
    	globalThis.console.log(response.data)
    	return sendResponse({ type: 'Unauthorized', message: 'login required' })
    }

    if (response.data?.code === 12008) {
      globalThis.console.log(response.data)
      return sendResponse({ type: 'Fail', message: '余额不足' })
    }

    /*
		{
			"choices": [
        {
            "finishReason": "stop",
            "index": 0,
            "message": {
                "content": "æ¬¢è¿åæ¥ï¼æä»ä¹æå¯ä»¥å¸®æ¨çåï¼",
                "role": "assistant"
            }
        }
    ],
    "created": 1682504455,
    "id": "chatcmpl-79WYZJKi3nVf6D0V9tU4XpW8xCFq7",
    "model": "gpt-4",
    "object": "chat.completion",
    "usage": {
        "completionTokens": 21,
        "promptTokens": 10,
        "totalTokens": 31
    }
} */

    // 转换成chatgpt的格式
    const newMessage: ChatMessage = {
      role: 'assistant',
      id: data.id,
      // parentMessageId: 'da38f295-11af-4232-b5c8-8954ae7a1eb6',
      text: data.choices?.[0]?.message?.content || '抱歉，网络出现点问题，请重试。', // '晚上好，有什么我可以帮助您的吗？',
      detail: {
        id: data.id,
        object: 'chat.completion',
        created: data.created,
        model: data.model,
        choices: [
          { delta: {}, index: 0, finish_reason: 'stop' },
        ],
      },
    }

    global.console.log('message', newMessage)
    const firstMessage = { ...newMessage }
    firstMessage.detail.object = 'chat.completion.chunk'
    firstMessage.detail.choices = [{ delta: { role: 'assistant' }, index: 0, finish_reason: null }]
    process?.(firstMessage)
    process?.(newMessage)

    return sendResponse({ type: 'Success', data: newMessage })
  }
  catch (error: any) {
    const code = error.statusCode
    global.console.log(error)
    if (Reflect.has(ErrorCodeMessage, code))
      return sendResponse({ type: 'Fail', message: ErrorCodeMessage[code] })
    return sendResponse({ type: 'Fail', message: error.message ?? 'Please check the back-end console' })
  }
}

function sendPhoneCode(phone: string) {
  return axios.post(
    'https://openai.yingjin.pro/api/visitor/doSendCode',
    {
      phone,
    },
    { headers: { 'Content-Type': 'application/json;charset=utf-8' } },
  ).then((response) => {
    global.console.log(response)
    return response.data
  }).catch((error) => {
    global.console.error(error)
  })
}

function queryAccount(phone: string, code: string) {
  return axios.post(
    'https://openai.yingjin.pro/api/visitor/queryAccount',
    {
      phone,
      code,
    },
    { headers: { 'Content-Type': 'application/json;charset=utf-8' } },
  ).then((response) => {
    global.console.log(response)
    return response.data
  }).catch((error) => {
    global.console.error(error)
  })
}

function accountInfo(accessKey: string) {
  return axios.post(
    'https://openai.yingjin.pro/api/visitor/queryInfo',
    {
      accessKey,
    },
    { headers: { 'Content-Type': 'application/json;charset=utf-8' } },
  ).then((response) => {
    global.console.log(response)
    return response.data
  }).catch((error) => {
    global.console.error(error)
  })
}

function getAccessKey(req: Request) {
  const Authorization = req.header('Authorization')
  return Authorization && Authorization.replace('Bearer ', '').trim()
}

export { chatReplyProcess, sendPhoneCode, queryAccount, getAccessKey, accountInfo }
