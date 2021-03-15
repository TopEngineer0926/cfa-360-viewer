<template>
  <div class="bg">
    <div v-if="pano" class="vue-pannellum">
      <div class="default-slot mb-4">
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
        <v-row v-if="user.admin" justify="center" align="center">
          <v-btn
            v-if="admin"
            text
            @click="initEditScene(null)"
            class="ml-2"
            small
          >
            Add Panorama Image
          </v-btn>
          <v-btn v-if="admin" text @click="addTagConfig" class="ml-2" small>
            Add Tag
          </v-btn>
          <v-switch
            v-model="admin"
            :label="admin ? 'Admin' : 'User'"
          ></v-switch>
        </v-row>
        <v-row justify="center" align="center">
          <v-chip-group mandatory>
            <v-chip
              v-for="(scene, sceneIndex) in panoSource.sceneArr"
              :key="sceneIndex"
              :class="{ primary: sceneIndex == currentSceneIndex }"
              @click="loadScene(scene.id)"
            >
              {{ scene.title }}

              <v-avatar v-if="admin" right @click="initEditScene(scene.id)">
                <v-icon>mdi-pencil-outline</v-icon>
              </v-avatar>
            </v-chip>
          </v-chip-group>
        </v-row>
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
        <v-card-title class="headline">Edit Panorama Image</v-card-title>
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
          <v-btn
            v-if="panoSource.sceneArr && panoSource.sceneArr.length > 0"
            color="grey"
            text
            @click="deleteScene"
          >
            Delete
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
        <v-card-title v-if="admin" class="headline">Edit Tag</v-card-title>
        <v-card-title v-else class="headline">
          {{ editSpotData.spot.text }}</v-card-title
        >
        <v-card-text>
          <v-form
            v-if="admin"
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
            <v-textarea
              v-model="editSpotData.spot.about"
              label="Description"
              auto-grow
              :rows="1"
              :readonly="!admin"
            ></v-textarea>
            <div
              v-for="(content, contentIndex) in editSpotData.spot.contents"
              :key="contentIndex"
            >
              <div v-if="!content.delete">
                <ContentDisplay
                  v-if="!content.delete"
                  :content="content"
                  :panoID="panoSource.id"
                ></ContentDisplay>
                <v-row class="mt-2 ml-0" align="center" justify="center">
                  <v-text-field
                    v-model="content.name"
                    :readonly="!admin"
                    label="Content Name"
                  ></v-text-field>
                  <v-btn
                    v-if="admin"
                    icon
                    @click="deleteContent(content)"
                    class="ml-4"
                    ><v-icon>mdi-delete-outline </v-icon>
                  </v-btn>
                </v-row>
              </div>
            </div>
            <div v-if="admin">
              <v-divider class="ma-8"></v-divider>
              <v-row>
                <v-col>
                  <v-select
                    v-model="editSpotData.newContent.type"
                    :items="contentTypes"
                    label="Type"
                  ></v-select
                ></v-col>
                <v-col>
                  <v-text-field
                    label="video Id"
                    v-model="editSpotData.newContent.link"
                    v-if="editSpotData.newContent.type == 'youtube'"
                  ></v-text-field>
                  <v-file-input
                    v-else
                    v-model="editSpotData.newContent.link"
                    label="Select File"
                  ></v-file-input>
                </v-col>
              </v-row>

              <v-text-field
                v-model="editSpotData.newContent.name"
                label="Content Name"
              ></v-text-field>
              <v-btn block @click="addNewContent">Add Content</v-btn>
            </div>
            <div v-else>
              <div
                v-if="editSpotData.comments && editSpotData.comments.length > 0"
                class="mt-12"
              >
                <h2 class="text-center">Comments</h2>
                <div
                  v-for="(comment, index) in this.editSpotData.comments"
                  :key="index"
                >
                  <v-row class="mt-4">
                    <v-col>
                      <h3>{{ comment.msg }}</h3></v-col
                    > </v-row
                  ><v-row justify="space-between">
                    <v-col> {{ comment.name }}</v-col>
                    <v-col class="text-end">
                      {{ new Date(comment.updatedAt).toLocaleString() }}</v-col
                    >
                  </v-row>
                  <v-row> <v-divider></v-divider></v-row>
                </div>
              </div>
              <div v-else class="mt-12">
                <h2 class="text-center">No Comments</h2>
              </div>

              <v-textarea
                v-model="editSpotData.newComment"
                label="New Comment"
                auto-grow
                :rows="1"
                class="mt-6"
              ></v-textarea>
              <v-btn block @click="addNewComment">Add Comment</v-btn>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="admin"
            color="primary"
            text
            @click="saveSpot"
            :disabled="!editSpotData.editValid"
          >
            Save
          </v-btn>
          <v-btn v-if="admin" color="grey" text @click="cancelSpot">
            Cancel
          </v-btn>
          <v-btn v-else color="grey" text @click="cancelSpot"> OK </v-btn>
          <v-btn v-if="admin" color="grey" text @click="deleteSpot">
            Delete
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
import { getPano, commentsBySpotId } from "../graphql/queries";
import { updatePano, createComment } from "../graphql/mutations";
import { nanoid } from "nanoid";

export default {
  name: "Pano",
  components: {
    ContentDisplay: () => import("../components/ContentDisplay"),
  },
  data: function () {
    return {
      admin: null,
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
        sceneIndex: null,
        title: null,
        imgToUpload: null,
      },
      editSpotData: {
        dialog: false,
        editValid: false,
        spot: null,
        comments: null,
        newComment: null,
        newContent: {
          type: "img",
          name: null,
          thumbnail: null,
          file: null,
          link: null,
        },
      },
      // showSpotDetail: {
      //   dialog: false,
      //   spot: null,
      // },
      spotStyles: [
        { text: "Product Detail", value: "detail" },
        // { text: "Hyperlink", value: "link" },
        { text: "Change Pano Image", value: "scene" },
      ],
      contentTypes: [
        { text: "Image", value: "img" },
        { text: "PDF", value: "pdf" },
        { text: "Youtube", value: "youtube" },
      ],
      sceneSelectList: [],
      currentLayer: null,
    };
  },

  mounted() {
    this.admin = this.user.admin;
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
        this.loadLayer("default");
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
        this.editSceneData.sceneIndex = null;
        this.editSceneData.title = null;
      } else {
        this.editSceneData.sceneIndex = this.panoSource.sceneArr.findIndex(
          (scene) => scene.id == sceneID
        );
        this.editSceneData.sceneID = sceneID;
        this.editSceneData.title = this.pano.scenes[
          this.editSceneData.sceneID
        ].title;
      }
      this.editSceneData.imgToUpload = null;
      this.editSceneData.dialog = true;
    },
    deleteScene() {
      Storage.remove(
        this.panoSource.id +
          "/" +
          this.panoSource.sceneArr[this.editSceneData.sceneIndex].img
      );
      //+++remove content
      this.panoSource.sceneArr.splice(this.editSceneData.sceneIndex, 1);
      this.viewer.removeScene(this.editSceneData.sceneID);
      this.savePano();
      this.editSceneData.dialog = false;
      if (this.panoSource.sceneArr.length > 0) {
        this.loadScene(this.panoSource.sceneArr[0].id);
      } else {
        this.$router.push({ path: "/panolist" });
      }
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
          type: "img",
          name: null,
          thumbnail: null,
          file: null,
          link: null,
        },
      };
      this.viewer.off("mousedown", this.mouseDownHandler);
      document
        .getElementsByClassName("pnlm-ui")[0]
        .style.setProperty("cursor", "");
      // let pitch = this.viewer.getPitch();
      // let yaw = this.viewer.getYaw();
      // let hfov = this.viewer.getHfov();

      // newSpot.clickHandlerFunc = () => {
      //   this.specsDialog.newComment = null;
      //   this.specsDialog.dialog = true;
      //   this.specsDialog.content = newSpot.data;
      //   this.specsDialog.comments = newSpot.comments;
      // };
    },
    addTagConfig() {
      document
        .getElementsByClassName("pnlm-ui")[0]
        .style.setProperty("cursor", "crosshair", "important");
      this.viewer.on("mousedown", this.mouseDownHandler);
    },
    cancelSpot() {
      this.editSpotData = {
        dialog: false,
        editValid: false,
        spot: null,
        newContent: {
          type: "img",
          name: null,
          thumbnail: null,
          file: null,
          link: null,
        },
      };
    },
    deleteSpot() {
      this.viewer.removeHotSpot(this.editSpotData.spot.id);
      let spotIndex = this.panoSource.sceneArr[
        this.currentSceneIndex
      ].spots.findIndex((spot) => spot.id == this.editSpotData.spot.id);

      if (spotIndex >= 0) {
        //delete contents
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
        ].spots = this.panoSource.sceneArr[this.currentSceneIndex].spots.filter(
          (spot) => spot.id !== this.editSpotData.spot.id
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
    async saveSpot() {
      if (this.$refs.editspotform.validate()) {
        if (!this.panoSource.sceneArr[this.currentSceneIndex].spots) {
          this.panoSource.sceneArr[this.currentSceneIndex].spots = [];
        }

        async function asyncForEach(array, callback) {
          for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
          }
        }

        if (this.editSpotData.spot.contents) {
          await asyncForEach(
            this.editSpotData.spot.contents,
            async (content) => {
              if (content.delete) {
                if (content.link && !content.s3Upload) {
                  Storage.remove(this.panoSource.id + "/" + content.link);
                }
              } else {
                if (content.type !== "link" && content.s3Upload) {
                  if (content.link) {
                    Storage.remove(this.panoSource.id + "/" + content.link);
                  }
                  content.link = (
                    await Storage.put(
                      this.panoSource.id + "/" + nanoid(),
                      content.link,
                      {
                        contentType: content.link.type,
                        metadata: {
                          user: this.user.email,
                          type: "spotDetail",
                        },
                      }
                    )
                  ).key.split("/")[1];

                  delete content.s3Upload;
                }
              }
            }
          );
          this.editSpotData.spot.contents = this.editSpotData.spot.contents.filter(
            (content) => !content.delete
          );
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

    savePano() {
      console.log("save", this.panoSource);
      API.graphql({
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

    showSpot(spot) {
      let addSpot = JSON.parse(JSON.stringify(spot));
      if (this.admin) {
        addSpot.type = "info";
        addSpot.clickHandlerFunc = () => {
          this.editSpotData.spot = JSON.parse(JSON.stringify(spot));
          this.editSpotData.dialog = true;
        };
      } else {
        switch (addSpot.style) {
          case "detail":
            addSpot.type = "info";
            addSpot.clickHandlerFunc = () => {
              this.editSpotData.spot = spot;
              this.editSpotData.dialog = true;
              this.getComments();
            };
            break;
          case "link":
            addSpot.type = "info";
            addSpot.URL = addSpot.link;
            break;
          case "scene":
            addSpot.type = "scene";
            addSpot.clickHandlerFunc = () => {
              this.loadScene(addSpot.sceneID);
            };
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
      if (
        this.panoSource.sceneArr[this.currentSceneIndex].spots &&
        this.panoSource.sceneArr[this.currentSceneIndex].spots.length > 0
      ) {
        this.panoSource.sceneArr[this.currentSceneIndex].spots.forEach(
          (spot, spotIndex) => {
            if (spot.layer == layer) {
              this.showSpot(spot);
            }
          }
        );
      }

      this.currentLayer = layer;
    },
    async addNewContent() {
      // let fileURL = URL.createObjectURL(this.editSpotData.newContent.file);
      if (!this.editSpotData.spot.contents) {
        this.editSpotData.spot.contents = [];
      }

      if (this.editSpotData.newContent.type == "youtube") {
        this.editSpotData.spot.contents.push({
          type: this.editSpotData.newContent.type,
          name: this.editSpotData.newContent.name,
          link: this.editSpotData.newContent.link,
        });
      } else {
        this.editSpotData.spot.contents.push({
          type: this.editSpotData.newContent.type,
          name: this.editSpotData.newContent.name,
          link: this.editSpotData.newContent.link,
          // thumbnail: "String",
          s3Upload: true,
        });
      }
      // let fileType = this.editSpotData.newContent.link.type;

      // if (fileType.includes("image")) {
      //   this.editSpotData.spot.contents.push({
      //     type: "img",
      //     name: this.editSpotData.newContent.name,
      //     link: this.editSpotData.newContent.link,
      //     // thumbnail: "String",
      //     s3Upload: true,
      //   });
      // }

      // else if (fileType.includes("pdf")) {
      //   //+++generate thumbnail

      // }

      this.editSpotData.newContent = {
        type: "img",
        name: null,
        thumbnail: null,
        file: null,
        link: null,
      };
      this.$forceUpdate();
    },
    async getComments() {
      this.editSpotData.comments = (
        await API.graphql(
          graphqlOperation(commentsBySpotId, {
            spotID: this.editSpotData.spot.id,
            sortDirection: "DESC",
            // limit: 10,
          })
        )
      ).data.commentsBySpotID.items;
      this.$forceUpdate();
    },
    async addNewComment() {
      let newCommentData = {
        spotID: this.editSpotData.spot.id,
        name: this.user.name,
        msg: this.editSpotData.newComment,
      };

      await API.graphql(
        graphqlOperation(createComment, {
          input: newCommentData,
        })
      );

      this.getComments();
      this.editSpotData.newComment = null;
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

    admin: function () {
      if (this.currentScene) {
        this.loadScene(this.currentScene);
      }
    },
  },
};
</script>
<style>
/* .pnlm-grab {
  cursor: crosshair !important;
} */

.panoTip {
  white-space: pre-line;
}

/* .pnlm-panorama-info {
  bottom: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0) !important;
  text-transform: capitalize;
} */
.pnlm-panorama-info {
  display: none !important;
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
  /* width: 500px; */
}
</style>
