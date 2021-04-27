import Vue from "vue";
import Vuex from "vuex";
import { Auth } from "aws-amplify";
import { API } from "aws-amplify";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    navbarText: null
  },
  mutations: {
    SET_USER_DATA(state, data) {
      state.user = data;
    },
    SET_USER_NULL(state) {
      state.user = null;
    },
    SET_NAVBAR_TEXT(state, data) {
      state.navbarText = data;
    },
  },
  actions: {
    async logout({ commit }) {
      commit("SET_USER_NULL");
      return await Auth.signOut();
    },
    login({ commit }, data) {


      // API.get("index", "/index/users").then(usersData => console.log('usersData', usersData))


      // return new Promise(async (resolve, reject) => {
      //   let indexAuthData = await API.get("indexapi", "/index/auth", {
      //     queryStringParameters: {
      //       id: data.attributes.sub,
      //     },
      //   });
      //   commit("SET_USER_DATA", {
      //     name: data.attributes.name,
      //     email: data.attributes.email,
      //     admin: indexAuthData.success.permission == 'CFA Admin',
      //   });
      //   resolve();
      // });
      let ifAdmin = false;
      try {
        if (data.signInUserSession.accessToken.payload["cognito:groups"].includes('360Admin')) { ifAdmin = true }
      }
      catch { ifAdmin = false }
      commit("SET_USER_DATA", {
        username: data.username,
        name: data.attributes.name,
        email: data.attributes.email,
        admin: ifAdmin
      });


    },

  },
  modules: {},
});
