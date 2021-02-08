<template>
  <v-app-bar app flat color="white">
    <v-toolbar-title>CFA 360 Viewer</v-toolbar-title>

    <v-btn text @click="$router.push('/panolist').catch((err) => {})"
      >Gallery</v-btn
    >
    <!-- <v-btn text @click="$router.push('/about').catch((err) => {})">About</v-btn> -->

    <v-btn text @click="$router.push('/admin').catch((err) => {})">Admin</v-btn>
    <v-spacer />
    {{ user.name }}
    <v-btn text @click="logout">Logout</v-btn>
  </v-app-bar>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "Nav",
  methods: {
    async logout() {
      await this.$store.dispatch("logout");
      this.$router.push("/");
    },
  },
  computed: mapState(["user"]),
};
</script>
