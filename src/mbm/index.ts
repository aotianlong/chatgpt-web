import { useUserStore } from '../store'

const userStore = useUserStore()
/*
 * data: {
 * 		action: 'action',
 * 		data: {somedata: ''}
 *	}
 */
window.addEventListener('message', (event) => {
	const { data } = event
	if (data.action === 'UpdateUser') {
		userStore.updateUserInfo(data.data);
	}
})
