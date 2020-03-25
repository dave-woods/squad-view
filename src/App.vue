<template>
	<v-app style="background: #fcfcf7">
		<nav-bar></nav-bar>
			<v-content>
				<router-view></router-view>
			</v-content>
		<settings-drawer></settings-drawer>
	</v-app>
</template>

<script>
import { requestsMixin } from '@/mixins/requestsMixin'
import Settings from '@/components/Settings'
import NavBar from '@/components/NavBar'
export default {
  name: 'App',
  components: {
    'settings-drawer': Settings,
    'nav-bar': NavBar
  },
	mixins: [requestsMixin],
	methods: {
		async loadStateFromDB() {
			const data = await this.getStateFromDB()
			this.$store.dispatch('updateMembersState', data.members)
			this.$store.dispatch('updateSessionsState', data.sessions)
			this.$store.dispatch('updateSettingsState', data.settings)
			this.$store.dispatch('updateExercisesState', data.exercises)
		},
		async saveStateToDB() {
			await this.setStateToDB(this.$store.state)
		}
	},
	beforeMount() {
		this.loadStateFromDB()
	}
};
</script>
