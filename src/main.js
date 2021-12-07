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
import {
  CookieStorage,
} from "amazon-cognito-identity-js";

window.LOG_LEVEL = "DEBUG";

console.log('window.location.hostname: ', window.location.hostname);
console.log('domain: ', window.location.hostname === 'localhost' ? window.location.hostname : '.cfadesigntechnology.com');
Amplify.configure({
  ...awsconfig,
  Auth: {
    ...awsconfig,
    identityPoolId: 'us-east-2:71d5d37f-833f-4493-870f-44933bddb89d',
    region: 'us-east-2',
    identityPoolRegion: 'us-east-2',
    userPoolId: 'us-east-2_UCbUOtQYX',
    userPoolWebClientId: '3g2pvp6o6eai3rl87h5ifnskrh',
    mandatorySignIn: false,
    Storage: new CookieStorage({
      secure: false,
      domain: window.location.hostname === 'localhost' ? window.location.hostname : '.cfadesigntechnology.com',
    }),
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
