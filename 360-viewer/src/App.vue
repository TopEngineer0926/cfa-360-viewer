<template>
  <v-app>
    <navbar v-if="user" />
    <v-main>
      <router-view :key="$route.fullPath" />
    </v-main>
    <foot />
  </v-app>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "App",

  components: {
    navbar: () => import("./components/Navbar.vue"),
    foot: () => import("./components/Foot.vue"),
  },
  computed: mapState(["user"]),
};
</script>
<style>
:root {
  --amplify-primary-color: #e51636;
  --amplify-primary-tint: #e51636;
  --amplify-primary-shade: #e51636;
}
</style>
