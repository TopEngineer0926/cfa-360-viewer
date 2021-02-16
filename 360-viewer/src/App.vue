<template>
  <v-app>
    <navbar v-if="user" />
    <v-main>
      <router-view :key="$route.fullPath" />
    </v-main>
    <foot />
    <confirm ref="confirm"></confirm>
    <dialog-loader ref="dialogLoader"></dialog-loader>
  </v-app>
</template>

<script>
import { mapState } from "vuex";
import DialogLoader from "./components/DialogLoader";
import Confirm from "./components/Confirm";

export default {
  name: "App",

  components: {
    navbar: () => import("./components/Navbar.vue"),
    foot: () => import("./components/Foot.vue"),
    DialogLoader,
    Confirm,
  },
  computed: mapState(["user"]),
  mounted() {
    this.$root.$confirm = this.$refs.confirm.open;
    this.$root.$dialogLoader = this.$refs.dialogLoader;
  },
};
</script>
<style>
:root {
  --amplify-primary-color: #e51636;
  --amplify-primary-tint: #e51636;
  --amplify-primary-shade: #e51636;
}

.pnlm-about-msg {
  visibility: hidden;
  a {
    visibility: hidden;
  }
}
</style>
