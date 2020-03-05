<template>
	<v-card>
		<v-card-title>Add New Session</v-card-title>
		<v-card-text>
			<v-form class="pa-2" v-model="formValid" ref="form">
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
								:rules="[validTimeOfFlight]"
								v-model="saveData[idx][0]"
							></v-text-field>
						</v-col>
						<v-col>
							<v-text-field
								label="Enter 2nd time of flight"
								hide-details
								outlined
								:rules="[validTimeOfFlight]"
								v-model="saveData[idx][1]"
							></v-text-field>
						</v-col>
					</v-row>
				</v-container>
				<v-btn :disabled="!formValid" @click="saveSession">
					Save Session
				</v-btn>
			</v-form>
		</v-card-text>
	</v-card>
</template>

<script>
export default {
	data() {
		return {
			datePopout: false,
			formDate: new Date().toISOString().substr(0, 10),
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
		saveData() {
			const sd = []
			this.memberSelect.forEach(ms => {
				sd.push(Array(2))
			})
			return sd
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
						times: this.saveData[idx].filter(t => t !== '-').map(t => parseFloat(t))
					}
				} else {
					this.$store.dispatch('addMember', ms)
					return {
						id: this.$store.getters.getLastAddedMember.id,
						times: this.saveData[idx].filter(t => t !== '-').map(t => parseFloat(t))
					}
				}
			})
			this.$store.dispatch('addSession', {
				date: this.formDate,
				tof
			}).then(() => {
				this.saveStateToDB()
				this.resetForm()
			})
		},
		resetForm() {
			if (this.$refs.form) {
				this.memberSelect = []
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
