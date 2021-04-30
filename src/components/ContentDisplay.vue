<template>
  <div v-if="url">
    <v-img
      v-if="content.type == 'img'"
      :src="url"
      height="200"
      max-width="500"
      contain
    >
      <!-- <v-card-title v-if="data.name" v-text="data.name"></v-card-title> -->
    </v-img>
    <div v-else-if="content.type == 'pdf'">
      <PdfDisplay :src="url"></PdfDisplay>
    </div>
    <div v-else-if="content.type == 'youtube'">
      <youtube fitParent resize nocookie :video-id="content.link" />
    </div>
    <div v-else-if="content.type == 'link'">
      <v-btn text :href="content.link" target="_blank">External Link </v-btn>
    </div>
    <!-- <div v-if="content.name">{{ content.name }}</div> -->
  </div>
</template>

<script>
import { Storage } from "aws-amplify";

export default {
  props: {
    content: { type: Object, required: true },
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
    if (this.content.type == "youtube") {
      this.url = this.content.link;
    } else {
      if (this.content.s3Upload) {
        this.url = URL.createObjectURL(this.content.link);
      } else {
        Storage.get(this.panoID + "/" + this.content.link).then((res) => {
          this.url = res;
        });
      }
    }
  },
};
</script>
