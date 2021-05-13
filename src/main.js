import Vue from "vue";
import App from "./App.vue";

import * as serviceWorker from "./serviceWorker";
serviceWorker.unregister();

import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

import '@aws-amplify/ui-vue';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

Vue.config.productionTip = false;

import VueYoutube from 'vue-youtube'
Vue.use(VueYoutube)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
