export default {
  namespaced: true,
  state: () => ({
    oldArray: null,
  }),
  getters: {
    getOldArray(state) {
      return state.oldArray;
    },
  },
  mutations: {
    setOldArray(state, array) {
      state.oldArray = array;
    },
    clear(state) {
      state.oldArray = null;
    },
  },
  actions: {
    setOldArray({ commit }, array) {
      commit("setOldArray", array);
    },
    clear({ commit }) {
      commit("clear");
    },
  },
};
