import fetch from "node-fetch"
const accessKey = "f76e7268023b3d99627ae87456cfd02d"
const url = "https://openai.yingjin.pro/api/visitor/openai/chat"
const headers = {
	"Content-Type": "application/json",
	accessKey
}
const body = {
	model: 'xy-openai-gpt4-32k',
	stream: true,
	messages: [{role: 'user', content: '准备好了吗？'}]
}

console.log(url, headers, body)

const response =  fetch(
    url,
    {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      onMessage: (data) => {
	      console.log('onData')
	      console.log('onMessage', data)
      },
      responseType: 'stream',
    }
  )
