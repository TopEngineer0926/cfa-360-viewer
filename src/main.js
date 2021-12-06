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


Amplify.configure(awsconfig);


Amplify.configure({
  Auth: {

    // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
    identityPoolId: 'us-east-2:71d5d37f-833f-4493-870f-44933bddb89d',

    // REQUIRED - Amazon Cognito Region
    region: 'us-east-2',

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'us-east-2_UCbUOtQYX',

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '3g2pvp6o6eai3rl87h5ifnskrh',

    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    // mandatorySignIn: false,

    // OPTIONAL - Configuration for cookie storage
    // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
    cookieStorage: {
      // REQUIRED - Cookie domain (only required if cookieStorage is provided)
      // domain: window.location.hostname === 'localhost' ? window.location.hostname : '.cfadesigntechnology.com',
      domain: '.cfadesigntechnology.com',
      // OPTIONAL - Cookie path
      // path: '/',
      // // OPTIONAL - Cookie expiration in days
      // expires: 365,
      // // OPTIONAL - See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
      sameSite: "strict" | "lax",
      // OPTIONAL - Cookie secure flag
      // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
      secure: false
    },

    // // OPTIONAL - customized storage object
    // storage: MyStorage,

    // // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
    // authenticationFlowType: 'USER_PASSWORD_AUTH',

    // // OPTIONAL - Manually set key value pairs that can be passed to Cognito Lambda Triggers
    // clientMetadata: { myCustomKey: 'myCustomValue' },

    // // OPTIONAL - Hosted UI configuration
    // oauth: {
    //   domain: 'your_cognito_domain',
    //   scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
    //   redirectSignIn: 'http://localhost:3000/',
    //   redirectSignOut: 'http://localhost:3000/',
    //   responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
    // }
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
