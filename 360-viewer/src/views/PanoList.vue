<template>
  <v-container>
    <div v-if="panos" class="d-flex flex-wrap">
      <div v-for="(pano, index) in panos" :key="index">
        <v-hover v-slot="{ hover }">
          <v-card
            :elevation="hover ? 12 : 2"
            class="ma-6"
            width="500"
            height="200"
          >
            <v-img
              :src="
                pano.thumbnail
                  ? pano.thumbnailUrl
                  : 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='
              "
              height="200"
              max-width="500"
              class="white--text align-end grey"
              @click="$router.push('/pano/' + pano.id)"
            >
              <v-card-title v-text="pano.title"></v-card-title>
            </v-img>

            <!-- <v-card-text> {{ pano.title }}</v-card-text> -->
            <v-card-actions>
              <v-btn v-if="user.admin" icon @click="deletePanoFunc(index)"
                ><v-icon>mdi-delete-outline </v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-hover>
      </div>
    </div>
    <v-btn v-if="user.admin" @click="createPanoFunc">Create</v-btn>
  </v-container>
</template>

<script>
import { API, graphqlOperation, Storage } from "aws-amplify";
import { createPano, deletePano } from "../graphql/mutations";
import { listPanos } from "../graphql/queries";
import { mapState } from "vuex";

export default {
  name: "Pano",
  data: function () {
    return {
      panos: null,
    };
  },
  computed: mapState(["user"]),
  created() {
    API.graphql(graphqlOperation(listPanos)).then(async (data) => {
      let panosRes = data.data.listPanos.items;
      //Get thumbnail URL
      await Promise.all(
        panosRes.map(async (pano) => {
          if (pano.thumbnail) {
            pano.thumbnailUrl = await Storage.get(pano.thumbnail, {
              level: "protected",
            });
          }
          return pano;
        })
      );
      this.panos = panosRes;
    });
  },
  methods: {
    async createPanoFunc() {
      try {
        let newPanoId = await API.graphql(
          graphqlOperation(createPano, {
            input: { title: "New Scene" },
          })
        );
        this.$router.push({ path: "/pano/" + newPanoId.data.createPano.id });
      } catch (error) {
        console.error("createPano", error);
      }
    },
    deletePanoFunc(index) {
      //delete img, thumbnail
      if (this.panos[index].img) {
        Storage.remove(this.panos[index].img, { level: "protected" });
      }
      if (this.panos[index].thumbnail) {
        Storage.remove(this.panos[index].thumbnail, { level: "protected" });
      }
      //delete pano
      API.graphql(
        graphqlOperation(deletePano, {
          input: { id: this.panos[index].id },
        })
      );
      this.panos.splice(index, 1);
    },
  },
};
</script>
<style scoped>
amplify-s3-image {
  --height: 200px;
  --width: 400px;
}
</style>