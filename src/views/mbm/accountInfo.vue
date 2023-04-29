<script setup lang='ts'>
import { computed, ref } from 'vue'
import { NModal, NSpin } from 'naive-ui'
import { useAuthStore } from '@/store'
import { accountInfo } from '@/api'

interface Props {
  visible: boolean
}

interface Emit {
  (e: 'update:visible', visible: boolean): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const accountModalVisible = ref(false)

const loading = ref(false)

const fieldNames = {
  name: '姓名',
  mobile: '手机号',
  remainAmount: '剩余金额',
  requestCount: '请求次数',
  createTime: '创建时间',
}

const account = ref<Partial<typeof fieldNames>>({})

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
  const accessKey = authStore.token
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
      <div v-for="(key, value) in fieldNames" :key="key" class="flex items-center space-x-4 my-2">
        <span class="flex-shrink-0 w-[200px]">{{ key }}</span>
        <div class="flex-1">
          {{ account[value] }}
        </div>
      </div>
    </NSpin>
  </NModal>
</template>
