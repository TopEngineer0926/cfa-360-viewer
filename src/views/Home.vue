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
import { API } from "aws-amplify";
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
import { mapState } from "vuex";

export default {
  name: "Home",
  computed: mapState(["user"]),
  created() {
    onAuthUIStateChange((nextAuthState, authData) => {
      if (nextAuthState === AuthState.SignedIn) {
        this.$store.commit("SET_USER_DATA", authData);
        this.getAuth(authData.attributes.sub);
        this.$router.push({ path: "/panolist" });
      }
      if (!authData) {
        this.$store.commit("SET_USER_NULL");
      }
    });
  },

  methods: {
    async getAuth(id) {
      const items = await API.get("indexapi", "/index/auth", {
        queryStringParameters: {
          id: id,
        },
      });
      console.log("items", items);
    },
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