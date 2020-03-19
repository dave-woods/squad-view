export default {
    state: {
        showSingleSession: false,
        trimEmpty: true,
        editSessions: false,
        startDate: new Date(0),
        endDate: new Date()
    },
    getters: {
        getStartDate: state => new Date(state.startDate),
        getEndDate: state => new Date(state.endDate),
    },
    mutations: {
        setShowSingleSession(state, val) {
            state.showSingleSession = val
        },
        setTrimEmpty(state, val) {
            state.trimEmpty = val
        },
        setEditSessions(state, val) {
            state.editSessions = val
        },
        setStartDate(state, val) {
            state.startDate = val
        },
        setEndDate(state, val) {
            state.endDate = val
        },
        updateSettingsState(state, newState) {
            state.showSingleSession = newState.showSingleSession
            state.trimEmpty = newState.trimEmpty
            state.editSessions = newState.editSessions
            state.startDate = newState.startDate
            state.endDate = newState.endDate
        }
    },
    actions: {
        setShowSingleSession({ commit }, val) {
            commit('setShowSingleSession', val)
        },
        setTrimEmpty({ commit }, val) {
            commit('setTrimEmpty', val)
        },
        setEditSessions({ commit }, val) {
            commit('setEditSessions', val)
        },
        setStartDate({ commit }, val) {
            commit('setStartDate', val)
        },
        setEndDate({ commit }, val) {
            commit('setEndDate', val)
        },
        updateSettingsState({ commit }, val) {
            commit('updateSettingsState', val)
        }
    }
}