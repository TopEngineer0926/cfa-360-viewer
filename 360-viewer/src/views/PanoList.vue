<template>
  <v-container v-if="panos">
    <div class="d-flex flex-wrap">
      <v-card
        elevation="3"
        v-for="(pano, index) in panos"
        :key="index"
        class="ma-6"
        @click="$router.push('/pano/' + index)"
        width="400"
      >
        <v-img :src="`pano/ue${index + 1}.jpg`" class="white--text align-end">
          <v-card-title v-text="pano.name"></v-card-title>
        </v-img>
      </v-card></div
  ></v-container>
</template>

<script>
// import { API } from "aws-amplify";
// import { panosData } from "../store/defaultData";

export default {
  name: "Pano",
  data: function () {
    return {
      panos: null,
    };
  },
  //   created() {
  //     console.log("panosData", panosData);
  //   },
};
</script>
