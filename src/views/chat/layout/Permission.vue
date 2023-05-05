<script setup lang='ts'>
import { computed, ref } from 'vue'
import { NInputNumber, NButton, NInput, NInputGroup, NModal, useMessage } from 'naive-ui'
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
const countDown = ref(0)
const startCountDown = () => {
  countDown.value = 60
  const timer = setInterval(() => {
    countDown.value -= 1
    if (countDown.value <= 0)
      clearInterval(timer)
  }, 1000)
}
const sending = ref(false)

const error = ref(null)
const formData = ref({
  phone: '',
  code: '',
})

const disabled = computed(() => (!formData.value.phone.trim() && !formData.value.code) || loading.value)

async function handleVerify() {
  loading.value = true
  error.value = null
  checkCode(formData.value.phone, formData.value.code).then((res: any) => {
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
  sending.value = true
  sendCode(phone).then((res) => {
    globalThis.console.log(res)
    startCountDown()
    ms.success('发送成功')
  }).catch((err) => {
    error.value = err.message
    ms.error(err.message)
    globalThis.console.log('error', err)
  }).finally(() => {
    sending.value = false
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
          <NButton :loading="sending" :disabled="!!countDown || sending" type="primary" @click="doSendCode">
            <span v-if="!countDown">发送</span>
            <span v-else>{{ countDown }}</span>
          </NButton>
        </NInputGroup>
        <NInputNumber  :show-button="false" v-model:value="formData.code" placeholder="验证码" @keypress="handlePress" :max="1000000" maxlength="6" />
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
