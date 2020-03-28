export default {
    state: {
      competitions: [],
      nextId: 0
    },
    getters: {
      getCompetitions: (state, getters) => state.competitions.filter(c => {
        return new Date(c.endDate) >= getters.getStartDate && new Date(c.startDate) <= getters.getEndDate
      }),
      getCompetitionsByMember: (state, getters) => id => getters.getCompetitions.filter(c => c.competitors.map(m => m.id).includes(id))
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
  