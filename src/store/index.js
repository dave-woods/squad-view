import Vue from 'vue'
import Vuex from 'vuex'

import SessionsModule from './modules/SessionsModule'
import MembersModule from './modules/MembersModule'
import SettingsModule from './modules/SettingsModule'
import ExercisesModule from './modules/ExercisesModule'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    settingsDrawerOpen: false
  },
  mutations: {
    setSettingsDrawerOpen(state, open) {
      state.settingsDrawerOpen = open
    }
  },
  actions: {
    setSettingsDrawerOpen({ commit }, open) {
      commit('setSettingsDrawerOpen', open)
    }
  },
  modules: {
    sessions: SessionsModule,
    members: MembersModule,
    settings: SettingsModule,
    exercises: ExercisesModule
  }
})
