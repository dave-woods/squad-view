export default {
  state: {
    sessions: []
  },
  getters: {
    getAvgTimesById: state => id => state.sessions.map(sess => {
      const mem = sess.tof.find(m => m.id === id)
      if (!mem || mem.times.length === 0) {
        return 0
      }
      return mem.times.reduce(
        (a, b) => a + b
      ) / mem.times.length
    }),
    getSessions: state => state.sessions
  },
  mutations: {
    addSession(state, newSession) {
      state.sessions = [...state.sessions, newSession]
    },
    updateSessionsState(state, newState) {
      state.sessions = [...newState.sessions]
    }
  },
  actions: {
    addSession({ commit }, newSession) {
      commit('addSession', newSession)
    },
    updateSessionsState({ commit }, newState) {
      commit('updateSessionsState', newState)
    }
  }
}
