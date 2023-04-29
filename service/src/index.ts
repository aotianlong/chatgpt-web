import express from 'express'
import type { RequestProps } from './types'
import { chatConfig, chatReplyProcess, currentModel } from './chatgpt'
import { auth } from './middleware/auth'
import { limiter } from './middleware/limiter'
import { isNotEmptyString } from './utils/is'
import { accountInfo, getAccessKey, queryAccount, sendPhoneCode } from './mbm/yingjin'

const app = express()
const router = express.Router()

app.use(express.static('public'))
app.use(express.json())

app.all('*', (_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'authorization, Content-Type')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})

router.post('/chat-process', [auth, limiter], async (req, res) => {
  res.setHeader('Content-type', 'application/octet-stream')
  const accessKey = getAccessKey(req)

  try {
    const { model, prompt, options = {}, systemMessage } = req.body as RequestProps
    let firstChunk = true
    await chatReplyProcess({
      accessKey,
      model,
      message: prompt,
      lastContext: options,
      process: (chat: ChatMessage) => {
        res.write(firstChunk ? JSON.stringify(chat) : `\n${JSON.stringify(chat)}`)
        firstChunk = false
      },
      systemMessage,
    })
  }
  catch (error) {
    res.write(JSON.stringify(error))
  }
  finally {
    res.end()
  }
})

router.post('/config', auth, async (req, res) => {
  try {
    const response = await chatConfig()
    res.send(response)
  }
  catch (error) {
    res.send(error)
  }
})

router.post('/session', async (req, res) => {
  try {
    res.send({ status: 'Success', message: '', data: { auth: true, model: currentModel() } })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})

router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body as { token: string }
    if (!token)
      throw new Error('Secret key is empty')

    if (process.env.AUTH_SECRET_KEY !== token)
      throw new Error('密钥无效 | Secret key is invalid')

    res.send({ status: 'Success', message: 'Verify successfully', data: null })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})

router.post('/sendCode', async (req, res) => {
  try {
    const { phone } = req.body as { phone: string }
    if (!phone || !isNotEmptyString(phone))
      throw new Error('手机号码无效 | Phone number is invalid')

    const response = await sendPhoneCode(phone)
    if (response.code === 11000)
      res.send({ status: 'Success', message: response.msg, data: response.data })

    else
      res.send({ status: 'Fail', message: response.msg, data: response.data })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.msg, data: null })
  }
})

router.post('/checkCode', async (req, res) => {
  try {
    const { phone, code } = req.body as { phone: string; code: string }
    const result = await queryAccount(phone, code)
    globalThis.console.log(result)
    if (result.code === 11000)
      res.send({ status: 'Success', message: result.msg, data: result.data })
    else
      res.send({ status: 'Fail', message: result.msg, data: result.data })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.msg, data: null })
  }
})

router.post('/accountInfo', async (req, res) => {
  try {
    const { accessKey } = req.body as { accessKey: string }
    const result = await accountInfo(accessKey)
    if (result.code === 11000)
      res.send({ status: 'Success', message: result.msg, data: result.data })
    else
      res.send({ status: 'Fail', message: result.msg, data: result.data })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.msg, data: null })
  }
})

app.use('', router)
app.use('/api', router)
app.set('trust proxy', 1)

app.listen(3100, () => globalThis.console.log('Server is running on port 3100'))
