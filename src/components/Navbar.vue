<template>
  <v-app-bar app flat dense color="white">
    <v-img
      :src="require('@/assets/logo.png')"
      max-width="70"
      class="mb-2"
      @click="$router.push('/panolist').catch((err) => {})"
      :style="{ cursor: 'pointer' }"
    />

    <v-row v-if="navbarText" class="ml-6" align="center">
      <v-col cols="auto">
        <h3>{{ navbarText.title }}</h3>
      </v-col>

      <v-col cols="auto">
        Category:
        {{ navbarText.category }}
      </v-col>

      <v-col cols="auto">
        Type:
        {{ navbarText.ptype }}
      </v-col>

      <v-col cols="auto">Size: {{ navbarText.psize }} </v-col></v-row
    >
    <div v-else>
      <v-btn
        text
        @click="$router.push('/panolist').catch((err) => {})"
        class="ml-4"
        >Gallery</v-btn
      >

      <v-btn
        v-if="!user.guest"
        text
        @click="$router.push('/admin').catch((err) => {})"
        >Admin</v-btn
      >
    </div>

    <v-spacer />

    {{ user.name }}
    <v-chip v-if="user.masterSiteAdmin" color="primary" class="ml-2" small>
      Master Site Admin
    </v-chip>
    <v-chip v-else-if="user.siteAdmin" color="primary" class="ml-2" small>
      Site Admin
    </v-chip>
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
  computed: mapState(["user", "navbarText"]),
};
</script>
