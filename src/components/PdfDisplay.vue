<template>
  <div class="solid-border">
    <pdf :src="src" :page="currentPage"></pdf>
    <div class="d-flex justify-center">
      <v-btn text disabled>{{ currentPage }} / {{ pageCount }}</v-btn>

      <v-btn
        icon
        color="primary"
        :disabled="currentPage - 1 <= 0"
        @click="currentPage--"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn
        icon
        color="primary"
        :disabled="currentPage >= pageCount"
        @click="currentPage++"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>

      <v-btn icon color="primary" :href="src" target="_blank">
        <v-icon>mdi-download</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import pdf from "vue-pdf";

export default {
  components: {
    pdf,
  },
  props: ["src"],
  data() {
    return {
      currentPage: 1,
      pageCount: null,
    };
  },
  created() {
    var loadingTask = pdf.createLoadingTask(this.src);
    pdf.createLoadingTask(this.src).promise.then((pdf) => {
      this.pageCount = pdf.numPages;
    });
  },
};
</script>
<style scoped>
.solid-border {
  border-style: solid;
  border-width: thin;
}
</style>
