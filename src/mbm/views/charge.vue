<script setup lang="ts">
import { NButton, NSelect, NInputGroup } from 'naive-ui'
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
</script>
<template>
	<n-input-group>
		<n-select placeholder="请选择一个金额" :options="options"></n-select>
		<n-button>充值</n-button>
	</n-input-group>
</template>
