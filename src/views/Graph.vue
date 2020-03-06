<template>
	<v-container style="position: relative; display: grid; grid-template-columns: 1fr 1fr; grid-gap: 10px">
		<h1 style="grid-column: 1 / span 2; text-align: center">Time of Flight</h1>
		<v-switch v-model="showSingleSession" label="Show members with only one session" style="position: absolute; bottom: -40px; left: 10px"></v-switch>
		<member-card
			v-for="(v, i) in memberCards"
			:key="`member-card-${i}`"
			:member="v"
		>
		</member-card>
	</v-container>
</template>

<script>
import MemberCard from '../components/MemberCard'
export default {
	data() {
		return {
			showSingleSession: false,
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
		memberCards() {
			return this.showSingleSession ? this.namesAndTimes : this.namesAndTimes.filter(n => n.avgTimes.filter(t => t > 0).length > 1)
		},
		members() {
			return this.$store.getters.getAllMembers.map(m => ({
				text: m.name,
				value: m.id
			}))
		},
		numSessions() {
			return this.$store.getters.getSessions.length
		}
	},
	components: {
		'member-card': MemberCard
	}
}
</script>
