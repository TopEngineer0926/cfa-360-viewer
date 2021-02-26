<template>
  <div class="bg">
    <div v-if="pano" class="vue-pannellum">
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
                (v) => !!(editSceneData.sceneID || v) || 'Image is required',
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
            Save
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
              v-model="editSpotData.link"
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
            Save
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
      panoSource: null,
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
        text: null,
        link: null,
        sceneId: null,
        contents: null,
        comments: null,
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
        this.panoSource = data.data.getPano;
        if (this.panoSource) {
          this.initPano();
        } else {
          this.$router.push({ path: "/panolist" });
        }
      }
    );
  },
  methods: {
    async initPano() {
      if (this.panoSource.sceneArr && this.panoSource.sceneArr.length > 0) {
        this.pano = {
          title: this.panoSource.title,
          scenes: {},
        };
        await Promise.all(
          this.panoSource.sceneArr.map(async (scene) => {
            this.pano.scenes[scene.id] = {};
            this.pano.scenes[scene.id].title = scene.title;
            this.pano.scenes[scene.id].panorama = await Storage.get(
              this.panoSource.id + "/" + scene.img
            );
          })
        );
        this.currentScene = this.panoSource.sceneArr[0].id;
        this.pano.default = {
          firstScene: this.currentScene,
          autoLoad: true,
        };

        this.updateLayerList();
        this.viewer = window.pannellum.viewer(this.$el, this.pano);
      }
    },

    loadScene(sceneID) {
      this.currentScene = sceneID;
      this.updateLayerList();
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
        let sceneID = this.editSceneData.sceneID
          ? this.editSceneData.sceneID
          : nanoid();
        let s3link = null;

        if (this.editSceneData.imgToUpload) {
          let imgID = nanoid();

          s3link = (
            await Storage.put(
              this.panoSource.id + "/" + imgID,
              this.editSceneData.imgToUpload,
              {
                contentType: this.editSceneData.imgToUpload.type,
                metadata: {
                  user: this.user.email,
                  pano: this.panoSource.id,
                  type: "scene",
                },
              }
            )
          ).key;
        }
        if (this.editSceneData.sceneID) {
          //edit scene title
          this.pano.scenes[sceneID].title = this.editSceneData.title;
          //edit sceneArr title
          let sceneIndex = this.panoSource.sceneArr.findIndex(
            (scene) => scene.id == sceneID
          );
          this.panoSource.sceneArr[sceneIndex].title = this.editSceneData.title;
          if (s3link) {
            //edit sceneArr img
            Storage.remove(
              this.panoSource.id +
                "/" +
                this.panoSource.sceneArr[sceneIndex].img
            );
            this.panoSource.sceneArr[sceneIndex].img = s3link.split("/")[1];
            //edit scene panorama
            this.pano.scenes[sceneID].panorama = await Storage.get(s3link);
          }
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
          if (!this.pano) {
            // first scene
            this.pano = {
              default: { firstScene: sceneID, autoLoad: true },
              scenes: {
                [sceneID]: {
                  title: this.editSceneData.title,
                  panorama: await Storage.get(s3link),
                },
              },
            };
            console.log(" this.pano ", this.pano);
            this.viewer = window.pannellum.viewer(this.$el, this.pano);
          } else {
            //add scene
            this.viewer.addScene(sceneID, {
              title: this.editSceneData.title,
              panorama: await Storage.get(s3link),
            });
          }
          //add sceneArr
          if (!this.panoSource.sceneArr) {
            this.panoSource.sceneArr = [];
          }
          this.panoSource.sceneArr.push({
            id: sceneID,
            title: this.editSceneData.title,
            img: s3link.split("/")[1],
          });
        }
        this.savePano();
        this.editSceneData.dialog = false;
      }
    },
    mouseDownHandler(event) {
      let coords = this.viewer.mouseEventToCoords(event);

      this.editSpotData = {
        dialog: true,
        editValid: false,
        id: null,
        pitch: coords[0],
        yaw: coords[1],
        style: "detail",
        text: null,
        // link: null,
        // sceneId: null,
        contents: null,
        comments: null,
      };
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
        let sceneIndex = this.panoSource.sceneArr.findIndex(
          (scene) => scene.id == this.currentScene
        );
        if (!this.panoSource.sceneArr[sceneIndex].spots) {
          this.panoSource.sceneArr[sceneIndex].spots = [];
        }
        let newSpot = {
          pitch: this.editSpotData.pitch,
          yaw: this.editSpotData.yaw,
          style: this.editSpotData.style,
          layer: this.editSpotData.layer,
          text: this.editSpotData.text,
        };
        if (this.editSpotData.style == "link") {
          newSpot.link = this.editSpotData.link;
        }
        if (this.editSpotData.style == "scene") {
          newSpot.sceneID = this.editSpotData.sceneID;
        }
        if (this.editSpotData.id) {
          //edit existing
          this.viewer.removeHotSpot(this.editSpotData.id);
          newSpot.id = this.editSpotData.id;
          let spotIndex = this.panoSource.sceneArr[sceneIndex].spots.findIndex(
            (spot) => spot.id == newSpot.id
          );
          this.panoSource.sceneArr[sceneIndex].spots[spotIndex] = newSpot;
          // this.showSpot(newSpot);
          // let foundIndex = this.pano.scenes[
          //   this.currentScene
          // ].hotSpots.findIndex((x) => x.id == this.editSpotData.id);
          // this.pano.scenes[this.currentScene].hotSpots[foundIndex] = newSpot;
          //+++ update Spot
        } else {
          //create new
          newSpot.id = nanoid();
          this.panoSource.sceneArr[sceneIndex].spots.push(newSpot);
        }
        this.loadLayer(newSpot.layer);
        this.editSpotData.dialog = false;
        this.updateLayerList();
        this.savePano();
      }
    },

    async savePano() {
      console.log("savePano", this.panoSource);
      await API.graphql({
        query: updatePano,
        variables: {
          input: this.panoSource,
        },
      });
      // this.$router.go();
    },
    updateLayerList() {
      let layerList = [];
      let sceneIndex = this.panoSource.sceneArr.findIndex(
        (scene) => scene.id == this.currentScene
      );
      if (
        this.panoSource.sceneArr[sceneIndex].spots &&
        this.panoSource.sceneArr[sceneIndex].spots.length > 0
      ) {
        this.panoSource.sceneArr[sceneIndex].spots.forEach((spot) => {
          if (!layerList.includes(spot.layer)) {
            layerList.push(spot.layer);
          }
        });
      }
      this.layers = layerList;
    },

    showSpot(spot) {
      let addSpot = JSON.parse(JSON.stringify(spot));
      if (this.user.admin) {
        addSpot.type = "info";
        addSpot.clickHandlerFunc = () => {
          this.editSpotData.id = spot.id;
          this.editSpotData.style = addSpot.style;
          this.editSpotData.text = addSpot.text;
          this.editSpotData.layer = addSpot.layer;
          this.editSpotData.pitch = addSpot.pitch;
          this.editSpotData.yaw = addSpot.yaw;
          this.editSpotData.sceneId = addSpot.sceneId;
          this.editSpotData.link = addSpot.link;
          this.editSpotData.dialog = true;
        };
      } else {
        switch (addSpot.style) {
          case "detail":
            addSpot.type = "info";
            addSpot.clickHandlerFunc = () => {
              this.editSpotData.id = addSpot.id;
              this.editSpotData.style = addSpot.style;
              this.editSpotData.text = addSpot.text;
              this.editSpotData.layer = addSpot.layer;
              this.editSpotData.pitch = addSpot.pitch;
              this.editSpotData.yaw = addSpot.yaw;
              this.editSpotData.dialog = true;
            };
            break;
          case "link":
            addSpot.type = "info";
            addSpot.URL = addSpot.link;
            break;
          case "scene":
            addSpot.type = "scene";
            break;
          default:
            addSpot.type = "info";
        }
      }
      this.viewer.addHotSpot(addSpot);
    },
    loadLayer(layer) {
      if (this.currentLayer) {
        //removeHotSpots
        let hotSpotsID = this.pano.scenes[this.currentScene].hotSpots.map(
          (hotSpot) => hotSpot.id
        );
        hotSpotsID.forEach((hotSpotID) => {
          this.viewer.removeHotSpot(hotSpotID);
        });
      }
      let sceneIndex = this.panoSource.sceneArr.findIndex(
        (scene) => scene.id == this.currentScene
      );
      this.panoSource.sceneArr[sceneIndex].spots.forEach((spot) => {
        if (spot.layer == layer) {
          this.showSpot(spot);
        }
      });
      this.currentLayer = layer;
    },
  },
  computed: {
    ...mapState(["user"]),
  },
  watch: {
    "editSpotData.dialog": function (val) {
      if (val) {
        this.sceneSelectList = [];
        for (const sceneId in this.pano.scenes) {
          this.sceneSelectList.push({
            text: this.pano.scenes[sceneId].title,
            value: sceneId,
          });
        }
      }
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
