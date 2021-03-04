<template>
  <div v-if="url">
    <v-img
      v-if="file.type == 'img'"
      :src="url"
      height="200"
      max-width="500"
      contain
    >
      <!-- <v-card-title v-if="data.name" v-text="data.name"></v-card-title> -->
    </v-img>
    <div v-else-if="file.type == 'pdf'">
      <PdfDisplay :src="url"></PdfDisplay>
    </div>
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
  components: {
    PdfDisplay: () => import("../components/PdfDisplay"),
  },
  data() {
    return {
      url: null,
    };
  },

  mounted() {
    if (this.file.type !== "link") {
      if (this.file.s3Upload) {
        this.url = URL.createObjectURL(this.file.link);
      } else {
        Storage.get(this.panoID + "/" + this.file.link).then((res) => {
          this.url = res;
        });
      }
    }
  },
};
</script>
