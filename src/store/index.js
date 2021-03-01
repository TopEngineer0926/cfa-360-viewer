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
      let ifAdmin = false;
      try {
        if (data.signInUserSession.accessToken.payload["cognito:groups"].includes('360Admin')) { ifAdmin = true }
      }
      catch { ifAdmin = false }
      state.user = {
        name: data.attributes.name,
        email: data.attributes.email,
        admin: ifAdmin
      };


    },
    SET_USER_NULL(state) {
      state.user = null;
    },
  },
  actions: {
    async logout({ commit }) {
      commit("SET_USER_NULL");
      return await Auth.signOut();
    },
  },
  modules: {},
});
