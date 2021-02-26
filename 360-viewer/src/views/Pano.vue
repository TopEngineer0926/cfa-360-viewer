<template>
  <div v-if="pano" class="bg">
    <div
      v-if="pano.scenes && Object.keys(pano.scenes).length > 0"
      class="vue-pannellum"
    >
      <div class="default-slot mb-12">
        <div v-for="(layer, layerIndex) in layers" :key="layerIndex">
          <v-btn
            text
            @click="loadLayer(layer)"
            small
            :class="{ primary: layer == currentLayer }"
          >
            {{ layer }}
          </v-btn>
        </div>

        <div v-for="(scene, sceneID) in pano.scenes" :key="sceneID">
          <v-btn
            @click="loadScene(sceneID)"
            class="ml-2 my-1"
            small
            :class="{ primary: sceneID == currentScene }"
          >
            {{ scene.title }}</v-btn
          >
          <v-btn v-if="user.admin" icon @click="initEditScene(sceneID)">
            <v-icon>mdi-pencil-outline</v-icon></v-btn
          >
        </div>
        <v-btn v-if="user.admin" text @click="addTagConfig" class="ml-2" small>
          Add Tag
        </v-btn>

        <v-btn
          v-if="user.admin"
          text
          @click="initEditScene(null)"
          class="ml-2"
          small
        >
          Add Image
        </v-btn>
        <v-btn v-if="user.admin" text @click="savePano()" class="ml-2" small>
          Save Project
        </v-btn>
      </div>
    </div>

    <v-btn v-else @click="initEditScene(null)" class="center">
      Add Image
    </v-btn>

    <v-dialog
      v-if="editSceneData.dialog"
      v-model="editSceneData.dialog"
      persistent
      max-width="600"
    >
      <v-card>
        <v-card-title class="headline">Edit Image</v-card-title>
        <v-card-text>
          <v-form
            ref="editimgform"
            v-model="editSceneData.editValid"
            lazy-validation
          >
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
              :rules="[
                (v) =>
                  !!(
                    (pano.scenes[editSceneData.sceneID] &&
                      pano.scenes[editSceneData.sceneID].panorama) ||
                    (pano.scenes[editSceneData.sceneID] &&
                      pano.scenes[editSceneData.sceneID].panorama) ||
                    v
                  ) || 'Image is required',
              ]"
            ></v-file-input>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="saveScene"
            :disabled="!editSceneData.editValid"
          >
            OK
          </v-btn>
          <v-btn color="grey" text @click="editSceneData.dialog = false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-if="editSpotData.dialog"
      v-model="editSpotData.dialog"
      persistent
      max-width="600"
    >
      <v-card>
        <v-card-title class="headline">Edit Tag</v-card-title>
        <v-card-text>
          <v-form
            ref="editspotform"
            v-model="editSpotData.editValid"
            lazy-validation
          >
            <v-select
              v-model="editSpotData.style"
              :items="spotStyles"
              label="Type"
            ></v-select>
            <v-text-field
              v-model="editSpotData.text"
              require
              :rules="[(v) => !!v || 'Tag Name is required']"
              label="Tag Name"
            ></v-text-field>
            <v-text-field
              v-model="editSpotData.layer"
              label="Layer"
              require
              :rules="[(v) => !!v || 'Layer is required']"
            ></v-text-field>

            <v-text-field
              v-if="editSpotData.style == 'link'"
              v-model="editSpotData.URL"
              label="Link Address"
            ></v-text-field>
            <v-select
              v-if="editSpotData.style == 'scene'"
              v-model="editSpotData.sceneId"
              :items="sceneSelectList"
              label="Pano Image List"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="saveSpot"
            :disabled="!editSpotData.editValid"
          >
            OK
          </v-btn>
          <v-btn color="grey" text @click="editSpotData.dialog = false">
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
      currentScene: null,
      layers: [],
      editSceneData: {
        dialog: false,
        editValid: false,
        sceneID: null,
        title: null,
        imgToUpload: null,
      },
      editSpotData: {
        dialog: false,
        editValid: false,
        id: null,
        pitch: null,
        yaw: null,
        style: null,
        layer: null,
        text: null,
        URL: null,
      },
      spotStyles: [
        { text: "Product Detail", value: "detail" },
        { text: "Hyperlink", value: "link" },
        { text: "Change Pano Image", value: "scene" },
      ],
      sceneSelectList: [],
      currentLayer: null,
    };
  },

  mounted() {
    API.graphql(graphqlOperation(getPano, { id: this.$route.params.id })).then(
      (data) => {
        this.pano = data.data.getPano;
        if (this.pano) {
          this.initPano();
        } else {
          this.$router.push({ path: "/panolist" });
        }
      }
    );
  },
  methods: {
    async initPano() {
      if (this.pano.sceneArr && this.pano.sceneArr.length > 0) {
        this.pano.scenes = {};
        await Promise.all(
          this.pano.sceneArr.map(async (scene, index) => {
            this.pano.scenes[scene.id] = {};
            this.pano.scenes[scene.id].index = index;
            this.pano.scenes[scene.id].title = scene.title;
            this.pano.scenes[scene.id].img = scene.img;
            this.pano.scenes[scene.id].panorama = await Storage.get(
              this.pano.id + "/" + scene.img
            );
          })
        );
        // this.reloadViewer();
        this.currentScene = this.pano.sceneArr[0].id;
        this.pano.default = {
          firstScene: this.currentScene,
          autoLoad: true,
        };
        this.viewer = window.pannellum.viewer(this.$el, this.pano);
        this.updateLayers();
      }
    },

    loadScene(sceneID) {
      this.currentScene = sceneID;
      this.updateLayers();
      this.viewer.loadScene(sceneID);
    },
    initEditScene(sceneID) {
      if (!sceneID) {
        this.editSceneData.sceneID = null;
        this.editSceneData.title = null;
      } else {
        this.editSceneData.sceneID = sceneID;
        this.editSceneData.title = this.pano.scenes[
          this.editSceneData.sceneID
        ].title;
      }
      this.editSceneData.imgToUpload = null;
      this.editSceneData.dialog = true;
    },
    async saveScene() {
      if (this.$refs.editimgform.validate()) {
        if (this.editSceneData.sceneID) {
          //edit scene
          //   if (this.editSceneData.imgToUpload) {
          //   let fileURL = URL.createObjectURL(this.editSceneData.imgToUpload);
          //   this.pano.scenes[
          //     this.editSceneData.sceneID
          //   ].s3Update = this.editSceneData.imgToUpload;
          // }
          //   if (scene.img) {
          //   Storage.remove(this.pano.id + "/" + scene.img);
          // }
        } else {
          let sceneID = nanoid();
          let imgLink = (
            await Storage.put(
              this.pano.id + "/" + sceneID,
              this.editSceneData.imgToUpload,
              {
                contentType: this.editSceneData.imgToUpload.type,
                metadata: {
                  user: this.user.email,
                  pano: this.pano.id,
                  type: "scene",
                },
              }
            )
          ).key;
          //add scene
          this.viewer.addScene(sceneID, {
            title: this.editSceneData.title,
            panorama: await Storage.get(imgLink),
          });
          //add sceneArr
          if (!this.pano.sceneArr) {
            this.pano.sceneArr = [];
          }
          this.pano.sceneArr.push({
            id: sceneID,
            title: this.editSceneData.title,
            img: imgLink.split("/")[1],
          });
          // this.loadScene(sceneID);
        }
        // this.reloadViewer();
        this.editSceneData.dialog = false;
      }
    },
    mouseDownHandler(event) {
      let coords = this.viewer.mouseEventToCoords(event);
      this.updateSceneSelectList();
      this.editSpotData.dialog = true;
      this.editSpotData.pitch = coords[0];
      this.editSpotData.yaw = coords[1];
      this.viewer.off("mousedown", this.mouseDownHandler);
      // let pitch = this.viewer.getPitch();
      // let yaw = this.viewer.getYaw();
      // let hfov = this.viewer.getHfov();
      // console.log("pitch, yaw, hfov", pitch, yaw, hfov);

      // newSpot.clickHandlerFunc = () => {
      //   this.specsDialog.newComment = null;
      //   this.specsDialog.dialog = true;
      //   this.specsDialog.content = newSpot.data;
      //   this.specsDialog.comments = newSpot.comments;
      // };
    },
    addTagConfig() {
      this.viewer.on("mousedown", this.mouseDownHandler);
    },
    saveSpot() {
      if (this.$refs.editspotform.validate()) {
        if (!this.pano.scenes[this.currentScene].spots) {
          this.pano.scenes[this.currentScene].spots = [];
        }
        let newSpot = {
          pitch: this.editSpotData.pitch,
          yaw: this.editSpotData.yaw,
          style: this.editSpotData.style,
          layer: this.editSpotData.layer,
          text: this.editSpotData.text,
        };
        if (this.editSpotData.style == "link") {
          newSpot.URL = this.editSpotData.URL;
        }
        if (this.editSpotData.id) {
          //edit existing
          // newSpot.id = this.editSpotData.id;
          // let foundIndex = this.pano.scenes[
          //   this.currentScene
          // ].hotSpots.findIndex((x) => x.id == this.editSpotData.id);
          // this.pano.scenes[this.currentScene].hotSpots[foundIndex] = newSpot;
          //+++ update Spot
        } else {
          //create new
          newSpot.id = nanoid();
          let sceneIndex = this.pano.sceneArr.findIndex(
            (scene) => scene.id == this.currentScene
          );
          this.pano.sceneArr[sceneIndex].spots.push(newSpot);
          if (newSpot.layer !== this.currentLayer) {
            this.loadLayer(newSpot.layer);
          } else {
            this.viewer.addHotSpot(newSpot);
          }
          this.editSpotData.dialog = false;
        }
        this.updateLayers();
      }
    },

    async savePano() {
      let updatePanoData = this.pano;
      delete updatePanoData.scenes;
      delete updatePanoData.default;
      await API.graphql({
        query: updatePano,
        variables: {
          input: updatePanoData,
        },
      });
      // this.$router.go();
    },
    updateLayers() {
      let layerList = [];
      let sceneIndex = this.pano.sceneArr.findIndex(
        (scene) => scene.id == this.currentScene
      );
      if (
        this.currentScene &&
        this.pano.sceneArr[sceneIndex].spots &&
        this.pano.sceneArr[sceneIndex].spots.length > 0
      ) {
        this.pano.sceneArr[sceneIndex].spots.forEach((spot) => {
          if (!layerList.includes(spot.layer)) {
            layerList.push(spot.layer);
          }
        });
      }
      this.layers = layerList;
    },
    updateSceneSelectList() {
      this.sceneSelectList = [];
      for (const sceneId in this.pano.scenes) {
        this.sceneSelectList.push({
          text: this.pano.scenes[sceneId].title,
          value: sceneId,
        });
      }
    },
    loadLayer(layer) {
      if (this.currentLayer !== layer) {
        if (this.currentLayer) {
          //removeHotSpot
          let hotSpotsID = this.pano.scenes[this.currentScene].hotSpots.map(
            (hotSpot) => hotSpot.id
          );
          hotSpotsID.forEach((hotSpotID) => {
            this.viewer.removeHotSpot(hotSpotID);
          });
        }
        let sceneIndex = this.pano.sceneArr.findIndex(
          (scene) => scene.id == this.currentScene
        );
        this.pano.sceneArr[sceneIndex].spots.forEach((spot) => {
          if (spot.layer == layer) {
            spot.type = "info";
            this.viewer.addHotSpot(spot);
          }
        });
        this.currentLayer = layer;
      }
    },
  },
  computed: {
    ...mapState(["user"]),
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
.bg {
  width: 100%;
  height: 100%;
  background-color: lightgray;
}

.currentSceneClass {
  color: brown;
}
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
  width: 250px;
}
</style>
