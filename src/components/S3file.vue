<template>
  <div v-if="url">
    {{ file }}
    <v-img :src="url" height="200" max-width="500" contain>
      <!-- <v-card-title v-if="data.name" v-text="data.name"></v-card-title> -->
    </v-img>
    <!-- <div v-if="file.name">{{ file.name }}</div> -->
  </div>
</template>

<script>
import { Storage } from "aws-amplify";

export default {
  props: {
    file: { type: Object, required: true },
    panoID: { type: String, required: true },
  },
  data() {
    return {
      url: null,
    };
  },

  mounted() {
    if (this.file.s3Upload) {
      this.url = this.file.link;
    } else {
      Storage.get(this.panoID + "/" + this.file.link).then((res) => {
        this.url = res;
      });
    }
  },
};
</script>
