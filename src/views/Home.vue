<template>
  <v-container>
    <v-img src="@/assets/logo.png" contain max-height="120" class="mb-3 mt-8">
    </v-img>
    <v-row class="justify-center mt-12">
      <v-card flat width="600px">
        <v-card-text>
          <v-text-field v-model="email" label="Email"></v-text-field>
          <v-text-field
            v-model="pw"
            label="Password"
            type="password"
          ></v-text-field>
        </v-card-text>

        <!-- <amplify-authenticator>
      <amplify-sign-in header-text="" hide-sign-up slot="sign-in">
        <div slot="federated-buttons"></div
      ></amplify-sign-in>
    </amplify-authenticator> -->

        <v-card-actions class="justify-center">
          <v-btn @click="signin" color="primary"> Log in</v-btn>
        </v-card-actions>
      </v-card></v-row
    >
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

    Auth.currentUserInfo()
      .then(async (user) => {
        console.log("currentSession", user);
        if (user) {
          if (user.attributes.email == "360TempSharing@360TempSharing.com") {
            this.$store.commit("SET_USER_NULL");
          } else {
            await this.$store.dispatch("login", user);
            this.$router.push({ path: "/panolist" });
          }
        }
      })
      .catch((err) => console.log(err));

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
        .catch((err) => {
          alert(err);
          console.log(err);
        });
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