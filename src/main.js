import Vue from "vue";
import App from "./App.vue";


import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

import {
  applyPolyfills,
  defineCustomElements,
} from '@aws-amplify/ui-components/loader';

import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';

window.LOG_LEVEL = "DEBUG";

console.log('window.location.hostname: ', window.location.hostname);
console.log('domain: ', window.location.hostname === 'localhost' ? window.location.hostname : '.cfadesigntechnology.com');
Amplify.configure({
  ...awsconfig,
  Auth: {
    ...awsconfig,
    mandatorySignIn: false,
    cookieStorage: {
      // REQUIRED - Cookie domain (only required if cookieStorage is provided)
      domain: window.location.hostname === 'localhost' ? window.location.hostname : '.cfadesigntechnology.com',
      // domain: '.cfadesigntechnology.com',
      // OPTIONAL - Cookie path
      path: '/',
      // // OPTIONAL - Cookie expiration in days
      expires: 365,
      // // OPTIONAL - See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
      // sameSite: "lax",
      // OPTIONAL - Cookie secure flag
      // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
      secure: false
    },
  }
});

applyPolyfills().then(() => {
  defineCustomElements(window);
});
Vue.config.ignoredElements = [/amplify-\w*/];

Vue.config.productionTip = false;

import VueYoutube from 'vue-youtube'
Vue.use(VueYoutube)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
