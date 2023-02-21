import DOCUMENTS from "~constants/document-list.js";

export default {
  namespaced: true,
  state: () => ({
    list: null,
  }),
  getters: {
    getDocuments(state) {
      return state.list;
    },
  },
  mutations: {
    setListSate(state, data) {
      state.list = data;
    },
  },
  actions: {
    fetchDocuments({ commit }) {
      commit("setListSate", DOCUMENTS);
    },
  },
};
