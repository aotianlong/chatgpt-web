<script setup lang='ts'>
import { computed, ref } from 'vue'
import { NButton, NInput, NInputGroup, NModal, useMessage } from 'naive-ui'
import { checkCode, sendCode } from '@/api'
import { useAuthStore, useUserStore } from '@/store'
import Icon403 from '@/icons/403.vue'

interface Props {
  visible: boolean
}

defineProps<Props>()

const authStore = useAuthStore()
const userStore = useUserStore()

const ms = useMessage()

const loading = ref(false)
const token = ref('')

const error = ref(null)
const formData = ref({
  phone: '',
  code: '',
})

const disabled = computed(() => (!formData.value.phone.trim() && !formData.value.code) || loading.value)

async function handleVerify() {
  loading.value = true
  error.value = null
  checkCode(formData.value.phone, formData.value.code).then((res) => {
    globalThis.console.log(res)
    authStore.setToken(res.data.accessKey)
    token.value = res.data.accessKey
    ms.success('登录成功')
    // 设置 用户信息
    userStore.updateUserInfo({
      name: res.data.name,
      description: res.data.mobile,
    })
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }).catch((err) => {
    error.value = err.message
    ms.error(err.message)
    globalThis.console.log('error', err)
    authStore.removeToken()
    token.value = ''
  })
    .finally(() => {
      loading.value = false
    })
}

function handlePress(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleVerify()
  }
}

function doSendCode() {
  const phone = formData.value.phone.trim()
  sendCode(phone).then((res) => {
    globalThis.console.log(res)
  }).catch((err) => {
    error.value = err.message
    ms.error(err.message)
    globalThis.console.log('error', err)
  })
}
</script>

<template>
  <NModal :show="visible" style="width: 90%; max-width: 640px">
    <div class="p-10 bg-white rounded dark:bg-slate-800">
      <div class="space-y-4">
        <header class="space-y-2">
          <h2 class="text-2xl font-bold text-center text-slate-800 dark:text-neutral-200">
            403
          </h2>
          <p class="text-base text-center text-slate-500 dark:text-slate-500">
            {{ $t('common.unauthorizedTips') }}
          </p>
          <Icon403 class="w-[200px] m-auto" />
        </header>
        <!--
        <NInput v-model:value="token" type="password" placeholder="" @keypress="handlePress" />
				-->
        <NInputGroup>
          <NInput v-model:value="formData.phone" placeholder="手机号" />
          <NButton @click="doSendCode">
            发送
          </NButton>
        </NInputGroup>
        <NInput v-model:value="formData.code" placeholder="验证码" />
        <NButton
          block
          type="primary"
          :disabled="disabled"
          :loading="loading"
          @click="handleVerify"
        >
          {{ $t('common.verify') }}
        </NButton>
      </div>
    </div>
  </NModal>
</template>
