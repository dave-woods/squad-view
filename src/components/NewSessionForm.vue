<template>
	<v-card>
		<v-card-title>{{ formSteps[formStep - 1] }}</v-card-title>
		<v-card-text>
			<v-form class="pa-2" v-model="formValid" ref="form">
				<v-window v-model="formStep">
					<v-window-item :value="1">
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
       				<v-date-picker
								v-model="formDate"
								@input="datePopout=false"
							></v-date-picker>
						</v-menu>
						<v-text-field
							v-model="formSubtitle"
							label="Squad subtitle"
						></v-text-field>
						<v-combobox
							v-model="memberSelect"
							:items="members"
							label="Select a member or add one"
							multiple
							chips
							hide-selected
							:rules="[v => v.length > 0]"
						></v-combobox>
					</v-window-item>
					<v-window-item :value="2">
						<v-container
							v-for="(ms, idx) in memberSelect"
							:key="idx"
						>
							<v-row dense>
								<v-col align-self="center" cols="3">{{ ms.text || ms }}</v-col>
								<v-col>
									<v-text-field
										label="Enter session goals"
										hide-details
										outlined
										v-model="sessionGoalsData[idx]"
									></v-text-field>
								</v-col>
							</v-row>
						</v-container>
					</v-window-item>
					<v-window-item :value="3">
						<v-textarea
							label="Enter conditioning exercises"
							v-model="formConditioning"
						></v-textarea>
					</v-window-item>
					<v-window-item :value="4">
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
										:rules="[validTimeOfFlight]"
										v-model="timeOfFlightData[idx][0]"
									></v-text-field>
								</v-col>
								<v-col>
									<v-text-field
										label="Enter 2nd time of flight"
										hide-details
										outlined
										:rules="[validTimeOfFlight]"
										v-model="timeOfFlightData[idx][1]"
									></v-text-field>
								</v-col>
							</v-row>
						</v-container>
					</v-window-item>
				</v-window>
			</v-form>
		</v-card-text>
		<v-divider></v-divider>
		<v-card-actions>
			<v-btn
				v-if="formStep === 1"
				@click="$emit('close-form'); resetForm()"
				text
			>Close</v-btn>
			<v-btn
				v-else
				:disabled="formStep === 1"
				text
				@click="formStep--"
			>Back</v-btn>
			<v-spacer></v-spacer>
			<v-btn
				v-if="formStep < formSteps.length"
				:disabled="formStep === 1 && memberSelect.length === 0"
				@click="formStep++"
			>Next</v-btn>
			<v-btn
				v-else
				:disabled="!formValid" 
				@click="saveSession"
			>Save Session</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
import { requestsMixin } from '@/mixins/requestsMixin'
export default {
	mixins: [requestsMixin],
	data() {
		return {
			datePopout: false,
			formConditioning: '',
			formDate: new Date().toISOString().substr(0, 10),
			formStep: 1,
			formSteps: ['Add New Session', 'Session Goals', 'Conditioning', 'Enter Time of Flight Data'],
			formSubtitle: '',
			formValid: false,
			memberSelect: [],
			validTimeOfFlight: value => {
				const pv = parseFloat(value)
				return (value && value.toLowerCase() === '-') || (pv > 0 && pv < 30) || 'Invalid time entered.'
			}

		}
	},
	computed: {
		members() {
			return this.$store.getters.getAllMembers.map(m => ({
				text: m.name,
				value: m.id
			}))
		},
		timeOfFlightData() {
			const sd = []
			this.memberSelect.forEach(ms => {
				sd.push(Array(2))
			})
			return sd
		},
		sessionGoalsData() {
			return this.memberSelect.map(ms => '')
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
						times: this.timeOfFlightData[idx].filter(t => t !== '-').map(t => parseFloat(t))
					}
				} else {
					this.$store.dispatch('addMember', ms)
					return {
						id: this.$store.getters.getLastAddedMember.id,
						times: this.timeOfFlightData[idx].filter(t => t !== '-').map(t => parseFloat(t))
					}
				}
			})
			this.$store.dispatch('addSession', {
				date: this.formDate,
				subtitle: this.formSubtitle,
				tof
			}).then(() => {
				this.saveStateToDB()
				this.$emit('close-form')
				this.resetForm()
			})
		},
		resetForm() {
			if (this.$refs.form) {
				this.memberSelect = []
				this.formSubtitle = ''
				this.formStep = 1
				this.formConditioning = ''
				this.formDate = new Date().toISOString().substr(0, 10)
				this.$refs.form.resetValidation()
			}
		},
		async saveStateToDB() {
			await this.setStateToDB(this.$store.state)
		}
	}
}
</script>
