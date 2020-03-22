const APIURL = "http://localhost:8082"
const axios = require("axios")

export const requestsMixin = {
  methods: {
    async getStateFromDB() {
      var { data: sessions } = await axios.get(`${APIURL}/sessions`)
      var { data: members } = await axios.get(`${APIURL}/members`)
      var { data: settings } = await axios.get(`${APIURL}/settings`)
      var { data: exercises } = await axios.get(`${APIURL}/exercises`)
      return {
        sessions,
        members,
        settings,
        exercises
      }
    },
    async setStateToDB(data) {
      await axios.put(`${APIURL}/sessions`, data.sessions)
      await axios.put(`${APIURL}/members`, data.members)
      await axios.put(`${APIURL}/settings`, data.settings)
      await axios.put(`${APIURL}/exercises`, data.exercises)
    }
  }
}
