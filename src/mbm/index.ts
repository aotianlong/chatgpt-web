import { useUserStore , useAuthStore} from '../store'

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
  if (data.action === 'UpdateUser') {
    userStore.updateUserInfo(data.data)
  }

  if (data.action === 'UpdateToken') {
	  authStore.setToken(data.token);
  }
})
