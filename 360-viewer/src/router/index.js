import Vue from "vue";
import VueRouter from "vue-router";
import { Auth } from "aws-amplify";

import store from "../store"

import Home from "../views/Home.vue";
import Pano from "../views/Pano.vue";
import PanoList from "../views/PanoList.vue";

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
    path: "/pano/:id",
    name: "Pano",
    component: Pano,
    meta: { requiresAuth: true }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeResolve((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    Auth.currentAuthenticatedUser()
      .then((authData) => {
        console.log('welcome', authData.attributes);
        if (!store.state.user) { store.commit("SET_USER_DATA", authData.attributes) }
        next();
      })
      .catch(() => {
        console.log('unauth');
        if (store.state.user) { store.commit("SET_USER_DATA", null) }
        next({
          path: "/"
        });
      });
  } else {
    next();
  }
});

export default router;
