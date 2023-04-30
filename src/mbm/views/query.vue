<script setup>
import { ref } from 'vue'
import { NButton, NCard, NForm, NFormItem, NInput } from 'naive-ui'
import { accountInfo } from '@/api'
const formData = ref({
  accessKey: '',
})

const doQueryAccout = async () => {
  const { data } = await accountInfo(formData.value.accessKey)
  console.log(data)
}
</script>

<template>
  <NCard title="查询账户" bordered>
    {{ formData }}
    <NForm :model="formData">
      <NFormItem label="AccessKey">
        <NInput v-model:value="formData.accessKey" />
      </NFormItem>
      <NButton type="primary" size="small" @click="doQueryAccout">
        查询
      </NButton>
    </NForm>
  </NCard>
</template>
