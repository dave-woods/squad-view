<template>
	<v-container>
		<v-card color="red lighten-4" class="mb-4" style="position: relative;">
			<v-card-title>Sessions</v-card-title>
			<v-card-text>
				Listing {{ sessionList.length }} squad sessions from {{ sessionList[0].date }} to {{ sessionList[sessionList.length-1].date }}
			</v-card-text>
			<v-btn absolute right bottom fab title="Add new session"><v-icon>mdi-plus</v-icon></v-btn>
		</v-card>
		<v-timeline>
			<v-timeline-item v-for="session in reversedSessionList" :key="session.date" color="#3C7364">
				<template v-slot:opposite>
					<span class="headline font-weight-bold">{{ session.date }}</span>
				</template>
				<v-card>
					<v-card-title v-if="session.subtitle">"{{ session.subtitle }}"</v-card-title>
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

<script>
export default {
	computed: {
		sessionList() {
			return this.$store.getters.getSessions
		},
		reversedSessionList() {
			return this.sessionList.slice().reverse()
		}
	},
	methods: {
		getMember(id) {
			return this.$store.getters.getMemberById(id)
		}
	}
}
</script>
