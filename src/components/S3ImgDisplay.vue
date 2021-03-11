<template>
  <div>
    <v-img v-if="url" :src="url" :max-height="250"> </v-img>
    <v-img
      v-else
      src="data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="
      :max-height="250"
    >
    </v-img>
  </div>
</template>

<script>
import { Storage } from "aws-amplify";

export default {
  props: ["src", "panoID"],
  data() {
    return {
      url: null,
    };
  },

  watch: {
    src: {
      handler: function () {
        this.loadImg();
      },
      immediate: true,
    },
  },
  methods: {
    async loadImg() {
      try {
        if (this.src) {
          this.url = await Storage.get(this.panoID + "/" + this.src);
        }
      } catch (error) {
        console.log("noooo");
        this.url = null;
      }
    },
  },
};
</script>
 