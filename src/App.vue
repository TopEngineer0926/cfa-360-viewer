<template>
  <v-app>
    <navbar v-if="user" />
    <v-main style="padding: 45px 0px 0px; position: fixed; width: 100%;">
      <div class="main_container">
        <router-view :key="$route.fullPath" />
      </div>
    </v-main>
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
html {
  overflow-y: hidden;
}

.main_container {
  height: calc(100vh - 45px);
  overflow-y: auto;
}

.center {
  text-align: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transform: translate3d(-50%, -50%, 0);
}

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

.mdi-chevron-right {
  color: #e51636 !important;
}
.mdi-chevron-left {
  color: #e51636 !important;
}
</style>