export default {
    state: {
      sessions: []
    },
    getters: {
      getExerciseSessions: state => state.sessions
    },
    mutations: {
      addExercise(state, newExercise) {
        state.sessions[newExercise.sessionIdx].exercises.push(newExercise.exercise)
      },
      addExerciseSession(state, newSession) {
        state.sessions = [...state.sessions, newSession].sort((a, b) => new Date(a.date) - new Date(b.date))
      },
      updateExercisesState(state, newState) {
        state.sessions = [...newState.sessions]
      }
    },
    actions: {
      addExercise({ commit }, newExercise) {
        commit('addExercise', newExercise)
      },
      addExerciseSession({ commit }, newSession) {
        commit('addExerciseSession', newSession)
      },
      updateExercisesState({ commit }, newState) {
        commit('updateExercisesState', newState)
      }
    }
  }
  