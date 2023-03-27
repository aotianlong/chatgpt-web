import { useUserStore } from './store'

const userStore = useUserStore()
window.addEventListener('message', (data) => {
	console.log('on message', data);
	userStore.updateUserInfo({name: 'aotianlong'});
})
