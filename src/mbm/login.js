import qs from 'qs'
/*
 * import { sslogin } from 'mbm'
 * sslogin()
 */

export function getToken() {
	const params = qs.parse(window.location.search, { ignoreQueryPrefix: true });
	return params['token']
}

export function sslogin(options = {}) {
	options.notice ??= Promise.resolve
	options.handleAccount ??= Promise.resolve
	options.handleAccountError ??= (errors) => {
		console.log('errors')
	}
	const redirectUrl = encodeURIComponent(location.href)
	const url = "https://openai.mbmzone.com/singleLogin?redirectUrl=" + redirectUrl
	// 是否登录的判断留给外面
	if (!options.isLoggedIn?.()) {
		// 添加一个提示？
		options.notice().then(() => {
			location.href = url
		})
	}
	const token = getToken()
	if (token) {
		getAccount().then((account) => {
			options.handleAccount(account).then(() => {
				// 成功处理登录事件
			})
		}).catch((error) => {
			// 通过 token 登录失败, 可以弹出一个提示啥的
			options.handleAccountError(error)
		})
	}
}

export function getAccount(token) {
	const url = "https://openai.yingjin.pro/api/user/doGetInfo"
	fetch(url, {headers: { Authorization: token },method: 'post'}).then((response) => {
		console.log(response)
	})
}
