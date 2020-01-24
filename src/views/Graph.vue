<template>
	<v-container style="position: relative; display: grid; grid-template-columns: 1fr 1fr; grid-gap: 10px">
		<h1 style="grid-column: 1 / span 2; text-align: center">Graph Page</h1>
		<v-card
			v-for="(v, i) in namesAndTimes"
			:key="i"
			style="display: grid; grid-template-columns: 1fr 2fr; height: 6em"
		>
			<div style="display: flex; flex-direction: column">
			<v-card-title>{{ v.name }}</v-card-title>
			<v-card-subtitle>{{ currentHover === null ? `${v.avgTimes.filter(t => t > 0).length} sessions` : currentHover }}</v-card-subtitle>
			</div>
			<trend-chart
				:datasets="dataForMember(v)"
				:grid="{
					verticalLines: true,
					horizontalLines: true
				}"
				@mouse-move="mouseHover"
				:interactive="v.avgTimes.filter(t => t > 0).length > 1"
				></trend-chart>
		</v-card>
	</v-container>
</template>

<script>
export default {
	data() {
		return {
			currentHover: null
		}
	},
	computed: {
		namesAndTimes() {
			return this.$store.getters.getAllMembers.map(m => {
				return {
					id: m.id,
					name: m.name.split(' ')[0],
					avgTimes: this.$store.getters.getAvgTimesById(m.id)
				}
			})
		},
		members() {
			return this.$store.getters.getAllMembers
		}
	},
	methods: {
		dataForMember(member) {
			return [{
				data: member.avgTimes
					.filter(t => t > 0),
				showPoints: true,
				className: "tcline"
			}]
		},
		mouseHover(p) {
			if (!p) {
				this.currentHover = null
				return
			}
			this.currentHover = p.data[0].toFixed(2)
		}
	}
}
</script>

<style lang="scss">
.tcline {
  .stroke {
  	stroke: rgba(200,50,0,0.7);
  	stroke-width: 4;
  }
	.point {
		fill: rgba(200,50,0,1);
		stroke: rgba(200,50,0,1);
		stroke-width: 2;
	}
}
</style>
