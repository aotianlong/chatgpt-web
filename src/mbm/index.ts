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
  if (data.action === 'updateUser') {
		console.log('userinfo to update', data.data)
    userStore.updateUserInfo(data.data)
	}

  if (data.action === 'updateToken') {
		console.log('token to update', data.token)
	  authStore.setToken(data.token)
	}
})

console.log('ifame console output')
if (window.parent) {
	console.log('send message to parent')
  window.parent.postMessage({ action: 'iframeLoaded' }, '*')
} else {
  console.log('no parent')
}
