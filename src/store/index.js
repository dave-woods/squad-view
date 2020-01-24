import Vue from 'vue'
import Vuex from 'vuex'

import SessionsModule from './modules/SessionsModule'
import MembersModule from './modules/MembersModule'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    sessions: SessionsModule,
    members: MembersModule
  }
})
