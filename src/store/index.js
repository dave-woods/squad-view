import Vue from 'vue'
import Vuex from 'vuex'

import SessionsModule from './modules/SessionsModule'
import MembersModule from './modules/MembersModule'
import SettingsModule from './modules/SettingsModule'
import ExercisesModule from './modules/ExercisesModule'
import CompetitionsModule from './modules/CompetitionsModule'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    settingsDrawerOpen: false,
    isFullScreen: false,
    hideScrollbar: true,
    internalDate: null,
    internalDateInterval: null
  },
  mutations: {
    setSettingsDrawerOpen(state, open) {
      state.settingsDrawerOpen = open
    },
    setFullScreen(state, fullscreen) {
      state.isFullScreen = fullscreen
    },
    setHideScrollbar(state, hidden) {
      state.hideScrollbar = hidden
    },
    startInternalDate(state) {
      if (!state.internalDateInterval) {
        state.internalDateInterval = setInterval(() => this.commit('updateInternalDate'), 1000)
      }
    },
    updateInternalDate(state) {
      state.internalDate = new Date()
    }
  },
  actions: {
    setSettingsDrawerOpen({ commit }, open) {
      commit('setSettingsDrawerOpen', open)
    },
    setFullScreen({ commit }, fullscreen) {
      commit('setFullScreen', fullscreen)
    },
    setHideScrollbar({ commit }, hidden) {
      commit('setHideScrollbar', hidden)
    }
  },
  modules: {
    sessions: SessionsModule,
    members: MembersModule,
    settings: SettingsModule,
    exercises: ExercisesModule,
    competitions: CompetitionsModule
  }
})
