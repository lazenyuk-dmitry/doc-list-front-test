import DOCUMENTS from "~constants/document-list.js";

export default {
  namespaced: true,
  state: () => ({
    sortedList: [],
    unsortedList: [],
  }),
  getters: {
    getSortedDocuments(state) {
      return state.sortedList;
    },
    getUnsortedDocuments(state) {
      return state.unsortedList;
    },
  },
  mutations: {
    setListSate(state, data) {
      state.sortedList = data.sorted;
      state.unsortedList = data.unsorted;
    },
    updUnsortedDocs(state, data) {
      state.unsortedList = data;
    },
  },
  actions: {
    fetchDocuments({ commit }) {
      commit("setListSate", DOCUMENTS);
    },
    updUnsortedDocs({ commit }, data) {
      commit("updUnsortedDocs", data);
    },
  },
};
