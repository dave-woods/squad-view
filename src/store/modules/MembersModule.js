export default {
  state: {
    nextId: 1,
    members: []
  },
  getters: {
    getAllMembers: state => state.members,
    getLastAddedMember: state => state.members[state.members.length - 1],
    getMemberByName: state => name => state.members.find(m => m.name === name)
  },
  mutations: {
    addMember(state, newMember) {
      state.members = [
        ...state.members,
        {
          id: state.nextId,
          name: newMember
        }
      ]
      state.nextId++
    },
    updateMembersState(state, newState) {
      state.members = [...newState.members]
      state.nextId = newState.nextId
    }
  },
  actions: {
    addMember({ commit }, newMember) {
      commit('addMember', newMember)
    },
    updateMembersState({ commit }, newState) {
      commit('updateMembersState', newState)
    }
  }
}
