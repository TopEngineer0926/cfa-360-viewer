<template>
  <div>
    <div v-if="pano && pano.scenes" class="vue-pannellum">
      <div class="default-slot"></div>
    </div>

    <v-img
      v-else
      :style="{ 'max-height': '70vh' }"
      src="data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="
    />
    <v-btn @click="initEditScene"> Add Scene </v-btn>

    <v-dialog
      v-if="editSceneData.dialog"
      v-model="editSceneData.dialog"
      persistent
      max-width="600"
    >
      <v-card>
        <v-card-title class="headline"> Edit Scene</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="editSceneData.editValid" lazy-validation>
            <v-text-field
              v-model="editSceneData.title"
              require
              :rules="[(v) => !!v || 'Title is required']"
              label="Title"
            ></v-text-field>
            <v-file-input
              v-model="editSceneData.imgToUpload"
              accept="image/*"
              label="Select panorama image"
            ></v-file-input>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="savePano"
            :disabled="!editSceneData.editValid"
          >
            Save
          </v-btn>
          <v-btn color="grey" text @click="editSceneData.dialog = false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import "pannellum";
import "pannellum/build/pannellum.css";

import { API, graphqlOperation, Storage } from "aws-amplify";
import { getPano } from "../graphql/queries";
import { updatePano } from "../graphql/mutations";

export default {
  name: "Pano",
  data: function () {
    return {
      pano: null,
      editSceneData: {
        dialog: false,
        index: null,
        title: null,
        imgToUpload: null,
        editValid: false,
      },
    };
  },
  mounted() {
    API.graphql(graphqlOperation(getPano, { id: this.$route.params.id })).then(
      async (data) => {
        let panoData = data.data.getPano;
        if (panoData) {
          console.log("getPano", panoData);

          if (panoData.scenes) {
            await Promise.all(
              panoData.scenes.map(async (scene, index) => {
                panoData.scenes[index].imgUrl = await Storage.get(scene.img, {
                  level: "protected",
                });
              })
            );

            this.viewer = window.pannellum.viewer(this.$el, {
              type: "equirectangular",
              name: panoData.title,
              panorama:
                "https://cdn.pannellum.org/2.5/pannellum.htm#panorama=https://pannellum.org/images/alma.jpg",
              autoLoad: true,
            });
          }

          this.pano = panoData;
        } else {
          this.$router.push({ path: "/panolist" });
        }
      }
    );
  },
  methods: {
    initEditScene(index) {
      this.editSceneData.dialog = true;
      this.editSceneData.index = index;
    },
    editScene() {},
    deleteScene() {},
    addTag() {},
    deleteTag() {},
    savePano() {
      API.graphql({
        query: updatePano,
        variables: {
          input: this.pano,
        },
      });
    },
  },
};
</script>
<style>
.panoTip {
  white-space: pre-line;
}

.pnlm-panorama-info {
  bottom: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0) !important;
  text-transform: capitalize;
}
</style>

<style scoped>
.top-slot {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
}
.default-slot {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  width: 150px;
}
</style>
