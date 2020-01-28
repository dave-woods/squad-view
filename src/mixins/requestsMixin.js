const APIURL = "http://localhost:8082"
const axios = require("axios")

export const requestsMixin = {
  methods: {
    getStateFromDB() {
      return axios.get(`${APIURL}/state`)
    },
    setStateToDB(data) {
      return axios.put(`${APIURL}/state`, data)
    }
  }
}
