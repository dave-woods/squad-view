<template>
	<v-card
		style="display: grid; grid-template-columns: 1fr 2fr"
	>
		<div style="display: flex; flex-direction: column; justify-content: center; align-items: center">
			<v-card-title>{{ member.name }}</v-card-title>
			<v-card-subtitle>{{ `${avgTimes.length} sessions` }}</v-card-subtitle>
		</div>
		<v-sparkline
			v-if="avgTimes.length > 1"
			:value="avgTimes"
			auto-draw
			:line-width="5"
			:smooth="10"
			stroke-linecap="round"
			:gradient="['green', 'red']"
			:padding="20"
			:height="150"
		></v-sparkline>
		<v-card-text v-else style="display: flex; justify-content: center; align-items: center">
			More data needed...
		</v-card-text>
	</v-card>
</template>

<script>
export default {
	props: ['member'],
	computed: {
		avgTimes() {
			return this.member.avgTimes.filter(t => t > 0)
		}
	}
}
</script>
