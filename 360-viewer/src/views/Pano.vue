<template>
  <div>
    <v-pannellum :pano="pano" style="height: 85vh"></v-pannellum>
  </div>
</template>

<script>
export default {
  name: "Pano",
  components: {
    "v-pannellum": () => import("@/components/Pannellum.vue"),
  },
  data: function () {
    return {
      pano: panosData[this.$route.params.id],
    };
  },
};
</script>
