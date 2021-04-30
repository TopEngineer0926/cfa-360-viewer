<template>
  <v-container>
    <v-img src="@/assets/logo.png" contain max-height="120" class="mb-3 mt-8">
    </v-img>
    <amplify-authenticator>
      <amplify-sign-in header-text="" hide-sign-up slot="sign-in">
        <div slot="federated-buttons"></div
      ></amplify-sign-in>
    </amplify-authenticator>
  </v-container>
</template>

<script>
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
import { mapState } from "vuex";

export default {
  name: "Home",
  computed: mapState(["user"]),
  created() {
    this.$store.commit("SET_NAVBAR_TEXT", null);
    onAuthUIStateChange(async (nextAuthState, authData) => {
      if (nextAuthState === AuthState.SignedIn) {
        await this.$store.dispatch("login", authData);
        this.$router.push({ path: "/panolist" });
      }
      if (!authData) {
        this.$store.commit("SET_USER_NULL");
      }
    });
  },

  beforeDestroy() {
    return onAuthUIStateChange;
  },
};
</script>
<style>
amplify-authenticator {
  --container-height: 100%;
  --box-shadow: 0;
}
</style>