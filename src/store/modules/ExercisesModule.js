export default {
    state: {
      sessions: []
    },
    getters: {
      getExerciseSessions: state => state.sessions
    },
    mutations: {
      addExerciseSession(state, newSession) {
        state.sessions = [...state.sessions, newSession].sort((a, b) => new Date(a.date) - new Date(b.date))
      },
      updateExercisesState(state, newState) {
        state.sessions = [...newState.sessions]
      }
    },
    actions: {
      addExerciseSession({ commit }, newSession) {
        commit('addExerciseSession', newSession)
      },
      updateExercisesState({ commit }, newState) {
        commit('updateExercisesState', newState)
      }
    }
  }
  