import Vue from "vue";
import Vuex from "vuex";
import { Auth } from "aws-amplify";
import { API, graphqlOperation } from "aws-amplify";

import {
  getSitePermission
} from "../graphql/queries";


Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    navbarText: null,
    roleDefinitionTable: null
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
    SET_ROLE_DEFINATION_TABLE(state, data) {
      state.roleDefinitionTable = data;
    },
  },
  actions: {
    async logout({ commit }) {
      commit("SET_USER_NULL");
      return await Auth.signOut();
    },
    async login({ commit }, data) {


      // API.get("index", "/index/users").then(usersData => console.log('usersData', usersData))
      let sitePermission = (
        await API.graphql(
          graphqlOperation(getSitePermission, { id: data.username })
        )
      ).data.getSitePermission;

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
      // let ifSiteAdmin = false;
      // try {
      //   if (data.signInUserSession.accessToken.payload["cognito:groups"].includes('360Admin')) { ifSiteAdmin = true }
      // }
      // catch { ifSiteAdmin = false }
      commit("SET_USER_DATA", {
        username: data.username,
        name: data.attributes.name,
        email: data.attributes.email,
        guest: data.username == '360TempSharing' ? true : false,
        masterSiteAdmin: ['yao.chenATviatechnik.com1', 'corey.overtonATcfacorp.com', 'juhun.leeATviatechnik.com', 'kyle.hudsonATviatechnik.com'].includes(data.username) ? true : false,
        siteAdmin: sitePermission ? true : false
      });


    },

  },
  modules: {},
});
