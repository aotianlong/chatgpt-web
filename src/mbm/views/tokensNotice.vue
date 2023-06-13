<template>
	<div class="flex gap-2 justify-center">
		<span v-if="completionTokens">
			Completion 完成: {{ completionTokens }} tokens;
		</span>
		<span v-if="propmtTokens">
			Prompt 提示: {{ propmtTokens }} tokens;
		</span>
		<span v-if="model">模型: {{ model }};</span>
		<span v-if="totalCost">预计消耗 {{ totalCost }} 美金;</span>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const completionPrice = {
	'GPT-4': 0.12,
	'GPT-4-32K': 0.24,
	'GPT-3.5-turbo': 0.004,
}

const promptPrice = {
	'GPT-4': 0.06,
	'GPT-4-32K': 0.12,
	'GPT-3.5-turbo': 0.004,
}

const props = defineProps({
	model: {
		type: String,
		default: 'GPT-4'
	},
	promptText: {
		type: String,
		default: ''
	},
	completionText: {
		type: String,
		default: ''
	}
})

const completionTokens = computed(() => {
	return props.completionText.length / 4
})

const propmtTokens = computed(() => {
	return props.promptText.length / 4
})

const completionCost = computed(() => {
	return completionPrice[props.model] * completionTokens.value
})

const promptCost = computed(() => {
	return promptPrice[props.model] * propmtTokens.value
})

const totalCost = computed(() => {
	return completionCost.value + promptCost.value
})
</script>
