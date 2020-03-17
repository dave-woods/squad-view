export default {
  state: {
    sessions: []
  },
  getters: {
    getAvgTimesById: state => id => state.sessions.map(sess => {
      const mem = sess.attendees.find(m => m.id === id)
      if (!mem || mem.times.length === 0) {
        return 0
      }
      return mem.times.reduce(
        (a, b) => a + b
      ) / mem.times.length
    }),
    getAllAttendancesById: state => id => state.sessions.map(sess => sess.attendees.find(m => m.id === id)),
    getSessions: state => state.sessions
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
