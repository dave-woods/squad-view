<template>
	<v-card style="display: grid; grid-template-columns: 1fr 2fr; height: 100%" @click="selectMember()" hover>
		<div style="display: flex; flex-direction: column; justify-content: center; align-items: center">
			<v-card-title>{{ member.name.split(' ')[0] }}</v-card-title>
			<v-card-subtitle>{{ `${avgTimes.length} sessions` }}</v-card-subtitle>
		</div>
		<v-sparkline
			v-if="avgTimes.length > 1"
			:value="avgTimes"
			auto-draw
			:line-width="5"
			:smooth="10"
			stroke-linecap="round"
			:gradient="gradient"
			gradient-direction="left"
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
	data() {
		return {
			gradient: [this.$vuetify.theme.themes.light.primary, this.$vuetify.theme.themes.light.accent],
			gradients: {
				titanium: ['#283048', '#859398'],
				opa: ['#3D7EAA', '#FFE47A'],
				moss: ['#134E5E', '#71B280']
			}
		}
	},
	props: ['member'],
	computed: {
		avgTimes() {
			return this.member.avgTimes.filter(t => t > 0)
		}
	},
	methods: {
		selectMember() {
			this.$emit('select-member', this.member.id)
		}
	}
}
</script>
