<script setup lang="ts">
import { ref } from 'vue'
import { NButton, NCard, NForm, NFormItem, NInput } from 'naive-ui'
import AccountInfo from './accountInfo.vue'
import { accountInfo } from '@/api'
const formData = ref({
  accessKey: '',
})

const account = ref()
const loading = ref(false)
const error = ref<any>(null)

const doQueryAccout = async () => {
  try {
    error.value = null
    if (formData.value.accessKey === '') {
      error.value = '请输入AccessKey'
      return
    }
    loading.value = true
    const { data } = await accountInfo(formData.value.accessKey)
    if (data) {
      account.value = data
    }
    else {
      error.value = '无效的AccessKey'
      account.value = null
    }
  }
  catch (e) {
    console.error(e)
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="p-10">
    <NCard title="查询账户" bordered>
      <NForm :model="formData">
        <NFormItem label="AccessKey">
          <NInput v-model:value="formData.accessKey" />
        </NFormItem>
        <NButton type="primary" size="small" :loading="loading" @click="doQueryAccout">
          查询
        </NButton>
        <span v-if="error" class="text-red-500 ml-2">{{ error }}</span>
      </NForm>
    </NCard>
    <div class="my-3" />
    <NCard v-if="account" title="账户信息">
      <AccountInfo :account="account" />
    </NCard>
  </div>
</template>
