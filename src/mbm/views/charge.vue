<script setup lang="ts">
import { ref } from 'vue'
import { NModal, NButton, NSelect, NInputGroup } from 'naive-ui'
import qrcode from 'qrcode'
import { charge } from '@/mbm/api'
import { useBasicLayout } from '@/hooks/useBasicLayout'

const amount = ref(null)
const qrcodeURL = ref('')
const chargeLoading = ref(false)


const options = [
	{ label: '10元', value: 10 },
	{ label: '20元', value: 20 },
	{ label: '50元', value: 50 },
	{ label: '100元', value: 100 },
	{ label: '200元', value: 200 },
	{ label: '500元', value: 500 },
	{ label: '1000元', value: 1000 },
	{ label: '2000元', value: 2000 },
	{ label: '5000元', value: 5000 },
]

const onCharge = () => {
	if (!amount.value) return
	chargeLoading.value = true
	const { isMobile } = useBasicLayout()
	const osType = isMobile.value ? 2 : 1
	console.log('osType', osType)
	charge(amount.value, osType).then((response: any) => {
		console.log(response)
		const { h5Url, codeUrl } = response.data
		if (h5Url) {
			window.open(h5Url)
		} else {
			qrcode.toDataURL(codeUrl, (error: any, url: string) => {
				qrcodeURL.value = url
			})
		}
	}).finally(() => {
		chargeLoading.value = false
	})
}
</script>
<template>
	<n-input-group>
		<n-select placeholder="请选择一个充值金额" :options="options" v-model:value="amount"></n-select>
		<n-button @click="onCharge" type="primary" :loading="chargeLoading">充值</n-button>
	</n-input-group>
	<NModal :show="!!qrcodeURL" title="请扫码支付" @close="qrcodeURL = ''" preset="dialog">
		<div class="text-center">
			<div class="my-2"><img :src="qrcodeURL" class="w-full" /></div>
			<div class="my-2">使用微信扫描</div>
		</div>
	</NModal>
</template>
