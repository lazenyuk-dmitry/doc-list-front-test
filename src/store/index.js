import { createStore } from "vuex";
import documents from "./modules/documents";
import draggable from "./modules/draggable";

export default createStore({
  modules: {
    documents,
    draggable,
  },
});
