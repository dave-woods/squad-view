export default {
  state: {
    nextId: 12,
    members: [
      {
        id: 1,
        name: 'Cathal Hannafin'
      },
      {
        id: 2,
        name: 'Caitríona Quinn'
      },
      {
        id: 3,
        name: 'Adelais Farnell Sharp'
      },
      {
        id: 4,
        name: 'Seán Murray'
      },
      {
        id: 5,
        name: 'Alastair McGuckian'
      },
      {
        id: 6,
        name: 'Dave Woods'
      },
      {
        id: 7,
        name: 'Nessa Scorey'
      },
      {
        id: 8,
        name: 'Aisling Byrne'
      },
      {
        id: 9,
        name: 'Kim Sheehan Thomas'
      },
      {
        id: 10,
        name: 'Conor Kiely'
      },
      {
        id: 11,
        name: 'Órlaith Geary'
      }
    ]
  },
  getters: {
    getAllMembers: state => state.members,
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
    }
  },
  actions: {
    addMember({ commit }, newMember) {
      commit('addMember', newMember)
    }
  }
}
