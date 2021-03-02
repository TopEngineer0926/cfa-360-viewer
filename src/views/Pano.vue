<template>
  <div class="bg">
    <div v-if="pano" class="vue-pannellum">
      <div class="default-slot mb-12">
        <!-- <div v-for="(layer, layerIndex) in layers" :key="layerIndex">
          <v-btn
            text
            @click="loadLayer(layer)"
            small
            :class="{ primary: layer == currentLayer }"
          >
            {{ layer }}
          </v-btn>
        </div> -->

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
              v-model="editSpotData.spot.style"
              :items="spotStyles"
              label="Type"
            ></v-select>
            <v-text-field
              v-model="editSpotData.spot.text"
              require
              :rules="[(v) => !!v || 'Tag Name is required']"
              label="Tag Name"
            ></v-text-field>
            <!-- <v-text-field
              v-model="editSpotData.spot.layer"
              label="Layer"
              require
              :rules="[(v) => !!v || 'Layer is required']"
            ></v-text-field> -->

            <v-text-field
              v-if="editSpotData.spot.style == 'link'"
              v-model="editSpotData.spot.link"
              label="Link Address"
            ></v-text-field>
            <v-select
              v-if="editSpotData.spot.style == 'scene'"
              v-model="editSpotData.spot.sceneID"
              :items="sceneSelectList"
              label="Pano Image List"
            ></v-select>
          </v-form>
          <div v-if="editSpotData.spot.style == 'detail'">
            <div
              v-for="(content, contentIndex) in editSpotData.spot.contents"
              :key="contentIndex"
            >
              <div v-if="!content.delete">
                <s3file
                  v-if="!content.delete"
                  :file="content"
                  :panoID="panoSource.id"
                ></s3file>
                <v-row>
                  <v-text-field
                    v-model="content.name"
                    label="File Name"
                  ></v-text-field>
                  <v-btn icon @click="deleteContent(content)" class="ml-4"
                    ><v-icon>mdi-delete-outline </v-icon>
                  </v-btn>
                </v-row>
              </div>
            </div>
            <v-divider class="ma-8"></v-divider>
            <div class="d-flex justify-space-between mb-6">
              <v-file-input
                v-model="editSpotData.newContent.file"
                label="Select File"
              ></v-file-input>

              <v-text-field
                class="ml-4"
                v-model="editSpotData.newContent.name"
                label="Display Name"
              ></v-text-field>
            </div>

            <v-btn block @click="addNewContent">Add Content</v-btn>
          </div>
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
          <v-btn color="grey" text @click="cancelSpot"> Cancel </v-btn>
          <v-btn color="grey" text @click="deleteSpot"> Delete </v-btn>
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
  components: {
    s3file: () => import("../components/S3file"),
  },
  data: function () {
    return {
      pano: null,
      panoSource: null,
      viewer: null,
      currentScene: null,
      currentSceneIndex: null,
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
        spot: null,
        newContent: {
          type: null,
          name: null,
          thumbnail: null,
          file: null,
        },
      },
      showSpotDetail: {
        dialog: false,
        spot: null,
      },
      spotStyles: [
        { text: "Product Detail", value: "detail" },
        // { text: "Hyperlink", value: "link" },
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
        this.currentSceneIndex = 0;
        this.pano.default = {
          firstScene: this.currentScene,
          autoLoad: true,
        };

        this.updateLayerList();
        this.viewer = window.pannellum.viewer(this.$el, this.pano);
      }
    },

    loadScene(sceneID) {
      // remove current spots
      this.removeCurrentSpots();
      this.viewer.loadScene(sceneID);
      this.currentScene = sceneID;
      this.currentSceneIndex = this.panoSource.sceneArr.findIndex(
        (scene) => scene.id == this.currentScene
      );

      this.updateLayerList();
      if (this.layers.includes("default")) {
        this.loadLayer("default");
      } else {
        this.currentLayer = null;
      }
      // if (this.layers.includes(this.currentLayer)) {
      //   this.loadLayer(this.currentLayer);
      // } else {
      //   this.currentLayer = null;
      // }
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
          // let sceneIndex = this.panoSource.sceneArr.findIndex(
          //   (scene) => scene.id == sceneID
          // );
          this.panoSource.sceneArr[
            this.currentSceneIndex
          ].title = this.editSceneData.title;
          if (s3link) {
            //edit sceneArr img
            Storage.remove(
              this.panoSource.id +
                "/" +
                this.panoSource.sceneArr[this.currentSceneIndex].img
            );
            this.panoSource.sceneArr[this.currentSceneIndex].img = s3link.split(
              "/"
            )[1];
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
        this.loadScene(sceneID);
      }
    },
    mouseDownHandler(event) {
      let coords = this.viewer.mouseEventToCoords(event);

      this.editSpotData = {
        dialog: true,
        editValid: false,
        spot: {
          pitch: coords[0],
          yaw: coords[1],
          style: "detail",
          layer: "default",
        },
        newContent: {
          type: null,
          name: null,
          thumbnail: null,
          file: null,
        },
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
    cancelSpot() {
      if (this.editSpotData.spot.contents) {
        this.editSpotData.spot.contents = this.editSpotData.spot.contents.filter(
          (content) => !content.s3Upload
        );
        this.editSpotData.spot.contents.forEach((content) => {
          if (content.delete) {
            delete content.delete;
          }
        });
      }
      this.editSpotData.dialog = false;
    },
    deleteSpot() {
      this.viewer.removeHotSpot(this.editSpotData.spot.id);
      let spotIndex = this.panoSource.sceneArr[
        this.currentSceneIndex
      ].spots.findIndex((spot) => spot.id == this.editSpotData.spot.id);
      if (spotIndex >= 0) {
        //+delete contents
        let thisContents = this.panoSource.sceneArr[this.currentSceneIndex]
          .spots[spotIndex].contents;
        if (thisContents && thisContents.length > 0) {
          thisContents.forEach((content) => {
            if (content.link && !content.s3Upload) {
              Storage.remove(this.panoSource.id + "/" + content.link);
            }
          });
        }
        this.panoSource.sceneArr[
          this.currentSceneIndex
        ].spots = this.panoSource.sceneArr[this.currentSceneIndex].spots.splice(
          spotIndex,
          1
        );

        this.updateLayerList();
        this.savePano();
      }
      this.editSpotData.dialog = false;
    },
    deleteContent(content) {
      content.delete = true;
      this.$forceUpdate();
    },

    saveSpot() {
      if (this.$refs.editspotform.validate()) {
        let sceneIndex = this.panoSource.sceneArr.findIndex(
          (scene) => scene.id == this.currentScene
        );
        if (!this.panoSource.sceneArr[this.currentSceneIndex].spots) {
          this.panoSource.sceneArr[this.currentSceneIndex].spots = [];
        }

        if (this.editSpotData.spot.id) {
          //edit existing
          this.viewer.removeHotSpot(this.editSpotData.spot.id);
          let spotIndex = this.panoSource.sceneArr[
            this.currentSceneIndex
          ].spots.findIndex((spot) => spot.id == this.editSpotData.spot.id);
          this.panoSource.sceneArr[this.currentSceneIndex].spots[
            spotIndex
          ] = this.editSpotData.spot;
        } else {
          //create new
          this.editSpotData.spot.id = nanoid();
          this.panoSource.sceneArr[this.currentSceneIndex].spots.push(
            this.editSpotData.spot
          );
        }
        this.loadLayer(this.editSpotData.spot.layer);
        this.editSpotData.dialog = false;
        this.updateLayerList();
        this.savePano();
      }
    },

    async savePano() {
      async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
      }
      await asyncForEach(this.panoSource.sceneArr, async (scene) => {
        if (scene.spots) {
          await asyncForEach(scene.spots, async (spot) => {
            if (spot.contents) {
              await asyncForEach(spot.contents, async (content) => {
                if (content.delete) {
                  if (content.link && !content.s3Upload) {
                    Storage.remove(this.panoSource.id + "/" + content.link);
                  }
                } else {
                  if (content.s3Upload) {
                    if (content.link) {
                      Storage.remove(this.panoSource.id + "/" + content.link);
                    }
                    let fileID = nanoid();
                    content.link = (
                      await Storage.put(
                        this.panoSource.id + "/" + fileID,
                        this.editSpotData.newContent.file,
                        {
                          contentType: this.editSpotData.newContent.file.type,
                          metadata: {
                            user: this.user.email,
                            type: "spotDetail",
                            spotID: this.editSpotData.spot.id,
                          },
                        }
                      )
                    ).key.split("/")[1];
                    delete content.s3Upload;
                  }
                }
              });
              spot.contents = spot.contents.filter(
                (content) => !content.delete
              );
            }
          });
        }
      });

      // this.panoSource.sceneArr.forEach((scene) => {
      //   scene.spots.forEach((spot) => {
      //     if (spot.contents) {
      //       spot.contents.forEach(async (content) => {
      //         if (content.s3Upload) {
      //           content.link = (
      //             await Storage.put(
      //               this.panoSource.id + "/" + nanoid(),
      //               this.editSpotData.newContent.file,
      //               {
      //                 contentType: this.editSpotData.newContent.file,
      //                 metadata: {
      //                   user: this.user.email,
      //                   type: "spotDetail",
      //                   spotID: this.editSpotData.spot.id,
      //                 },
      //               }
      //             )
      //           ).key.split("/")[1];

      //           delete content.s3Upload;
      //         }
      //       });
      //     }
      //   });
      // });
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
      // let sceneIndex = this.panoSource.sceneArr.findIndex(
      //   (scene) => scene.id == this.currentScene
      // );
      if (
        this.panoSource.sceneArr[this.currentSceneIndex].spots &&
        this.panoSource.sceneArr[this.currentSceneIndex].spots.length > 0
      ) {
        this.panoSource.sceneArr[this.currentSceneIndex].spots.forEach(
          (spot) => {
            if (!layerList.includes(spot.layer)) {
              layerList.push(spot.layer);
            }
          }
        );
      }
      this.layers = layerList;
    },

    showSpot(spot, spotIndex) {
      let addSpot = JSON.parse(JSON.stringify(spot));
      if (this.user.admin) {
        addSpot.type = "info";
        addSpot.clickHandlerFunc = () => {
          this.editSpotData.spot = spot;

          this.editSpotData.dialog = true;
        };
      } else {
        switch (addSpot.style) {
          case "detail":
            addSpot.type = "info";
            addSpot.clickHandlerFunc = () => {
              this.showSpotDetail.spot = spot;
              this.showSpotDetail.dialog = true;
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
    removeCurrentSpots() {
      if (this.currentLayer && this.pano.scenes[this.currentScene].hotSpots) {
        //removeHotSpots
        let hotSpotsID = this.pano.scenes[this.currentScene].hotSpots.map(
          (hotSpot) => hotSpot.id
        );
        hotSpotsID.forEach((hotSpotID) => {
          this.viewer.removeHotSpot(hotSpotID);
        });
      }
    },
    loadLayer(layer) {
      this.removeCurrentSpots();
      this.panoSource.sceneArr[this.currentSceneIndex].spots.forEach(
        (spot, spotIndex) => {
          if (spot.layer == layer) {
            this.showSpot(spot, spotIndex);
          }
        }
      );
      this.currentLayer = layer;
    },
    async addNewContent() {
      let fileURL = URL.createObjectURL(this.editSpotData.newContent.file);
      if (!this.editSpotData.spot.contents) {
        this.editSpotData.spot.contents = [];
      }
      this.editSpotData.spot.contents.push({
        // type: "type",
        name: this.editSpotData.newContent.name,
        // thumbnail: "String",
        link: fileURL,
        s3Upload: this.editSpotData.newContent.file,
      });
      this.$forceUpdate();
    },
  },
  computed: {
    ...mapState(["user"]),
  },
  watch: {
    "editSpotData.dialog": function (val) {
      if (val) {
        //update scene list
        this.sceneSelectList = [];
        for (const sceneId in this.pano.scenes) {
          this.sceneSelectList.push({
            text: this.pano.scenes[sceneId].title,
            value: sceneId,
          });
        }
        //update detail
        // if (this.editSpotData.spot && this.editSpotData.spot.style=='detail'){
        // }
      }
    },
    // "editSpotData.spot.style": async function (val) {
    //   if (val == "detail" && this.editSpotData.spot.id) {
    //     console.log(val);
    //     await API.graphql(
    //       graphqlOperation(getSpot, { id: this.editSpotData.spot.id })
    //     );
    //   }
    // },
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
