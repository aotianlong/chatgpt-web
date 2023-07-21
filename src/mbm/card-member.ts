import axios from '@/mbm/api'
import { useAuthStore } from '@/store'
/*
 * 写一个从querystring获取名为model的参数，设置默认模型
 */

const modelNameKey = 'MBM_CARD_MEMBER'
let isCardMemberCache

export async function getMemberCards() {
  const authStore = useAuthStore()
  const accessKey = authStore.token
  // 先获取账户信息
  if (!accessKey)
    return false

  const response = await axios.post('https://openai.yingjin.pro/api/visitor/queryInfo', {
    accessKey,
  })

  let accountInfo = null
  if (response.data.code === 11000)
    accountInfo = response.data.data

  if (accountInfo) {
    // 查询周卡接口
    const cardInfoResponse = await axios.get(
      `https://openai.yingjin.pro/api/visitor/getValidatyTime?accountId=${accountInfo.id}`,
	  )
	  if (cardInfoResponse.data.code === 11000)
      return cardInfoResponse.data.data

    else
      return null
  }
  return null
}

export async function isCardMember() {
  if (isCardMemberCache !== undefined)
	  return isCardMemberCache

  const cards = await getMemberCards()
  if (cards) {
    // 对比时间
    const validCard = cards.find((card: any) => {
      return (new Date(card.validityTime).getTime() > new Date().getTime())
    })
    if (validCard) {
      isCardMemberCache = true
      return true
    }
    else {
      isCardMemberCache = false
      return false
    }
  }
  else {
    isCardMemberCache = false
    return false
  }
}

export function useCardMember(callback: any = null) {
  const params = new URLSearchParams(window.location.search)
  const version = params.get('version')
  if (version) {
    // 从openai 主页过来的
    const isCardMember = params.get('active') === 'true'
    localStorage.setItem(modelNameKey, JSON.stringify(isCardMember))
    return isCardMember
  }
  return JSON.parse(localStorage.getItem(modelNameKey) || 'false')
}
