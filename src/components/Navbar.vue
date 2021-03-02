<template>
  <v-app-bar app flat color="white">
    <v-img :src="require('@/assets/360logo.svg')" max-width="60" class="mb-2" />

    <v-btn
      text
      @click="$router.push('/panolist').catch((err) => {})"
      class="ml-4"
      >Gallery</v-btn
    >

    <v-btn
      v-if="user.admin"
      text
      @click="$router.push('/admin').catch((err) => {})"
      >Admin</v-btn
    >
    <v-spacer />
    <v-icon v-if="user.admin" color="primary" class="mr-2">
      mdi-alpha-a-box-outline
    </v-icon>
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
