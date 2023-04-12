import { useAuthStore, useUserStore } from '../store'

const userStore = useUserStore()
const authStore = useAuthStore()
/*
* data: {
*action: 'action',
*data: {somedata: ''}
*}
*/
window.addEventListener('message', (event) => {
  const { data } = event
  console.log('iframe on message', data, event)
  if (data.action === 'updateUser')
    userStore.updateUserInfo(data.data)

  if (data.action === 'updateToken')
	  authStore.setToken(data.token)
})

console.log('ifame console output')
