import Vue from "vue";
import Vuex from "vuex";
import { Auth } from "aws-amplify";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
  },
  mutations: {
    SET_USER_DATA(state, data) {
      state.user = data;
    },
  },
  actions: {
    async logout({ commit }) {
      commit("SET_USER_DATA", null);
      return await Auth.signOut();
    },
  },
  modules: {},
});
