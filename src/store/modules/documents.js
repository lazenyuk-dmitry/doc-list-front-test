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
    setListState(state, data) {
      state.sortedList = data.sorted;
      state.unsortedList = data.unsorted;
    },
    updUnsortedDocs(state, data) {
      state.unsortedList = data;
    },
    updSortedDocs(state, data) {
      state.sortedList = data;
    },
  },
  actions: {
    fetchDocuments({ commit }) {
      commit("setListState", DOCUMENTS);
    },
    updUnsortedDocs({ commit }, data) {
      commit("updUnsortedDocs", data);
    },
    updSortedDocs({ commit }, data) {
      commit("updSortedDocs", data);
    },
  },
};
