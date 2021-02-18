<template>
  <div>
    <div v-if="pano && pano.scenes" class="vue-pannellum">
      <div class="default-slot">
        <div v-for="(scene, sceneID) in pano.scenes" :key="sceneID">
          <v-btn @click="loadScene(sceneID)"> {{ scene.title }}</v-btn>
          <v-btn v-if="user.admin" icon @click="initEditScene(sceneID)">
            <v-icon>mdi-pencil-outline</v-icon></v-btn
          >
        </div>
      </div>
    </div>

    <v-img
      v-else
      :style="{ 'max-height': '70vh' }"
      src="data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="
    />
    <v-btn @click="initEditScene(null)"> Add Scene </v-btn>
    <v-btn @click="savePano()"> Save Project </v-btn>
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
            @click="editScene"
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
import { mapState } from "vuex";
import { API, graphqlOperation, Storage } from "aws-amplify";
import { getPano } from "../graphql/queries";
import { updatePano } from "../graphql/mutations";
import { nanoid } from "nanoid";

export default {
  name: "Pano",
  data: function () {
    return {
      pano: null,
      viewer: null,
      editSceneData: {
        dialog: false,
        sceneID: null,
        title: null,
        imgToUpload: null,
        editValid: false,
      },
    };
  },
  computed: mapState(["user"]),
  mounted() {
    API.graphql(graphqlOperation(getPano, { id: this.$route.params.id })).then(
      async (data) => {
        this.pano = data.data.getPano;
        if (this.pano) {
          if (this.pano.sceneArr) {
            this.pano.scenes = {};

            await Promise.all(
              this.pano.sceneArr.map(async (scene, index) => {
                this.pano.scenes[scene.id] = {};
                this.pano.scenes[scene.id].index = index;
                this.pano.scenes[scene.id].title = scene.title;
                this.pano.scenes[scene.id].panorama = await Storage.get(
                  scene.img,
                  {
                    level: "protected",
                  }
                );
              })
            );

            this.reloadViewer();
          }
        } else {
          this.$router.push({ path: "/panolist" });
        }
      }
    );
  },
  methods: {
    reloadViewer() {
      console.log("getPano", this.pano);

      this.pano.default = {
        firstScene: Object.keys(this.pano.scenes)[0],
        autoLoad: true,
      };

      this.viewer = window.pannellum.viewer(this.$el, this.pano);
    },
    loadScene(sceneID) {
      console.log("load sceneID", sceneID);
      this.viewer.loadScene(sceneID);
    },
    initEditScene(sceneID) {
      if (!sceneID) {
        this.editSceneData.sceneID = nanoid();
        this.editSceneData.title = null;

        if (!this.pano.scenes) {
          this.pano.scenes = {};
        }
      } else {
        this.editSceneData.sceneID = sceneID;
        this.editSceneData.title = this.pano.scenes[
          this.editSceneData.sceneID
        ].title;
      }

      this.editSceneData.imgToUpload = null;
      this.editSceneData.dialog = true;
    },
    editScene() {
      if (!this.pano.scenes[this.editSceneData.sceneID]) {
        this.pano.scenes[this.editSceneData.sceneID] = {};
      }
      if (this.editSceneData.imgToUpload) {
        var fileURL = URL.createObjectURL(this.editSceneData.imgToUpload);
        this.pano.scenes[this.editSceneData.sceneID].panorama = fileURL;
        this.pano.scenes[this.editSceneData.sceneID].s3Update = true;
      }

      this.pano.scenes[
        this.editSceneData.sceneID
      ].title = this.editSceneData.title;
      this.reloadViewer();
      this.editSceneData.dialog = false;
    },
    deleteScene() {},
    addTag() {},
    deleteTag() {},
    async savePano() {
      let updatePanoData = this.pano;

      updatePanoData.sceneArr = [];
      for (const [sceneID, scene] of Object.entries(updatePanoData.scenes)) {
        scene.id = sceneID;
        updatePanoData.sceneArr.push(scene);
      }

      console.log("updatePanoData.sceneArr", updatePanoData.sceneArr);
      delete updatePanoData.scenes;
      delete updatePanoData.default;

      await Promise.all(
        updatePanoData.sceneArr.map(async (scene) => {
          console.log("scene", scene);
          if (scene.s3Update) {
            let imgId = nanoid();
            scene.img = (
              await Storage.put(imgId, scene.panorama, {
                level: "protected",
                contentType: scene.panorama.type,
                metadata: {
                  user: this.user.email,
                  pano: this.pano.id,
                  type: "scene",
                },
              })
            ).key;

            delete scene.s3Update;
            delete scene.panorama;
            console.log("scene.img", scene.img);
          }
        })
      );
      console.log("save", updatePanoData);
      await API.graphql({
        query: updatePano,
        variables: {
          input: updatePanoData,
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
