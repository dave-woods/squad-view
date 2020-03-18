export default {
  state: {
    sessions: []
  },
  getters: {
    getAvgTimesById: (state, getters) => id => getters.getSessions.map(s => {
      const mem = s.attendees.find(m => m.id === id)
      if (!mem || mem.times.length === 0) {
        return 0
      }
      return mem.times.reduce(
        (a, b) => a + b
      ) / mem.times.length
    }),
    getAllAttendancesById: (state, getters) => id => getters.getSessions.map(s => s.attendees.find(m => m.id === id)),
    getSessions: (state, getters) => state.sessions.filter(s => {
      var d = new Date(s.date)
      return d >= getters.getStartDate && d <= getters.getEndDate
    }),
    getDateRange: state => [state.sessions[0]?.date, state.sessions[state.sessions.length-1]?.date]
  },
  mutations: {
    addSession(state, newSession) {
      state.sessions = [...state.sessions, newSession].sort((a, b) => new Date(a.date) - new Date(b.date))
    },
    updateSession(state, session) {
      var idx = state.sessions.findIndex(s => s.date === session.date)
      if (idx > -1) {
        state.sessions = [
          ...state.sessions.slice(0, idx),
          session,
          ...state.sessions.slice(idx+1)
        ]
      }
    },
    updateSessionsState(state, newState) {
      state.sessions = [...newState.sessions]
    }
  },
  actions: {
    addSession({ commit }, newSession) {
      commit('addSession', newSession)
    },
    updateSession({ commit }, session) {
      commit('updateSession', session)
    },
    updateSessionsState({ commit }, newState) {
      commit('updateSessionsState', newState)
    }
  }
}
