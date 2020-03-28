export default {
    state: {
      competitions: [],
      nextId: 0
    },
    getters: {
      getCompetitions: state => state.competitions
    },
    mutations: {
      addCompetitor(state, { competitionId, competitor }) {
        state.competitions
          .find(c => c.id === competitionId)
            .competitors.push(competitor)
      },
      addCompetition(state, newCompetition) {
        state.competitions = [...state.competitions, { id: state.nextId, ...newCompetition}].sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
        state.nextId = state.nextId + 1
      },
      updateCompetitionsState(state, newState) {
        state.competitions = [...newState.competitions]
        state.nextId = newState.nextId
      }
    },
    actions: {
      addCompetitor({ commit }, newCompetitor) {
        commit('addCompetitor', newCompetitor)
      },
      addCompetition({ commit }, newCompetition) {
        commit('addCompetition', newCompetition)
      },
      updateCompetitionsState({ commit }, newState) {
        commit('updateCompetitionsState', newState)
      }
    }
  }
  