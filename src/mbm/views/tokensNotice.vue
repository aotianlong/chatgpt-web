<template>
	<div class="flex gap-2 text-gray-400 text-sm">
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
import { encode } from 'gpt-tokenizer'


const completionPrice = {
	'gpt-4': 0.12,
	'gpt-4-32k': 0.24,
	'gpt-3.5-turbo': 0.004,
	'gpt-3.5-turbo-16k': 0.004,
	'gpt-35-turbo-16k': 0.004,
}

const promptPrice = {
	'gpt-4': 0.06,
	'gpt-4-32k': 0.12,
	'gpt-3.5-turbo': 0.004,
	'gpt-3.5-turbo-16k': 0.004,
	'gpt-35-turbo-16k': 0.004,
}

const model = computed(() => {
	const mapping = {
		"xy-openai-gpt4-32k": "gpt-4-32k",
		"xy-openai-gpt4": "gpt-4",
		"xy-openai-gpt35": "gpt-3.5-turbo",
		"xy-openai-gpt35-16k": "gpt-3.5-turbo-16k",
	}
	return mapping[props.model] || props.model
})

const props = defineProps({
	model: {
		type: String,
		default: 'gpt-4'
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

/*
const computeCost = (data) => {
	api.post('/api/computeCost', data).then(() => {
		console.log('computeCost success')
	}).catch((err) => {
		console.log('computeCost failed', err)
	})
}
*/

const completionTokens = computed(() => {
	// return props.completionText.length / 4
	return encode(props.completionText).length
})

const propmtTokens = computed(() => {
	// return props.promptText.length / 4
	return encode(props.promptText).length
})

const completionCost = computed(() => {
	const price =completionPrice[model.value]
	if (!props.completionText) {
		return 0
	}
  return ((price * completionTokens.value) / 1000).toFixed(6)
})

const promptCost = computed(() => {
	const price = promptPrice[model.value]
	if (!props.promptText) {
		return 0
	}
	return ((price * propmtTokens.value) / 1000).toFixed(6)
})

const totalCost = computed(() => {
	return completionCost.value || promptCost.value
})
</script>