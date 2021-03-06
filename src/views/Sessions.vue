<template>
	<v-container>
		<v-card elevation="0" class="mb-6" style="position: relative" color="primary" dark>
			<v-card-title>Sessions</v-card-title>
			<v-card-subtitle>
				Listing {{ sessionList.length }} squad sessions from {{ fromDate }} to {{ toDate }}
			</v-card-subtitle>
			<v-card-text>
				<v-sparkline
					:value="attendanceRates"
					color="white"
					auto-draw
					:smooth="1"
					class="py-6"
					type="bar"
				></v-sparkline>
			</v-card-text>
			<v-dialog persistent max-width="800px" v-model="displayForm" @input="v => v || this.$refs.nsform.resetForm()">
				<template v-slot:activator="{ on }">
					<v-btn
						v-on="on"
						light
						absolute
						right
						bottom
						fab
						title="Add new session"
					>
						<v-icon color="primary" large>mdi-plus</v-icon>
					</v-btn>
				</template>
				<new-session-form ref="nsform" @close-form="displayForm = false; snackbar = true"></new-session-form>
			</v-dialog>
		</v-card>
		<v-timeline>
			<v-timeline-item fill-dot v-for="session in reversedSessionList" :key="session.date" color="accent">
				<template v-slot:opposite>
					<span class="display-1 accent--text" style="opacity: 0.6">{{ dateToDateString(session.date) }}</span>
				</template>
				<v-card>
					<v-card-title>"{{ session.subtitle || 'Squad' }}"</v-card-title>
					<v-card-subtitle>Attendance: {{ session.attendees.length }}</v-card-subtitle>
					<v-card-text>
						<ul>
							<li v-for="m in session.attendees" :key="m.id">{{ getMember(m.id).name }}</li>
						</ul>
					</v-card-text>
					<v-card-actions v-if="editsAllowed">
						<v-btn absolute right @click="editSession(session)">Edit</v-btn>
					</v-card-actions>
				</v-card>
			</v-timeline-item>
		</v-timeline>
		<v-snackbar v-model="snackbar" :timeout="1500">Session saved<v-btn text color="accent" @click="snackbar = false">Close</v-btn></v-snackbar>
	</v-container>
</template>

<style lang="sass">
.v-timeline:before
	top: 24px
</style>

<script>
import NewSessionForm from '@/components/NewSessionForm'
import util from '@/mixins/util'
export default {
	mixins: [util],
	data() {
		return {
			displayForm: false,
			snackbar: false
		}
	},
	computed: {
		editsAllowed() {
			return this.$store.state.settings.editSessions
		},
		sessionList() {
			return this.$store.getters.getSessions
		},
		reversedSessionList() {
			return this.sessionList.slice().reverse()
		},
		attendanceRates() {
			return this.sessionList.map(s => s.attendees.length)
		},
		fromDate() {
			return this.dateToDateString(this.sessionList[0]?.date)
		},
		toDate() {
			return this.dateToDateString(this.sessionList[this.sessionList.length - 1]?.date)
		}
	},
	methods: {
		getMember(id) {
			return this.$store.getters.getMemberById(id)
		},
		editSession(session) {
			this.displayForm = true
			this.$nextTick().then(() => this.$refs.nsform.prefillForm(session))
		}
	},
	components: {
		'new-session-form': NewSessionForm
	}
}
</script>
