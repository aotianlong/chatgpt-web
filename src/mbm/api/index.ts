import axios from 'axios'
import { useAuthStore } from '@/store'

const baseURL = 'https://openai.yingjin.pro'
const service = axios.create({
  baseURL
})

service.interceptors.request.use(
  (config) => {
    const token = useAuthStore().token
    if (token)
      config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => {
    return Promise.reject(error.response)
  },
)

export function charge<T>(payAmount: number, osType) {
	const chargeDollar = payAmount / 0.1447 // 美元人民币汇率
  const authStore = useAuthStore()
	return service.request<T>({
		method: 'post',
		url: baseURL + '/api/wechatPay',
		data: {
			accessKey: authStore.token,
			payAmount,
			chargeDollar,
		  osType
		},
	}).then((res) => {
		return res.data
	})
}
