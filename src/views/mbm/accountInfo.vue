<script setup lang='ts'>
import { computed, ref } from 'vue'
import { NModal, NSpin } from 'naive-ui'
import { useAuthStore } from '@/store'
import { accountInfo } from '@/api'
import AccountInfoComp from '@/mbm/views/accountInfo.vue'

interface Props {
  visible: boolean
  accessKey?: string
}

interface Emit {
  (e: 'update:visible', visible: boolean): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const loading = ref(false)

const account = ref({})

const authStore = useAuthStore()

const show = computed({
  get() {
    return props.visible
  },
  set(visible: boolean) {
    emit('update:visible', visible)
  },
})

const getData = () => {
  const accessKey = props.accessKey || authStore.token
  loading.value = true
  accountInfo(accessKey || '').then((res) => {
    account.value = res.data as any
  }).finally(() => {
    loading.value = false
  })
}
</script>

<template>
  <NModal v-model:show="show" title="我的账户" :auto-focus="false" preset="card" style="width: 95%; max-width: 640px" @after-enter="getData">
    <NSpin :spinning="loading">
      <AccountInfoComp :account="account" />
    </NSpin>
  </NModal>
</template>
