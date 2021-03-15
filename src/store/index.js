import Vue from "vue";
import Vuex from "vuex";
import { Auth } from "aws-amplify";
import { API } from "aws-amplify";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
  },
  mutations: {
    SET_USER_DATA(state, data) {
      state.user = data;
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
    login({ commit }, data) {
      return new Promise(async (resolve, reject) => {
        let indexAuthData = await API.get("indexapi", "/index/auth", {
          queryStringParameters: {
            id: data.attributes.sub,
          },
        });
        commit("SET_USER_DATA", {
          name: data.attributes.name,
          email: data.attributes.email,
          admin: indexAuthData.success.permission == 'CFA Admin',
        });
        resolve();
      });
    },

  },
  modules: {},
});
