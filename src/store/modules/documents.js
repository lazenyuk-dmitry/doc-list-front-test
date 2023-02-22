import DOCUMENTS from "~constants/document-list.js";

export default {
  namespaced: true,
  state: () => ({
    sortedList: null,
    unsortedList: null,
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
  },
  actions: {
    fetchDocuments({ commit }) {
      commit("setListSate", DOCUMENTS);
    },
  },
};
