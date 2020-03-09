<template>
	<v-container>
		<v-card elevation="0" class="mb-6" style="position: relative" color="#134654" dark>
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
					:line-width="10"
					class="py-6"
					type="bar"
				></v-sparkline>
			</v-card-text>
			<v-dialog max-width="800px" v-model="displayForm" @input="v => v || this.$refs.nsform.resetForm()">
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
						<v-icon
							color="#134654"
							large
						>mdi-plus</v-icon>
					</v-btn>
				</template>
				<new-session-form ref="nsform" @close-form="displayForm = false"></new-session-form>
			</v-dialog>
		</v-card>
		<v-timeline>
			<v-timeline-item fill-dot v-for="session in reversedSessionList" :key="session.date" color="#3C7364">
				<template v-slot:opposite>
					<span class="headline font-weight-bold">{{ dateToDateString(session.date) }}</span>
				</template>
				<v-card>
					<v-card-title>"{{ session.subtitle || 'Squad' }}"</v-card-title>
					<v-card-subtitle>Attendance: {{ session.attendees.length }}</v-card-subtitle>
					<v-card-text>
						<ul>
							<li v-for="m in session.attendees" :key="m.id">{{ getMember(m.id).name }}</li>
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
			return this.sessionList.map(s => s.attendees.length)
		},
		fromDate() {
			return this.dateToDateString(this.sessionList[0].date)
		},
		toDate() {
			return this.dateToDateString(this.sessionList[this.sessionList.length - 1].date)
		}
	},
	methods: {
		getMember(id) {
			return this.$store.getters.getMemberById(id)
		},
		dateToDateString(d) {
			return new Date(d).toLocaleDateString('en-IE', {
				day: 'numeric',
				month: 'long',
				year: 'numeric'
			})
		}
	},
	components: {
		'new-session-form': NewSessionForm
	}
}
</script>