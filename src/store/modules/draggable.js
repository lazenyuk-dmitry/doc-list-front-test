export default {
  namespaced: true,
  state: () => ({
    oldArray: null,
    draggableItem: null,
  }),
  getters: {
    getOldArray(state) {
      return state.oldArray;
    },
    getDraggableItem(state) {
      return state.draggableItem;
    },
  },
  mutations: {
    setOldArray(state, array) {
      state.oldArray = array;
    },
    setDraggableItem(state, object) {
      state.draggableItem = object;
    },
    clear(state) {
      state.oldArray = null;
      state.draggableItem = null;
    },
  },
  actions: {
    setOldArray({ commit }, array) {
      commit("setOldArray", array);
    },
    setDraggableItem({ commit }, object) {
      commit("setDraggableItem", object);
    },
    clear({ commit }) {
      commit("clear");
    },
  },
};
