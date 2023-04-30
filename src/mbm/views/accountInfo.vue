<script setup lang='ts'>
defineProps({
  account: {
    type: Object,
    required: true,
  },
})
const fieldNames = {
  name: '姓名',
  mobile: '手机号',
  remainAmount: '剩余金额',
  requestCount: '请求次数',
  createTime: '创建时间',
}
</script>

<template>
  <div v-for="(key, value) in fieldNames" :key="key" class="flex items-center space-x-4 my-2">
    <span class="flex-shrink-0 w-[200px]">{{ key }}</span>
    <div class="flex-1">
      {{ account[value] }} <span v-if="value === 'remainAmount'">美元</span>
    </div>
  </div>
</template>
