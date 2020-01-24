export default {
  state: {
    sessions: [
      {
        date: '2019-10-08',
        tof: [
          {
            id: 1,
            times: [14.99, 15.39]
          },
          {
            id: 2,
            times: [15.54, 15.47]
          }
        ]
      },
      {
        date: '2019-10-19',
        tof: [
          {
            id: 1,
            times: [15.62, 15.98]
          },
          {
            id: 2,
            times: [15.20, 14.92]
          },
          {
            id: 3,
            times: [16.28, 16.42]
          },
          {
            id: 4,
            times: [17.26, 17.16]
          },
          {
            id: 5,
            times: [17.35]
          },
          {
            id: 6,
            times: [17.57, 17.91]
          }
        ]
      },
      {
        date: '2019-10-22',
        tof: [
          {
            id: 5,
            times: [16.42, 16.19]
          },
          {
            id: 1,
            times: [15.69]
          },
          {
            id: 2,
            times: [15.28, 15.70]
          },
          {
            id: 7,
            times: [14.66, 15.26]
          },
          {
            id: 8,
            times: [15.69, 15.64]
          },
          {
            id: 4,
            times: [17.27, 16.96]
          },
          {
            id: 9,
            times: [15.23, 15.42]
          },
          {
            id: 6,
            times: [16.89]
          }
        ]
      },
      {
        date: '2019-11-05',
        tof: [
          {
            id: 6,
            times: [17.57, 17.43]
          },
          {
            id: 2,
            times: [15.78, 15.92]
          },
          {
            id: 10,
            times: [19.16, 19.28]
          },
          {
            id: 11,
            times: [15.91, 15.79]
          },
          {
            id: 8,
            times: [15.66, 15.57]
          },
          {
            id: 5,
            times: [15.84, 16.44]
          },
          {
            id: 4,
            times: [16.87, 16.97]
          }
        ]
      }
    ]
  },
  getters: {
    getAvgTimesById: state => id => state.sessions.map(sess => {
      const mem = sess.tof.find(m => m.id === id)
      if (!mem) {
        return 0
      }
      return mem.times.reduce(
        (a, b) => a + b
      ) / mem.times.length
    }),
    getSessions: state => state.sessions
  },
  mutations: {
    addSession(state, newSession) {
      state.sessions = [...state.sessions, newSession]
    }
  },
  actions: {
    addSession({ commit }, newSession) {
      commit('addSession', newSession)
    }
  }
}
