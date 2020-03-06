<template>
	<v-container>
		<v-card elevation="0" class="mb-6" style="position: relative;">
			<v-card-title>Sessions</v-card-title>
			<v-card-subtitle>
				Listing {{ sessionList.length }} squad sessions from {{ sessionList[0].date }} to {{ sessionList[sessionList.length-1].date }}
			</v-card-subtitle>
			<v-card-text>
				<v-sparkline
					:value="attendanceRates"
					auto-draw
					smooth="2"
					stroke-linecap="round"
				></v-sparkline>
			</v-card-text>
			<v-dialog max-width="800px" v-model="displayForm" @input="v => v || this.$refs.nsform.resetForm()">
				<template v-slot:activator="{ on }">
					<v-btn v-on="on" color="#66A074" absolute right bottom fab title="Add new session"><v-icon>mdi-plus</v-icon></v-btn>
				</template>
				<new-session-form ref="nsform" @save-form="displayForm = false"></new-session-form>
			</v-dialog>
		</v-card>
		<v-timeline>
			<v-timeline-item fill-dot v-for="session in reversedSessionList" :key="session.date" color="#3C7364">
				<template v-slot:opposite>
					<span class="headline font-weight-bold">{{ session.date }}</span>
				</template>
				<v-card>
					<v-card-title>"{{ session.subtitle || 'Squad' }}"</v-card-title>
					<v-card-subtitle>Attendance: {{ session.tof.length }}</v-card-subtitle>
					<v-card-text>
						<ul>
							<li v-for="m in session.tof">{{ getMember(m.id).name }}</li>
						</ul>
					</v-card-text>
				</v-card>
			</v-timeline-item>
		</v-timeline>
	</v-container>
</template>

<style lang="sass">
.v-timeline:before
	top: 24px
</style>

<script>
import NewSessionForm from '@/components/NewSessionForm'
export default {
	data() {
		return {
			displayForm: false
		}
	},
	computed: {
		sessionList() {
			return this.$store.getters.getSessions
		},
		reversedSessionList() {
			return this.sessionList.slice().reverse()
		},
		attendanceRates() {
			return this.sessionList.map(s => s.tof.length)
		}
	},
	methods: {
		getMember(id) {
			return this.$store.getters.getMemberById(id)
		},
	},
	components: {
		'new-session-form': NewSessionForm
	}
}
</script>
