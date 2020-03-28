const APIURL = "http://localhost:8082"
const axios = require("axios")
const MODULE_NAMES = [
  'sessions',
  'members',
  'settings',
  'exercises',
  'competitions'
]

export const requestsMixin = {
  methods: {
    async getStateFromDB() {
      var { data: sessions } = await axios.get(`${APIURL}/sessions`)
      var { data: members } = await axios.get(`${APIURL}/members`)
      var { data: settings } = await axios.get(`${APIURL}/settings`)
      var { data: exercises } = await axios.get(`${APIURL}/exercises`)
      var { data: competitions } = await axios.get(`${APIURL}/competitions`)
      return {
        sessions,
        members,
        settings,
        exercises,
        competitions
      }
    },
    async setStateToDB(data, moduleName) {
      if (moduleName) {
        await axios.put(`${APIURL}/${moduleName}`, data[moduleName])
      } else {
        MODULE_NAMES.forEach(async m => await axios.put(`${APIURL}/${m}`, data[m]))
      }
    },
    async loadStateFromDB() {
			const data = await this.getStateFromDB()
			this.$store.dispatch('updateMembersState', data.members)
			this.$store.dispatch('updateSessionsState', data.sessions)
			this.$store.dispatch('updateSettingsState', data.settings)
			this.$store.dispatch('updateExercisesState', data.exercises)
			this.$store.dispatch('updateCompetitionsState', data.competitions)
		},
		async saveStateToDB(moduleName = undefined) {
      if (moduleName && MODULE_NAMES.includes(moduleName)) {
        await this.setStateToDB(this.$store.state, moduleName)
      } else {
        await this.setStateToDB(this.$store.state)
      }
    }
  }
}
