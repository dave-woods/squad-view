<template>
	<v-container style="position: relative; display: grid; grid-template-columns: 1fr 1fr; grid-gap: 10px">
		<h1 style="grid-column: 1 / span 2; text-align: center">Time of Flight</h1>
		<member-card
			v-for="(v, i) in namesAndTimes"
			:key="i"
			:member="v"
		>
		</member-card>
	</v-container>
</template>

<script>
import MemberCard from '../components/MemberCard'
export default {
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
	components: {
		'member-card': MemberCard
	}
}
</script>
