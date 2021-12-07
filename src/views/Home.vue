<template>
  <v-container>
    <v-img src="@/assets/logo.png" contain max-height="120" class="mb-3 mt-8">
    </v-img>
    <v-text-field v-model="email" label="Email"></v-text-field>
    <v-text-field v-model="pw" label="Password"></v-text-field>
    <!-- <amplify-authenticator>
      <amplify-sign-in header-text="" hide-sign-up slot="sign-in">
        <div slot="federated-buttons"></div
      ></amplify-sign-in>
    </amplify-authenticator> -->
    <v-btn @click="signin"> Log in</v-btn>
  </v-container>
</template>

<script>
// import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
import { Auth } from "aws-amplify";
import { mapState } from "vuex";

export default {
  name: "Home",
  data: function () {
    return {
      email: null,
      pw: null,
    };
  },
  computed: mapState(["user"]),
  created() {
    this.$store.commit("SET_NAVBAR_TEXT", null);

    // this.unsubscribeAuth = onAuthUIStateChange(
    //   async (nextAuthState, authData) => {
    //     console.log("nextAuthState, authData", nextAuthState, authData);
    //     if (nextAuthState === AuthState.SignedIn) {
    //       await this.$store.dispatch("login", authData);
    //       this.$router.push({ path: "/panolist" });
    //     }
    //     if (!authData) {
    //       this.$store.commit("SET_USER_NULL");
    //     }
    //   }
    // );
  },

  methods: {
    signin() {
      Auth.signIn(this.email, this.pw)
        .then(async (user) => {
          console.log(user);
          await this.$store.dispatch("login", user);
          this.$router.push({ path: "/panolist" });
        })
        .catch((err) => console.log(err));
    },
  },

  // beforeDestroy() {
  //   this.unsubscribeAuth();
  // },
};
</script>
<style>
amplify-authenticator {
  --container-height: 100%;
  --box-shadow: 0;
}
</style>