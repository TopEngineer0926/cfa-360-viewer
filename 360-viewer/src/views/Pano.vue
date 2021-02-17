<template>
  <div v-if="pano">
    <v-pannellum
      v-if="pano.imgUrl"
      :pano="pano"
      style="height: 85vh"
    ></v-pannellum>
    <v-img
      v-else
      :style="{ 'max-height': '70vh' }"
      src="data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="
    />
  </div>
</template>

<script>
import { API, graphqlOperation, Storage } from "aws-amplify";
import { getPano } from "../graphql/queries";

export default {
  name: "Pano",
  components: {
    "v-pannellum": () => import("@/components/Pannellum.vue"),
  },
  data: function () {
    return {
      pano: null,
    };
  },
  mounted() {
    API.graphql(graphqlOperation(getPano, { id: this.$route.params.id })).then(
      async (data) => {
        let panoData = data.data.getPano;
        if (panoData) {
          if (panoData.img) {
            panoData.imgUrl = await Storage.get(panoData.img, {
              level: "protected",
            });
          }
          this.pano = panoData;
          console.log("getPano", this.pano);
        } else {
          this.$router.push({ path: "/panolist" });
        }
      }
    );
  },
};
</script>
