<template>
	<v-window v-model="window">
		<v-window-item>
			<v-container style="position: relative; display: grid; grid-template-columns: 1fr 1fr; grid-gap: 10px">
				<h1 style="grid-column: 1 / span 2; text-align: center">Time of Flight</h1>
				<member-card
					v-for="(v, i) in namesAndTimes"
					:key="`member-card-${i}`"
					:member="v"
				>
				</member-card>
				<v-btn style="grid-column: 1 / span 2" class="mx-12" @click="addSession()">Add Session</v-btn>
			</v-container>
		</v-window-item>
		<v-window-item>
			<v-container>
				<div style="position: relative">
					<v-btn fab absolute left icon @click="window = 0"><v-icon>mdi-chevron-left</v-icon></v-btn>
					<h1 class="text-center">Add a new session</h1>
				</div>
				<v-form class="ma-12 pa-12" v-model="formValid" ref="form">
					<v-menu
						v-model="datePopout"
						:close-on-content-click="false"
						transition="scale-transition"
        		offset-y
        		min-width="290px"
					>
						<template v-slot:activator="{ on }">
	          	<v-text-field
	          	  v-model="formDate"
	          	  label="Session date"
	          	  prepend-icon="mdi-calendar"
	          	  readonly
	          	  v-on="on"
          		></v-text-field>
        		</template>
        		<v-date-picker v-model="formDate" @input="datePopout = false"></v-date-picker>
					</v-menu>
					<v-combobox
						v-model="memberSelect"
						:items="members"
						label="Select a member or add one"
						multiple
						chips
						hide-selected
						:rules="[v => v.length > 0]"
					></v-combobox>
					<v-container
						v-for="(ms, idx) in memberSelect"
						:key="idx"
					>
						<v-row dense>
							<v-col align-self="center" cols="3">{{ ms.text || ms }}</v-col>
							<v-col>
								<v-text-field
									label="Enter 1st time of flight"
									hide-details
									outlined
									:rules="[validTime]"
									v-model="saveData[idx][0]"
								></v-text-field>
							</v-col>
							<v-col>
								<v-text-field
									label="Enter 2nd time of flight"
									hide-details
									outlined
									:rules="[validTime]"
									v-model="saveData[idx][1]"
								></v-text-field>
							</v-col>
						</v-row>
					</v-container>
					<v-btn :disabled="!formValid" @click="saveSession">
						Save Session
					</v-btn>
				</v-form>
			</v-container>
		</v-window-item>
	</v-window>
</template>

<script>
import MemberCard from '../components/MemberCard'
export default {
	data() {
		return {
			window: 0,
			memberSelect: [],
			formValid: false,
			formDate: new Date().toISOString().substr(0, 10),
			datePopout: false,
			validTime: value => {
				const pv = parseFloat(value)
				return (value && value.toLowerCase() === '-') || (pv > 0 && pv < 30) || 'Invalid time entered.'
			}
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
			return this.$store.getters.getAllMembers.map(m => ({
				text: m.name,
				value: m.id
			}))
		},
		saveData() {
			const sd = []
			this.memberSelect.forEach(ms => {
				sd.push(Array(2))
			})
			return sd
		},
		numSessions() {
			return this.$store.getters.getSessions.length
		}
	},
	methods: {
		saveSession() {
			if (!this.formValid) {
				return
			}
			const tof = this.memberSelect.map((ms, idx) => {
				if (ms.value) {
					return {
						id: ms.value,
						times: this.saveData[idx].filter(t => t !== '-')
					}
				} else {
					this.$store.dispatch('addMember', ms)
					return {
						id: this.$store.getters.getLastAddedMember.id,
						times: this.saveData[idx].filter(t => t !== '-')
					}
				}
			})
			this.$store.dispatch('addSession', {
				date: this.formDate,
				tof
			})
			this.window = 0
		},
		addSession() {
			if (this.$refs.form) {
				this.memberSelect = []
				this.formDate = new Date().toISOString().substr(0, 10)
				this.$refs.form.resetValidation()
			}
			this.window = 1
		}
	},
	components: {
		'member-card': MemberCard
	}
}
</script>
