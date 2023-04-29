<script setup lang='ts'>
import { defineAsyncComponent, ref } from 'vue'
import { HoverButton, SvgIcon, UserAvatar } from '@/components/common'

const Setting = defineAsyncComponent(() => import('@/components/common/Setting/index.vue'))
const AccountInfo = defineAsyncComponent(() => import('@/views/mbm/accountInfo.vue'))

const accountModalVisible = ref(false)
const show = ref(false)
</script>

<template>
  <footer class="flex flex-col border-t dark:border-neutral-800">
    <div class="my-2 flex-1 text-center">
      联系客服: <a href="tel://4008316028">4008316028</a>
    </div>
    <div class="flex items-center justify-between min-w-0 px-4 overflow-hidden">
      <div class="flex-1 flex-shrink-0 overflow-hidden cursor-pointer" @click="accountModalVisible = true">
        <UserAvatar />
      </div>

      <!-- 不需要这个设置按钮 -->
      <HoverButton class="hidden" @click="show = true">
        <span class="text-xl text-[#4f555e] dark:text-white">
          <SvgIcon icon="ri:settings-4-line" />
        </span>
      </HoverButton>

      <Setting v-if="show" v-model:visible="show" />
      <AccountInfo v-model:visible="accountModalVisible" />
    </div>
  </footer>
</template>
