import Vue from "vue";
import VueRouter from "vue-router";
import { Auth } from "aws-amplify";

import store from "../store"

import Home from "../views/Home.vue";
import PanoList from "../views/PanoList.vue";
import { API, graphqlOperation } from "aws-amplify";
import { getSiteSetting } from "../graphql/queries";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/panolist",
    name: "PanoList",
    component: PanoList,
    meta: { requiresAuth: true }
  },
  {
    path: "/pano/:id/:password?",
    name: "Pano",
    component: () => import('../views/Pano.vue'),
    meta: { requiresAuth: true, tempLogin: true }
  },
  {
    path: "/panosetting/:id",
    name: "PanoSetting",
    component: () => import('../views/PanoSetting.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/admin",
    name: "Admin",
    component: () => import('../views/Admin.vue'),
    meta: { requiresAuth: true }
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeResolve((to, from, next) => {
  if (to.matched.some(record => record.meta.tempLogin) && to.params.password) {
    Auth.signIn('360TempSharing', 'bhnjcvP94DFAY6Bn').then(async (authData) => { await store.dispatch("login", authData); next() })
  }
  else if (to.matched.some(record => record.meta.requiresAuth)) {
    Auth.currentAuthenticatedUser()
      .then(async (authData) => {

        if (authData.attributes.email !== '360TempSharing@360TempSharing.com') {
          if (!store.state.user) {
            await store.dispatch("login", authData);
          }


          //Get Role Defination
          if (!store.state.roleDefinitionTable) {
            let res = await API.graphql(
              graphqlOperation(getSiteSetting, { type: "role-definition" })
            )
            store.commit(
              "SET_ROLE_DEFINATION_TABLE",
              JSON.parse(res.data.getSiteSetting.config).roleTable
            );
          }



          next();
        }

      })
      .catch(() => {
        console.log('unauth');
        if (store.state.user) { store.commit("SET_USER_NULL") }
        next({
          path: "/"
        });
      });
  } else {
    next();
  }
});

export default router;
