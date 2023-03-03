import { createStore } from "vuex";
import documents from "./modules/documents";

export default createStore({
  modules: {
    documents,
  },
});
