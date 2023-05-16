<script setup lang="ts">
import { NConfigProvider } from 'naive-ui'
import { NaiveProvider } from '@/components/common'
import { useTheme } from '@/hooks/useTheme'
import { useLanguage } from '@/hooks/useLanguage'
import { sslogin } from '@/mbm/login'
import { useAuthStore, useUserStore } from '@/store'


sslogin({
	isLoggedIn() {
		const secretToken = localStorage.getItem('SECRET_TOKEN')
		console.log('secret toke', secretToken)
		if (secretToken && JSON.parse(secretToken)?.data) {
			return true
		} else {
			return false
		}
	},
	handleAccount(account) {
		console.log('handle account', account)
		return new Promise((resolve, reject) => {
			const authStore = useAuthStore()
			const userStore = useUserStore()
			authStore.setToken(account.accessKey)
			userStore.updateUserInfo({
				name: account.name,
				description: account.mobile,
			})
		})
	}
})

const { theme, themeOverrides } = useTheme()
const { language } = useLanguage()
</script>

<template>
  <NConfigProvider
    class="h-full"
    :theme="theme"
    :theme-overrides="themeOverrides"
    :locale="language"
  >
    <NaiveProvider>
      <RouterView />
    </NaiveProvider>
  </NConfigProvider>
</template>
