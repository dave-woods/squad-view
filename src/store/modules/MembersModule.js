export default {
  state: {
    nextId: 1,
    members: []
  },
  getters: {
    getAllMembers: state => state.members,
    getLastAddedMember: state => state.members[state.members.length - 1],
    getMemberByName: state => name => state.members.find(m => m.name === name),
    getMemberById: state => id => state.members.find(m => m.id === id)
  },
  mutations: {
    addMember(state, newMember) {
      state.members = [
        ...state.members,
        {
          id: state.nextId,
          ...newMember
        }
      ]
      state.nextId++
    },
    updateMember(state, member) {
      var idx = state.members.findIndex(m => m.id === member.id)
      if (idx > -1) {
        state.members = [
          ...state.members.slice(0, idx),
          member,
          ...state.members.slice(idx+1)
        ]
      }
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
    updateMember({ commit }, member) {
      commit('updateMember', member)
    },
    updateMembersState({ commit }, newState) {
      commit('updateMembersState', newState)
    }
  }
}
