<template>
  <div class="bg">
    <div v-if="pano" class="vue-pannellum">
      <div class="default-slot mb-4">
        <v-row v-if="user.admin" justify="center" align="center">
          <v-btn v-if="admin" @click="initEditScene(null)" class="ml-2" small>
            Add Scene
          </v-btn>
          <v-btn v-if="admin" small @click="addLayer()" class="ml-2"
            >add layer</v-btn
          >

          <v-btn v-if="admin" small @click="addTagConfig" class="ml-2">
            Add Tag
          </v-btn>

          <v-btn small @click="admin = !admin" class="ml-2">
            {{ admin ? "Change to User View" : "Change to Admin View" }}
          </v-btn>
        </v-row>
        <v-row
          v-if="panoSource.layers && panoSource.layers.length > 0"
          justify="center"
          align="center"
        >
          <v-col cols="1"> Layers </v-col>
          <v-col cols="10">
            <v-chip-group
              multiple
              show-arrows
              center-active
              v-model="selectedLayersIndex"
              @change="loadLayers()"
            >
              <v-chip
                v-for="(layer, layerIndex) in panoSource.layers"
                :key="layerIndex"
                active-class="primary"
                :close="admin"
                close-icon="mdi-pencil-outline"
                @click:close="initEditLayer(layerIndex)"
              >
                {{ layer.name }}
              </v-chip>
            </v-chip-group>
          </v-col>
        </v-row>
        <v-row justify="center" align="center">
          <v-col cols="1"> Scenes </v-col>
          <v-col cols="10">
            <v-chip-group
              mandatory
              v-model="currentSceneIndex"
              center-active
              show-arrows
            >
              <v-chip
                v-for="(scene, sceneIndex) in panoSource.sceneArr"
                :key="sceneIndex"
                active-class="primary"
                @click="loadScene(scene.id)"
                :close="admin"
                close-icon="mdi-pencil-outline"
                @click:close="initEditScene(scene.id)"
              >
                {{ scene.title }}
              </v-chip>
            </v-chip-group></v-col
          >
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
        <v-card-title class="headline">Edit Scene</v-card-title>
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
      v-if="editLayerData.dialog"
      v-model="editLayerData.dialog"
      persistent
      max-width="600"
    >
      <v-card>
        <v-card-title class="headline">Edit Layer</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="editLayerData.layer.name"
            require
            :rules="[(v) => !!v || 'Name is required']"
            label="Layer Name"
          ></v-text-field>
          <v-select
            v-model="editLayerData.layer.icon"
            :items="iconStyles"
            label="Layer Icon"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="
              loadLayers();
              savePano();
              editLayerData.dialog = false;
            "
          >
            Confirm
          </v-btn>

          <v-btn
            v-if="panoSource.layers && panoSource.layers.length > 0"
            color="grey"
            text
            @click="deleteLayer()"
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
            <v-select
              v-model="editSpotData.spot.layer"
              :items="panoSource.layers"
              item-text="name"
              item-value="id"
              label="Layer"
              require
              :rules="[(v) => !!v || 'Layer is required']"
            ></v-select>

            <v-text-field
              v-if="editSpotData.spot.style == 'link'"
              v-model="editSpotData.spot.link"
              label="Link Address"
            ></v-text-field>
            <v-select
              v-if="editSpotData.spot.style == 'scene'"
              v-model="editSpotData.spot.sceneID"
              :items="allScenes"
              label="Target Scene"
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
            <v-divider class="ma-8"></v-divider>
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
              <v-form
                ref="newContentForm"
                v-model="editSpotData.newContentValid"
                lazy-validation
              >
                <v-row>
                  <v-col>
                    <v-select
                      v-model="editSpotData.newContent.type"
                      :items="contentTypes"
                      label="Type"
                      :rules="[(v) => !!v || 'Type is required']"
                      required
                    ></v-select
                  ></v-col>
                  <v-col>
                    <v-text-field
                      label="video Id"
                      v-model="editSpotData.newContent.link"
                      v-if="editSpotData.newContent.type == 'youtube'"
                      :rules="[(v) => !!v || 'Video ID is required']"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-else-if="editSpotData.newContent.type == 'link'"
                      label="URL"
                      v-model="editSpotData.newContent.link"
                      :rules="[(v) => !!v || 'URL is required']"
                      required
                    ></v-text-field>
                    <v-file-input
                      v-else-if="
                        editSpotData.newContent.type == 'pdf' ||
                        editSpotData.newContent.type == 'img'
                      "
                      v-model="editSpotData.newContent.link"
                      label="Select File"
                      :rules="[(v) => !!v || 'File is required']"
                      required
                    ></v-file-input>
                  </v-col>
                </v-row>

                <v-text-field
                  v-model="editSpotData.newContent.name"
                  label="Content Name"
                  :rules="[(v) => !!v || 'Name is required']"
                  required
                ></v-text-field>
              </v-form>
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
import {
  getPano,
  commentsBySpotId,
  editStatusByPano,
} from "../graphql/queries";
import {
  updatePano,
  createComment,
  createEditStatus,
} from "../graphql/mutations";
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
        newContentValid: true,
        newContent: {
          type: "img",
          name: null,
          thumbnail: null,
          file: null,
          link: null,
        },
      },
      editLayerData: {
        dialog: false,
        layerIndex: null,
        layer: null,
      },

      spotStyles: [
        { text: "Product Detail", value: "detail" },
        // { text: "Hyperlink", value: "link" },
        { text: "Change Scene", value: "scene" },
      ],
      contentTypes: [
        { text: "Image", value: "img" },
        { text: "PDF", value: "pdf" },
        { text: "Youtube", value: "youtube" },
        { text: "Hyperlink", value: "link" },
      ],
      iconStyles: ["diamond", "circle", "cross", "triangle", "square"],
      allScenes: [],

      selectedLayersIndex: [],
      editStatusInterval: null,
    };
  },

  mounted() {
    this.admin = this.user.admin;

    if (this.user.admin) {
      API.graphql(
        graphqlOperation(editStatusByPano, {
          panoID: this.$route.params.id,
          sortDirection: "DESC",
        })
      ).then((res) => {
        let items = res.data.editStatusByPano.items;

        if (
          items &&
          items.length > 0 &&
          items[0].email !== this.user.email &&
          new Date() - new Date(items[0].createdAt) < 5 * 60 * 1000
        ) {
          console.log(items[0].name + " is editing." + items[0].email);
        } else {
          console.log("You are editing.");
          this.updateEditStatus();
          this.updateEditStatusInterval();
        }
      });
    }

    API.graphql(graphqlOperation(getPano, { id: this.$route.params.id })).then(
      (data) => {
        this.panoSource = data.data.getPano;
        if (!this.panoSource.layers) {
          this.panoSource.layers = [];
        }
        if (this.panoSource) {
          this.initPano();
        } else {
          this.$router.push({ path: "/panolist" });
        }
      }
    );
  },
  beforeDestroy() {
    clearInterval(this.editStatusInterval);
  },
  methods: {
    updateEditStatusInterval() {
      this.editStatusInterval = setInterval(() => {
        this.updateEditStatus();
      }, 5 * 60 * 1000 - 60);
    },

    updateEditStatus() {
      API.graphql(
        graphqlOperation(createEditStatus, {
          input: {
            name: this.user.name,
            email: this.user.email,
            panoID: this.$route.params.id,
            ttl: new Date().getTime() + 24 * 60 * 60 * 1000,
          },
        })
      );
    },
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

        this.currentSceneIndex = 0;
        this.pano.default = {
          firstScene: this.panoSource.sceneArr[0].id,
          autoLoad: true,
        };

        this.viewer = window.pannellum.viewer(this.$el, this.pano);
        this.selectedLayersIndex = Array.from(
          Array(this.panoSource.layers.length).keys()
        );
        this.loadLayers();
      }
    },

    loadScene(sceneID) {
      this.viewer.loadScene(sceneID);
      let checkLoad = (viewer) => {
        if (viewer.isLoaded()) {
          this.loadLayers();
        } else {
          setTimeout(checkLoad, 500, viewer); // setTimeout(func, timeMS, params...)
        }
      };
      checkLoad(this.viewer);
    },
    initEditLayer(layerIndex) {
      this.editLayerData.layerIndex = layerIndex;
      this.editLayerData.layer = this.panoSource.layers[layerIndex];
      this.editLayerData.dialog = true;
    },
    deleteLayer() {
      this.panoSource.layers.splice(this.editLayerData.layerIndex, 1);
      this.savePano();
      this.editLayerData.dialog = false;
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
        this.editSceneData.title = this.panoSource.sceneArr[
          this.editSceneData.sceneIndex
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
          let sceneIndex = this.panoSource.sceneArr.findIndex(
            (scene) => scene.id == sceneID
          );

          //edit scene title
          this.pano.scenes[sceneID].title = this.editSceneData.title;

          //edit sceneArr title
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
            if (this.currentSceneIndex == sceneIndex) {
              this.loadScene(sceneID);
            }
          }
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
      }
      //  this.$forceUpdate();
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
          layer: null,
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
    addLayer() {
      this.panoSource.layers.push({
        id: nanoid(6),
        name: "New Layer",
        icon: "cross",
      });
      this.savePano();
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

        this.loadLayers();
        this.editSpotData.dialog = false;

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
      if (addSpot.layer) {
        let layer = this.panoSource.layers.find(
          (layer) => layer.id == addSpot.layer
        );

        addSpot.cssClass = layer ? layer.icon + "-hotspot" : null;
      }
      delete addSpot.layer;
      delete addSpot.style;
      delete addSpot.about;
      this.viewer.addHotSpot(addSpot);
    },

    loadLayers() {
      // await new Promise((r) => setTimeout(r, 500));
      //removeCurrentSpots
      let currentSceneID = this.viewer.getScene();
      if (this.pano.scenes[currentSceneID].hotSpots) {
        let hotSpotsID = this.pano.scenes[currentSceneID].hotSpots.map(
          (hotSpot) => hotSpot.id
        );
        hotSpotsID.forEach((hotSpotID) => {
          this.viewer.removeHotSpot(hotSpotID);
        });
      }

      let selectedLayersID = this.selectedLayersIndex
        ? this.selectedLayersIndex.map(
            (index) => this.panoSource.layers[index].id
          )
        : [];
      let allLayersID = this.panoSource.layers.map((layer) => layer.id);
      let SceneIndex = this.panoSource.sceneArr.findIndex(
        (scene) => scene.id == currentSceneID
      );

      if (this.panoSource.sceneArr[SceneIndex].spots) {
        this.panoSource.sceneArr[SceneIndex].spots.forEach(
          (spot, spotIndex) => {
            if (
              !spot.layer ||
              selectedLayersID.includes(spot.layer) ||
              !allLayersID.includes(spot.layer)
            ) {
              this.showSpot(spot);
            }
          }
        );
      }
    },
    async addNewContent() {
      if (this.$refs.newContentForm.validate()) {
        // let fileURL = URL.createObjectURL(this.editSpotData.newContent.file);
        if (!this.editSpotData.spot.contents) {
          this.editSpotData.spot.contents = [];
        }

        if (
          this.editSpotData.newContent.type == "pdf" ||
          this.editSpotData.newContent.type == "img"
        ) {
          this.editSpotData.spot.contents.push({
            type: this.editSpotData.newContent.type,
            name: this.editSpotData.newContent.name,
            link: this.editSpotData.newContent.link,
            // thumbnail: "String",
            s3Upload: true,
          });
        } else if (this.editSpotData.newContent.type == "link") {
          if (!this.editSpotData.newContent.link.includes("http")) {
            this.editSpotData.newContent.link =
              "http://" + this.editSpotData.newContent.link;
          }
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
      }
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
        this.allScenes = [];
        for (const sceneId in this.pano.scenes) {
          this.allScenes.push({
            text: this.pano.scenes[sceneId].title,
            value: sceneId,
          });
        }
      }
    },

    admin: function () {
      if (this.viewer) {
        this.loadScene(this.viewer.getScene());
      }
    },
  },
};
</script>
<style>
/* .pnlm-grab {
  cursor: crosshair !important;
} */

.square-hotspot {
  width: 30px;
  height: 30px;
  background-image: url("data:image/jpeg;base64,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");
  background-size: 30px 30px;
  /* background-color: #f8f8ff; */
}

.triangle-hotspot {
  width: 30px;
  height: 30px;
  background-image: url("data:image/png;base64,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");
  background-size: 30px 30px;
  /* background-color: #f8f8ff; */
}

.cross-hotspot {
  width: 30px;
  height: 30px;
  background-image: url("data:image/png;base64,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");
  background-size: 30px 30px;
  /* background-color: #f8f8ff; */
}

.circle-hotspot {
  width: 30px;
  height: 30px;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALIAAACyCAYAAADmipVoAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAMqlJREFUeJztnWmQXVW1x3mvyvKr5Xtf5JMKiCOOKE44IAEEDSBhiAMzAZVBZDRRggJOKCBoGA0JIoiIhtEBxQEkIelOp9NTBhKKUNb7hFWWAmr0vP079q9ZOXT33Z0eTnffs6tW3dt9p3P2/u+117x22aUZYxp9fX17dHV1zeno6Dh55cqVFz/88MM3/O53v1vx0EMPPfzb3/62N9G2RE8neiZRUaFnBl/bNvjeRxKtSHRDoosfe+yxk9esWTNn7dq1e9R9n82YJSMB9mUJrIc8+uijix555JE7EmB7EmC3C8oE3OI3v/lNSb/+9a9LGga4Y6L0/cXvf//74g9/+EORfm97+t2etFnu4BpWrVp1CNdU97w0Y5qPdevW7Zk44ikJOMsTgDYDKsD5y1/+svj5z39ePPDAA+XzX/3qV8WDDz5YvgaIBSA0XiDHDcJv8Fu/+MUvhn6f1xLQN//xj39cnjbZKQMDA3vWPW/NqHmkI/xF6QifmzjfkgSazYAFTjgaCVg5Z5UmgiMPB2yJ3+A9gj0Ae0nagHO5p7rntRlTMDZt2vTidETP57hOAH4OYAgKOKyAqRzxJSUuPSzAFC/kzuMhuPBw3N6NkgBbXovX7bXyP15L73+Oe+vu7p7PvdY9382Y4JGO4QPTQi9LC/9s5HDD0UhHvXKwoI3vnyjRYqTfqHJkf4tHNxsbDTGEjcD/0/0+u3r16mW9vb0H1j3/zRjHSPLjrgnAC9OCbgQEyLcsOAtfPaIBjwCQEw/3vigCDMe1xwtkOW8EawRyBHh1k0VOXlVAmYME6oXMSd3r0ozMkcC7T+JOS13ceES70JGTRjD6WuR0gl8ZeTJFi1aii+IP1+x1cU0qh3ED8j5FFV7nfXDs9NrN/f3976x7nZoxwkiy7wEJAPdNJJjGq7hVFcO6rymKI48++ugDSZb+cN3r1ozBkRbjoHR0PjicfFsnTTbH3hmK1yKXfuyxxx7q6en5SN3r2LYjLcC+aSHuBywT5ZAYL0VRJMq7dV+XFK/JeQPQ/C+JY79ct27dB+te17YZSQvfHYcAC4DDQM4yEcpWK4riwnBUtSu3en+VpuL6o+zvNSpzA+yVK1f+cMOGDa+ue51n9UhcYzGTruLD4kyk1WC8QI524KhYRptvnUDGcsN1CV7+p0jG31w7f2PKS0rzJUVR/Ffdaz6rBh64NNF9cGAoghhi8vn/VB3NI9Fw3NlrlAOORpN9/crp8feqlhqtIMxxes/Gzs7Oj9W9/jN+JAC/JGnXN8ZJdzEEB49MOqaluoGMdw1uBlVt1iO5tacSyDpOIK5NjiyI43VE+RnHypo1a/63bjzMyJFAPC9N8lMcd0xmUu52AEdcFO2mdQNZYAACTgjiN+6///7i3nvvLe65557agRxFGHUM5lfGgOgheD1BvKdE/5c26jF142JGjTSp1zCpymu58u9wXq8Yj+D7qk4PN0R0OKSToNw8kHEWcP377ruv+MlPflIsX768WLJkSXH55ZcXl1xySbF48eLi/PPPL84777zi3HPPLc4+++zirLPOKk4//fTis5/9bPGZz3ym/N/nP//54pxzzikuvPDC4stf/nL5+e9973vFjTfeWNIdd9xRAozf5BqgVatWFYkjDm2mqtNDQPIZgeoJAfF8osJM07UsSbLzf9eNkWk9EhfeO018h+GLLJRcOGeiq25lOaMLzaIqUw9n201HaAkcQbtixYrihz/8YXHDDTcUV199dXHxxRcXixYtKsF46qmnFh//+MeLuXPnFnPmzCk+8IEPFG9/+9uLvffeu6S3ve1txVvf+tbiLW95S/HmN7+5JF5/xzveUeyzzz7Fe97znvIzBx54YPHRj360OPzww4vTTjut/G42xTe/+c3yN7///e8XP/7xj8sNpKLGNa5cubKcG/UDRauq11IxAcYwXiDzO3xv2lRdfX19+9SNl2k5iAXWrRwVugjMnKO/GqMQRQItCm4QABE5FmD46U9/WoIHIF1wwQXFySefXMybN684+OCDi/e9733FvvvuW7z73e8uAQlI99prr+J1r3td8ZrXvKZ4/etfP0RveMMbytekN77xjeV7Xvva15av8zfgBuyAXuADcn7jQx/6UAnwT33qU8XnPve54ktf+lJx7bXXlicB1yio5NwAO95zjA/xXscLZDaDlg0YQlIET60bN9NqJBBfGUMXPT6HA+VopPhQ3QyKEP7NcxYeEAPe2267rbjuuutKsQBR4Nhjjy0OPfTQEkzvfOc7ize96U0lAPfcc8/i1a9+dfkcoPJ/wAwHhtsCRjmy3FcO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");
  background-size: 30px 30px;
  /* background-color: #f8f8ff; */
}

.diamond-hotspot {
  width: 30px;
  height: 30px;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQ0AAAEQCAYAAACqWiFNAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAOz9JREFUeJztnWmTJWW1tv0B749QRsV5HhuHFtTwnV8NDGUSBAGlHegGlAhCxeEcPBw5NEMzjzLrB7RxFkfopqu7q6zq6g74ohGGEf4BZQjc775SrnKR7NqZuzOz9rRWxIqq2lWVtSvzee5nDfda6yUvSUkZIr1e77+N+z2kpKRMiTz77LMf6IPGO8b9PlJSUqZA/va3v33sqaeeumLc7yMlJWVK5C9/+cuvx/0eUlJSpkQOHjz49r179/aWl5f/+7jfS0pKyoTLgQMHjvvVr3618uMf/7j329/+tvfEE08kcKSkpAyWffv2HffLX/5y5ZFHHun95je/6fHxd7/7XW9xcTGBIyUl5YWChdEHipUf/ehHvV/84he9X//6172f//znvT6I9B599NFe32VJ4EhJSfmn7Nq167i+RbHyk5/8pLdz584CKLA0AI+f/exnhcXRd1nS4khJSfmnS/LTn/50Bcui/7FQAOP3v/99YW0AIACGFkcGR1NS5lh0SQAKYheAg/EMgqCABq/x0e/zeVocKSlzKFgYZElwQQCKCBJYFaquCaBBjIOYB6+lxZGSMkeChdEHiQIwjF/ohggagkl8LSogk8CRkjIHAmAQ9BQQsC5QAp58DYD4GsCA8pouzOOPP168xtf8fGZVUlJmWORh4GLgaggK0aIYplgYgAuAwe8DLI899lhv9+7dCRwpKbMmWBj9zb0S06hYDpK4qgAjxju4BqplwnXS4khJmSGBh0GWxE1fzpDUAQ1+XhVA+D1BJHkcKSkzIvIwsC6ideDGj1ZEHWsDoMGy4COv4abgriSPIyVlBiTyMNjUbHoBwywIG18AGKZmU3RHUK8DcCSPIyVlyqXMw9A6MIZRjkvUAQ1BRtfG3/P6yeNISZlSGcTDiEHPMnGrDU0eR0rKlMp6PAwDntFiiK9VgUKMYwwCnuRxpKRMoTTlYTRR/oYaA6fPB08TOFJSJk2a8jC6BA00LY6UlAkSsyTGFg6Hh9EWaJRfj65RZlVSUiZAcEn6G7IVHkaXynujR0cGR1NSxiixRV9THkbXCmAIYGlxpKSMQcySyMhsysNoqroh67ktgAbvhy7nvJ4WR0rKBoqAEYGhax5GXdCIwBGDo2UeB+83gSMlZQNE4hYxDMvTpXQ34WF0DRo0LcYS2r17dwFufM3rmVVJSelQmvAwcA+0RNBy/KMMNrGSle/RN4OvBSBdofXckrLqIlmrEtsMPvroowkcKSltS1MeRplHUS5zl/otuPgzfN/Mh3ET/64AY7FaHdVVie+Da6bFkZLSorTBw1jPivB3cRcAhl27dhUggTVjC0B/LtawGJvgc62Qqr8fqe3lvhzJ40hJaUna4mGw2bUWtB6coMbXgIS9Qu+8887e9u3be7fcckvv4YcfXst8uPmdj2JWpA5oxL8Ve4/GTE/yOFJSGkqbPAwa5AwCDH6XTc9H0qE33HBD73Of+1zvpJNO6p177rm9G2+88QVuCZucnysPVar6+7Efh6AR+3EkjyMlpaG0zcMwYIolEWMigAmgwedYFuedd15v06ZNvWOPPbb39re/vffFL36xd++99xZ/i5/FfdHi8D3xHuvEMtZzTbwW10keR0rKYUgXPAxns9rFS8DQcgAwPvOZzxSA8epXv7r38pe/vHfcccf1PvShD/U+//nP92666abChdmzZ8+aOyIAxJkpw0ArNu0pv3//V7M4yeNISakpXfEwMP/5Wa+JxcB1f/jDH/a++93v9s4///zeu971rt4RRxzRe/Ob39x773vf23vDG97Qe+1rX9t797vf3bvwwgt7d9xxhyML1tK0ZmHq/H2tnegeCWjGVHhfyeNISakpAAZBT3kYMeVZZ1MO42FgYXjae21+b8eOHb2zzz6798Y3vnGovuUtbyksjvvuu2/t/fg3CZbyd3Sl5F9Ey6KOJSSoOVfFv5FzVVJSBghZkr67sBbDcMNoZdSJGQzjYZQnpwEkt99+e2FhYFVUgcab3vSm3gknnFAEScmuaOkYoFVj/9AIYFXvvzxXJQZ5uQ9pcaSkBNHCiDNU5UTEwczDtIqH4etmO2677bYi6IlLQvyiCjRe//rXFz/Hz19wwQW9u+++e83V0fXxPWsd4WLJ5agbKC2DSPx+ZlVSUl7yL2p4BAutghj0rNp0VTwMXRItDIKeZEde8YpX9F7zmtdUggaxDRTw2Lx5c+8LX/hCEQspuxh8xFIiuCo5bBTQWy8lmzyOlJSX/Iu4RdAvDiJyc8dgYZVW8TAc4gwPgxjGO97xjiI7AhAQr6gCDeMagAa/I3AAQPwt/gbK3wcwUF2TOjGZ6I7EJsZmfJLHkTL3gkvS3wQr0RooF4lpebhhhmkVD4OvSZueeeaZRXYEC4M4BUBQx9J429ve1nvlK19ZqO4KlspnP/vZgsfBeyDzgRrQ1GIyRlPHPSnPVInkr+zHkTK3AmAQ9HRTCA4xEFgOaNbJPgzjYVx33XUFw5ONTmyCTQ8QkFYFQOpYGVgmAAzXeN3rXtc7+uijC4sDAtjNN99cpE0ZYeDf1Xqqkz2pqpbNfhwpcyvGMLQu2BCONSzTwzXPjQ0M0yoeBi7Je97zngIwAIp3vvOdxUddlDoxjbe+9a1FIBSwATQAEKwVrrVt27YiuGotSiRpASJ1QK8cx4mp4+zHkTKXokvCgmdTtdkPoykPo6lW8Th4b1pCfKzbh6McZM1+HClzI1gY/U20YmbBIGVd0Oiah9FUq3gcAlo5O2Q8pi54lCno2Y8jZSZFl4QT0hL3uJHqbJaueRhNtQ6Po5wdkoZex32p6seRs2NTZkac3h4Dg26cUczzrnkYTXUUHgfAKd28bsyjqh8HH4mlpMWRMtUiYLBJZEtauBWthzrWxkbwMNqIa6zH4zD16/vknkgRb6Mfhy4ZP5s8jpSpFIOesfhKU9pNH5v0Vm2arnkYTbWKx8H7I6ND9sN4hpZTHfLXMNdEC4R7vXPnzuK1lZWV/zHuNZCSUlsADIKe5eIrT8UY/Xcj1MkedMnDaMPKGMbjoAOY/Ths5KPVUCcQXNWPwzStPTm4PwkcKVMhMYYRTejY5TuemHIrqjZN1zyMNmIaw3gcW7duLYKzAB3WhhtfV6PO/z+sH4cuEKDEz5HW5vsJHCkTLV33wxB03BD8DRoAn3766RsSs2hqiQzjcRggxWoSRLXA6gaMuScGWQVXXLfHH388gSNl8mSj+mG4idgcULdxSTjdxw0KVVrF4yhbYMY9BNCq+1fuxxH7p/IMDh48mMCRMjnSdxU674fhRrJ47dZbb+2dc845RZaE2MG4QaFKq3gc8XOHL3kv68Z8ykCrCyT7tm8J/s9xr5WUlMLC6FsWnffD0P/nZ+nVKQ+DjbgR2ZGmWsXj0CUpcy9i5qSOtVEurY8tCHFVEjhSxirOJWFRdt0Pw9OYtCoWBic26U0CjgQgxw0KdXQYj8NskCMRYtPiOoHisoUXCwDLPI4+0CdwpGy8mCWJJnSX/TC4NjGMs846q9h8AAZ8DDIVG5Edaap1eRxxroqZlTpVvjG1Xe7J4fOJPI60OFI2VBwz4EKNPS+66odBtSq1JMQw4F2QTuVzAoxuxEnWKh4Hc1fIOjnCQKCIw6ab6CAeRwJHyoaIg4zKhWJd98P49Kc/XVSrStQyY6KLMm5QqNIqHsfFF19cuCreTwdQy72oExMyjhFjST6n9Xgc/ef5v8a9plJmWKxWlYcxSml7HHikO2LgU7/dhW+0n5+//vrrN6QfxrgV64PgrulYMygGMp3qxtfRHYwZpjrWxiAeRx9IEjhS2hcsjN27d69oORhzMNpfx/0ozweJ3IKYVhRESKuykZhwNu5N3bXivrzvfe8rYhx33XXXGiAIznEIdbzvo2RWovtY5nEcOnQogSOlPYGHQZbERWeAU2tglIUb07Hl+aVmDPicoCcuybTwMJoq7guu1vHHH7+WjjUY6nBoeRwGlkepEq7icfD5/v37EzhSmos8DJvnRKuhfIrVAY14gmpqszHkEmhhwPTE94eHwUDmcW/qrvVVr3pVkQ0i7kENzZYtW3oPPPDAWhdyA8TGjdZ7FlX3fz0eh3NVMsaR0kgiD8MFG+tB4qyOqgUbrRI7eJklIegpcFANKg8DsDA1Oe5N3bUSGCUgCmgAIAAHQ6dhjjoXxriQPA5jSnW4MFU8jjhXpW9x/O9xr72UKZQyD8PTKTIW42lXJzvigo/jCl3A/Iw8DDcOlgYbadwbeiOU/5lsCkBJOhkQATixOAAOeRxUyOqa+Ezqkr+G8Th0gZyrsrq6msCRUl8G8TBi8K2czqujMaXqIuU1rkOV57XXXrvWD0MeBoBBgHAe3BNAA1cMsOT/xsI68sgjizQztSpQ57HEmKviBv/Vr/6Vlar7HIaBSowvcd0EjpRash4PIwYvY3GZr1UtShahpjDgw4kJb4D0LeXidNzatGlT75hjjik2jP0wpoWH0VT5X1HAQ+sK8CRASnD00ksvLSwO6fa4LFhsfK71UXX/h/E4eA7yY+JclQSOlKHShIdh3USM1kcTmAWuea3lwuvEMEgzjnvTTroCqFhiEMCMA9lnhI9d8jj6zyyBI+XF0pSH4eJ0wZZTfDFwytecZBSfsRHmgYfRVHHbCI5Cpb/nnntekFXR+uiSx9G3OP7PuNdoygSJWRIXzeHwMNYrXIu/G1OGpFXZAJji88DDaKqj9OPogsfB14uLiwkcKf90SfqLozEPQ1cm5v/jNb0Or9Erk6wAvjoxi3kIdDZVi/LgcmBxMDmOWFAc99glj4NrYtGkxTHnooVBDKMpDyPOM4mA4QQxvsffueaaa4qgJycmKcZ5CHK2odwr2LFWywK48jgMYnbJ4zAGxWtpccypmCXxJGnKw5D+HfthPD+ceG2CGDGMM844ozgt5WGwERI4qpV7RiZFoOUjwVF6jlKrslE8DgCKr5eXlxM45kkEjAgMTXkY5X4YWB6ChXNJKD6z45Yl4aQYEzTqgQb3DeCw8RDp6fe///1FrUrXPA7XhPr87Nj/O+61nLIBInELa8DgWSxbP1wehgChS8KJB3DQKQoT+pRTTilA4thjjy1AAjMba8PBRuPelJOu3jPuIZkU7pmxIIC4ax6H1iigJOWf1w8ePJjAMcvShIdRNZcEcLC1n76xLglBz3FvullXYhzMVaE6VpCPXA02ux3B7L/qc6/jfsb+rWUX9LHHHkvgmEVpk4fhQiun51yoDjmWh8GCHvemmgeFcg5A33///Wt9VbUIIpcjtmasG+gut3McMFclgWOWpA0eRtVcEi0RC9PwsWF6Sg0f94aadSUwetRRRxWuCq0DKauPGSxriMrjHbUi6h4afh3XgV9njGNGpC0eRtVcEl0WXoPqjKlMJyoCdtRUjHtTzYOaXcGyA7ABbp+d/UqitRAtxqrnb6xLLkc8cPwe1szKysr/G/eaT2kgbfIwquaS8DpxjauvvnqNh+FwICL/495Qs64ESclEcc8pdDMdC3D47GM/1sjjqBPorsPj8OBYWlpK4JhGaZuHUTWXhO/TDwPAMD3IR7Mk495Us65WBGNpCNIAN2luLD+L2iwYjBkT4x513dNBIyuczyKPIy2OKZON4GGU55IQ9ORko/jM1vwyGKdhbOK0KxaG4GxbAZij8DhwVaj1IQ27sLBQgEfMgNVZB7FFwqDgeOzH4VyVBI4pka54GFVzSU4//fS1WhKJW3AL4BIAHOPeVLOuuIG4JIC2gMFrADevX3LJJcVzAjDQ6KLUnYAXrYvyfBsAiZ/BkinxOBI4Jlm65GGwKLAsAAuDYfwe/TAonhr3pkkdrrgsWIKMgIzd04xFGcQ2YFqmkdexRofMVfnIuPdGygDpmochiES3BF+ZhXjCCSeMfVOkDlesP1wVeBxmVTwQyvNoYuzLA6SO+xJjHAPmqiRwTJJgYXTNw/DU0cJg4WFh4JJABR/3pkgdrrgqZlViPw6rkGNmJDI/5XfUiXkN68fxfFYlgWMSxK7hXfMwvE7sh4H/TPAtA52Tr8SXAA7iHVgcDJ2mA5jWRTwYcC8IbjuDt81+HH2LOIFjnBIBo2seBsrfYbYqk88ADAvNMtA5+eogJgFE4MBi5Hn7jHn+AAaqa9IBjyOBYxxCDAPAMOjUNQ+Da9xyyy29T33qU8XiIytCtaXt9se9KVKHK88Kq9DsFhYHmRXSsQRHWQMEuVGzZB5AdXgcVf04yjyO/vr96Lj30FwJgNF3JVb0F+VNdMnDKPfDYNGxEDnB0j2ZfOU5kYblWfHcsDbozQrVn34cEPPY0FTD+tx1N0ZZR8NApczjSODYINElEb1jBLxLHgZMT6oonTmKheHQYk6ucW+K1OEKWNiPQ7q5/TiwOLZt21bEqlgHWJbxMLJXSlVMbFg/jvV4HIcOHUrg6FKwMCg+k4eh+VgXFIbxMHiIghBmpIDD5DNcknEv+tRuFUChyJBmxa4n1wwT8JryOLSKHfxtVgZA6gNJAkcXgoXRv8FrtSQ+1Lrt3Kp4GH4umDi9HZck55LMvmItwreBd3PnnXeuWapt8TjiGiw3AOJ6aXG0LFoYonWMUmsd1EF6F8IgHoavSynGVKWBDuZs9sOYfa2aq9KUxzFogJaus1bzH/7whwSONkRqeASLeNPLNQDDfM5hPAybtcj0ZJARATN6euZcktlXYhy2Mti8eXMRHCWWVQ6W8/FweBwxsDqIx2E/0wSOhmIDHYJI8YbbiclNX8c0rOJh8D0eHLUk8DAIjhltz34Y86HENQANwEPg4ABhrbTN44hBfC0Nf2b//v0JHIcj8jCiNRDdivgQ6lYpDuNh8DOk3Qh6AhJQjvFzWUhpacy+MhaBTJiT3AAPLM0ueBwxCB8PNb4PGPF1WhwjCoBB0NNYhOAQo9DlgGbVQ6viYcD0JOiJhQFgsGhYSPAx+Hrcizq1W3VyW5nHgcUBc7QpjyN2Ro86qEeHFnACR00xhhFrPmR8lunhIri+5TCt4mGcc845BdGHhYOFQUDMvgyYq+Ne1KndKs8Y/gbPncPCKW72RmnK43A0p2vWfh4CCgcXBxvr0m72vJ5ZlQrRJSGGEXs41kHyOjwMv448DJieycNIrdIqHgevsW5RXd/IUK4Td1uvH0fyONYRLAyo4UamNdHqgkYVD6PcF4OHzMmBz8oU8nEvytTJ1ioeh260neJct3Up6FX9OJJyXpK+SVa4JHHauv5inXiFNzv6jhFI4s/p5gAYpFUxR7MfRmqVVvE4XLMCRoy91R3GNKwfR2ZVgmBh9K2LlXIeuxxdrtIqHoYPmK9Joxn0JGaRA5hTq3QUHocuhtyfOqDhgbcej4Nrsb7n3uJwLonxBje+NyyWGtcJNA3jYRhcgodB0JMTg+IzsyTjXpSpk691eRzGNkbJrlT145BWwGtza3FYrRrTp5pk5ehyHaSu4mHwNWMGCHo6i4RoOdZGTkBLrdIqHocZuTKPY5RhTMP6cegCyeOYO4vDMQPeqMjBsAowgkkdN6VOPwxiGLokplUBjuyHkVqlVTwODiSyKKby47ydUdzsYTG7qHNFOXeQ0aBCseiGmOUQtatuahUPA2o4/TB48DA+qVxlIWBqZj+M1Cqtw+OgKto5Kgb0WYMyjqticnX7cbAvTO3OvMXRZC5JbOOndaLvZym7gdDYyeuGG24oYhjjXnTToGwEzG9O0COPPLLIFkChR3Hhhum43/u4tYrHIXA4c6XMEK1rbcwVj6PpXBIRuGyheDNjPwz9yORh1FesrxNPPLH38Y9/vHfGGWcUSvyHr+EnJGgM1yoeh5ZEPOiSxzFE4GG0PZdEqyMGkMyJ85EmwLgk+J9HHXXU2BfVpCtuG0AB/wDXjhoLnhGdyz72sY8laFRoFY8jfm4mZJTsYBWPg69nJsYhD6PpXJJoYRi7MNZh4MmSeRvo4IPSQMeId+r6esQRRxTmdX/h9ZSnn366uJ9YHGwK54YkWLxYq3gcBui1PtbbC1XWRo25KtMNHJGH0XQuSfw9AcNUFMEh0ZwoNjEMglOABQ8y55JUK5W8ZAEAjWeeeab31FNP9Z577rne3r17C5Nb0IjAMe73PGk6jMehiyLRMNZW1alNqTNXRWCZWh5HmYfRdC6JNyUChpFqEJabhUty1llnFRYGPAweoumxcS+oSVcAlkV+8ODBwsp49tlni4+Li4tFXIh7GKeUCRr48pl9quZxsF5x+zjgdE3cE3Wyg1U8Dq7FdaZ2rsogHkbTuSQxpcpHgCLyMPC9sTB4ePiWDsNhQad7Uq1YGvBY+s9uDTSwOIhtEOtI0BiuVTwOJrlhcXM/3eAehl3wOKaqH8d6PIymc0kca2eqds+ePQVyk69+4IEHep/85CcLl4QHxQMDMFjgAEZaGtXKfTr11FOLZ/HXv/6198QTT/T++Mc/Fs+Ke5ugMVyreByXXnppERy13IF1a19QrY+q9T+MxwEg8TOA0lTNVWnCw6jqh8EN1rzTcuH34GFgAo570Uy7knJlvumFF17Yu/LKK3tf+9rXel//+td7F198ce+DH/zg2N/ftKsjIO+66661LErsai5NwPifLoha19qYKh5HUx6GYOHPltNLEVXty0jQE5M655I0V0ADK+L4448vmLOckHwO9yBn1TZX3BdclfPPP7/IqhiP8HCNc1WiVWHGpE5mxX0yFTwOLIy2eRgRSGKwVMvF8vZNmzblXJIWFJBwVCHxDdw8xjfgp2eP1ObKveVeAsQEnLE4YqOp9Xgc7qWq/TNV/TgAjP4/3JiHUdUPI1YMElSCU8CJyCLPHp7tKKehsQrbBXBvc4RDc3Xmr3VPWBz333//WlDUwGjMLnpgjsIanfh+HPIwbM/XhIdR1Q+Df5jgEdWqpFVBbIJNLPJc1M3V4CbWxUtf+tLC0sDCsIXAuN/ftCvgS1zDLAvAQZEbrgr7x6psrY44IqFuSnYYj2Mi+nHokvgPNuVhVPXD4BrOJbGcnYdg1/BxL4ppVxc1wVCUzuzUolC3kzGN5ur8HBs/cb/JqmzZsqXIqrAHuuRxjL0fhzyMSLRqysOo0w/DGAY33n4YprfGvSimXTGfP/rRj/auvvrq3kMPPdR78MEHi8VMBiWzJ82Vg07LDbDgoKMmChd769atRVk96xzQsCwCq0ALvO4+GhYzHFs/DnkYWhLlmpDD5WFU9cM45ZRTipuN+QxI2H0LIleCRnPFZKZep29BrtWe/P3vfy8WLafhuN/frCiHHIcdh579aXFVvvzlLxfVsQZGPTzZB1D568QEJ7IfR9c8jOdzyi/gYdDTM3kY7arxi1hPwimIJXfo0KHeP/7xjzUaOc+CtDamtTEkVLJXxpTaUVxDmKP33HNPsaHj/mJvWHXM58b7ypnFKlCJvBBDAFy/fzB0Axxd8zBiykgkZFQiQU9u6Lgf6ixpgsbkKfcSHgdZQYAjxjPYc7opMVYxasGnvzOIx9E6c9QsiX+0Cx6Gloh0cXw8a0le9rKXjf2hzpImaEye4mrjepMVvOiii4p0bBzAJEvUbv3R7a8T84h7rbwP/X5rWRVckv4FO+dheF1eox8G5dj4etzMbPzbriZoTKaaVZHHESnnxDjc9OV+HHXcE2ONcjniga/l0QqPQwuDGEbXPAy+Z7UqaVWyJDY1yUXZriZoTJ5iUZNh4Z7K4yi3Doz9cGM/jrojEjrncZglkVHWNQ+Dj1DDzz777OIGski5iX4+7oc6S5qgMXlqNkUyHfeUbCH3HuBgc8dEQcyYWNFaNzwQrROtFpmph83jKKdVfYNd8jAgbhEEgkxkSTEBUG5egka7mqAxeeoz4J4S12D9E+OAx0HKmxgfyYGFhYW14V9xzEfV/ostKgYlJ9zrujEjFblJ3DK1E9uUdcnDOO200wqXhBvHQsTCADxA33E/0FnTBI3JVJr3YF0AGFgcdp/DVbnkkkuKfeL4x+ii6FpUWfrRuojhBZQQhPsy8jgqsyoChn8kkkXqWhRVoGHABcIKn2/fvr1YrNwwbhwLkZtmX0+bvoz7gc6SJmhMn37gAx8ouutDQ2Bzw9swVlG330bV/tQK0RgAVHh93RgHgNF3F1YMUEYeRZ2YRZXGGZd8jSVjPwx6NgAUWBZxcfoxC6ba1QSN6VOeEfsEV4VeuMYhYryiKWh4LQGDPaqr8uSTT370RYBh8ZlBFc2Zuk1AqtR/0BgGiAly4r9ZNswiJGPigvZzrZDUdjRBY/qUAxV3hf1COpb2EO6rNjwBu6J7qMdRC2Zd1mpV/vSnPxUWhq6DWY2IPG00PvXNcN2dO3f2LrvssqIQihvBgsQdYfHxkXgGn7so7e2Q2o4maEyfkhSQs/SRj3ykd8UVVxRxB9tGNN2fluBbkm+Zvp4GoyXJ3Pz5z3/+J3AsLS19xUFD8tH92irWpm9KU0cu/TXXXNM7/fTTi8CPTXRYvFgcWBYAhQs055a0qwka06cWZdK2gOeBpc4hD2i04QmY3XTomNfUaOD1F8U29uzZ85XIdRcw6mRG6qrX9e/wj9Men5gFi8+IsUBhp+tclO1qgsb0KRPwHMBEM21cfEmRdfpt1HFPDB8YeySjQrgC0Fi3jH55efkrIo7+TFvuiSaQ/hGmDp/TvwFCFzeExUd8Q14GX6vjfmizpAka06fsD4KgECAtYHNIWB1y1yh7VM8AYAJMKhmi+/bt+2rMlrThmqD8Y+aYrWPhc17nRnziE59Y63zNAnUxJmi0rwka06df+tKXiqwJe0lyl5nONvZnnFpocHWohVGWlZWVr8px5yM5YetFdFeMe/A1AZmmb5r0q525XJAEfYh3EN/ATeGjQdIc1nP4mqAxecp9pKEUlrbjJHDVOUi5/z/4wQ+KA9YgpQztGH+oCg0IBHwdMyOx6ty4xmGNPVhcXPyqFNVYqBbfiH+kDZ+KG4KrwjQvabQuRgOl3Fg+B0wsZDP2Me6HPk2aoDF5CvPZNc19BTCgkNOYBwvD8gstgXJDq7r7rFwGEttRmD1pNNKx/4tf02eKzUpjDrct8wjyF9fasWNHERyFOquFwQ11IjeLF9AwWJqgMbomaEyesqalHfA5BydVrvRpZW+US9pH3X+GHGKbTvd0HKPwAj7G4Urf4iiAw5RpNG9i9+OmoMH17cQMtZx0LEjLosRk0y2RYh7TsLloR9MEjclTLQwsaTrBU7xpPw25GOVy9rJ7MUxjCnVQmwuCnq0AhrK6uvo1LqqJVO4A1AZoQB6xYIabgcUBYxSLQ9MNBSycH8EN5kYn+Ws0TdCYPMW64HBkvZNWxcJwb3Gg2tluEGCMMraxvGdt38k1W5+H0ke7y+yJIWiIVG1kWGzbzrWYCA+6Ug5MQx7IXgAEN1UzDovDhQxBbNwPfZo0QWPylIMRyxoLg2pWN3bkNrnJzXSUe2NUxTIEmNjiwn3c2QClvsVxGZHb2LuQP9pGIJTrepP4SBUsQILFwaKFCWeEGQABNFzwaWmMpgkak6dkSQh6OjhJq8IDtTyusczarAMaMegp7YGQQOdjDBYWFi6LPQr5vA1yCdewxwauCv8UFgd/h3QsMQ4a9LC47eplamrcD3zaNEFj8pQxHVjWHJ64Iqx/4xmD2lT4GvuvDuVBDoZsbFt4btjApOXl5a9rFfAm6CYUc7z+UzFw0xRUaHl25plnFgvUNoBMi8fywA+Uz4Gr4iI2Gp0DoqsVUKD7e//ZFmDx9NNPF8OS4OjgIgoS9jdJnsxo6nAv3GstY+65PAw2MUChZRF76tZx/2Pjbw9zA55eJ/IxDouH0VSWlpa+LvrF2Eacq6C24b5wU3FVmIMCMLCAiXUAIMY6eBByOayO5fsJGtXKPWTxChoAxlNPPVUcCASkEzSaaayp4j4a9CStiiVdDmyWu4VX7Y8Y2yh32PN77s1GPIw2gMPobmzaYwOPOA2qKWjYWYiJa6eeemoBHCigQC/FaDYLEoCKWZZxL5pJV+aK4p70F1PhngAauCiABrVBCRrNFKtCyoDzXLnf9MXQKi8PbS4PNqraH+W4B69rYUTwGdvUeKX/Br4RmaPrRWebgkacvAZwcPoBCiA2C1j+BiCimmXJuEe1UkVJ5P7gwYO9KASksUBi/COCRmo91cLAIiZLgoVBzVVssh07ccW0at094u/ZeU8gigTNsVkYZekvtG8MGqaktgEaBnz00QgaERwFHOTp2+VLC8RgX56E1Yq1RvS+fwj0nnnmmd5zzz1XuCfcb07EMmAkcIym3CsAA+LWBRdcUIxedH84IsTDVnZmjEnU2R8xq+khq4XB/hy7hVGW/j/2jfIQpYh+TUFDdbgSHwmOErwDxZ0ZwcI2s6I5nU18qpWg8imnnFKAsek5FtpVV13VO+mkk14EFgkeoykuMkFPAOPee+99QfbD/RJdkjiIrA5oaOWX07MCSd/NnCzAUA4cOPANfKvyDMo2UrK2avea5JcBD1wVfG7SsTwc3BXAwgxKLuh6yn3DbD755JN75557bqG4gAAGlccJGs2U1pbbtm0rAENLIHbKkzRZZluXZ5UMA43YppM9x2HNHpkYl2Q92bdv3zf9R/Wn2rA0vHEGhkRVOB1w9FnsLPqY1rJlYAZCq9VMlA2eY1GgrQgSNA5f5WE4wJmyDNdxBIsyyzPGBocp1/J35WHwuxMPGMrS0tI3BQv7ceimRF8t+nBNQYUHQsCOeIYL2S5g0tCTx7G+xkDnIB33+5t07bofRhUPIw53FoAmLoZRJf03/M2YVYnEkrIZ1kbtioOXZI56OvLwPDl9uMnjeLEmaDTTrvthVPEwYiwEa2ZqLIyy9N/4t/iHRNhIAht1gHSVSjl36jwPTMQ3LZs8jvU1QaOZdt0Po4qHEWcWTS1gKIuLi9+yBXo5NhFdlaagwXWc4sZ4BBr58OBE/eRxDNeMWTTTrvthuMbX42FIQZ86l2Q9OXDgwLciM7RsbbQxJsGiHZuu0uYdyvm73vWuwtJIHsdwTdBopl33w6jiYcwUYCi7d+/+N8vfy7GINlKyTtLmxsJixOq4+eabi56jNO1JHkdql9p1P4wqHsbUuyTryerqagEc8YZxQ9rInsDb0Lfjxu7bt6/4GlcFRmPyOFK71K77YUw1D6Op7Nmz59/KN7ONgrY4os4cOEDCzcXiSB5HapfadT+MqedhNJXFxcV/50ZYHQuPQxSOwdFYMdsUVCgO4sHCbvRBG+sAPHRbcGV0X4x1ZKA0FeuU+hzWjO4shw9MT6a4w8PgsNJV5sByAlqdQ7GKh1Ge5o5OLDW8KwE4DA7FKLBorMYuYU00ZlWIbvvgjXgb3/Aj3zOFlqCRCliUeRi4vAQ94WEM6l8ReRVV67OKhxGZoYDShjfQmRTpm1b/Lopqrg2az9BGSpbgKDf9uuuuG8jjiPRpYx7ZUjBV5WBxPcAyJiuH5UrRZLm0PU4jrLt+q3gYZl34fG4BQ+lv5ss1z8rVsW2SvyKPAwJY5HFocjrVzXgHX2fKMRW1H4Y8DIhbNNBhPbHh7W/LWmNz24BqlPU7jIdB3GOiq1U3WvrIeXmcqxJvZN0qvyr1pmPa8Teuv/76F/A4tDA4TYh7wOdwkWRKNjXyMMiS0A/DFKgd9GPLyzgfqA5oVPEw+N7M8TCaSt+8u7zMx4/tA5uCBqcBoMQDoIVdmceBj0qu3cI2wCMOoB73ok0dr9KtnRiGPIzYqiGWuceDbpQDb255GE3l4MGD35bRGQNAbWRPvC7AwcMp8zgwOW3ljzsiYzRyOlLnVwfxMDzcAI8Y7CyDRZ1A6FzzMJrK3r17v+2N1sqok8euUluqcU16cPBASIsBSFgcNCt2BKSdzvVjMxCaSlr1tttuKzYx64g1aX9P1lccju761UqoAxpzz8NoKsvLy9+2CIePbO6YTeEBGa1uC1QoLqIDGGCBu4JLQoducvOYpcnjmG3lWdp/hcPCrNrmzZuLlpIPPvhgsc5Yd6xH157szqr1VcXD8EAziMoan/ssyaiyuLj4H0aOY6wjorbErzZAA2SnyI0FQiDUoKhDbpLHMdtqPwyeqSxhRoFeeOGFRVrVQLrVqq4/rYyq9VXFw9DaQLl+WhiHKX2L4z/KPUfLpfXmw5uChm3YIOrQyIdKWFvg0ZEpeRyzrTxje4dgYZBVwyUh6IlLYnl7uRdG3SrVKh6GMYyxTD6bNVlaWiosjsjZiIhd96FVaSxjZuIVrgouisSv5HHMtvIsORCwKoltWUuii0yTJza+4wDK/WHq6DAeBpYuryVgtCQrKytXiMTR4ohpqqagoZtjKg2Lg+Ao1gSLKnkcs61ajLok999//wsGJseshtk8N3wdS7eKh5FBzw6k/9Cu8AGVRz3WiU5XqQ8OALI9G0VutPEHKJLHMduKRUnanVoSiFuABC5JLGHXytBS8PU6rR2ShzEm6ZtuV3DTpegaGG2jH4eAoc+qD8tcFYKjyeOYbSVDtmXLliLo6YGkBaGVEQPxMb6W/TAmXPbt23eFgSgfXBuBUFHfCLYmJJwOCD3J45htBTDkYcge9iBhfcQBzdLFR7Fwk4cxZlldXf1PfU0eCA+6ax4HC4paFcEC64JRhoAIYEIgzQCp4xNYjDlVfTK0Dg8DoICDQZmBaydaGnXc22h9lF/TJTGtmkHPDZbFxcX/lPMfmXdd8ThosgKPg3GFELwcwmSGhYVpfp9Yh70XzLqMe9PMu/K8+GjWi+dz4okn9i6++OIirerJb+ct3d5obdR1c+OaNEvi9WwDkRbGmATg4EFRIds1j8NAFmk4BiU7rQ3ggDXq6cXijCMNEzQmQwlky+Ll+dg1/L777ivSqbIyPYg4bFAt16r1MagPjMFSe8Y4cTABY8yyf//+78SgVVc8Dk8cHjwWB418AAxHI+iWyOmIadgMlI5f7bgFYNCAyRiG81QjNVzAGIWLEZsEx7GjBtY52BIwJkhWVla+0zWPw+vLHIUABnMU4IiTyAAL3Bcnt7FQMyU7GWoDna1btxbT2z1gAAgzZ+WOcaOUtsfPo+Vhti/7YUyY9B/6d7rmcRhgRXmN9BwxDodI28xHlwRXBdDAjRn3hpl3xYWkUxsWhpPP4rDkGIuIFquZkjqWqNcs9/Tk6wSMCZUDBw5c2SWPA9KXtTAAB1kbyuqhnMMkdHI4AGKwDU1LY/wKYEANh7AnQSsStQbxL0ZdHzHoqXuD25NZkgmXvXv3XtkFj8PFZfkyr7FAiLpjcTitHvIXFkYWs02Wxn4Yg3gY5QHNo84aNmAqFYB1we9mDGNKZHl5+UpJNM5ViR2iDVw5Nq+NlCzAwUlGPMN6FIOhuivJ4+hOtfJwEQVrgtR03DrvvPOKlLkxKQcYaV3UCZQnD2MOZHFx8b9iS7bYVSmeDoJJU9DYuXNn0ToQV4XovMVs0dJIHkd3aj+MOJeE50CLPooPYz8MyVoxNTqKG5I8jBmWpaWl/7JXgTnzmAaLjVCaqiP2yKqQjiX4ySIGKAyOJo+jO/UeAxp8TgyDMQOUADi6wg2uhRljGlXPN3kYcyRYHLYOjP5pOVLeFDS4Lm4QC+eqq64qKOeM7GMRYzYnj6Nb1cIwrUrXcLMksVo1NquOsak6h0JcN8nDmHHp+5ZXxbkqMYUWc+pN1OlXZm+wOEjvYSKT7kseR7ca55LA9MTCiI2VDIpHl1QrwxR61aEwaM0kD2OGpe/HXmXwS9AYJQ9fpS5ErknBE9dlBCRzVWgdlzyObpWYBgDtXBI3dnRBjUeU+3PWsTSShzGncvDgwas4VWIHJa2EpqARgYeFhUnMCXT11VcXWZXkcXSrg+aSuKlle9Z5dsN+JnkYcyp79+7dHufE8jluSxug4UAm0nuP/LNXQvFxx44dyePoWO3paZWqLonpVS2E8kR3Dow6KffkYcy5rKysbDc4yoIgut41j4NhwWRVAAvbBTJXBcsDszp5HMPVURK4d1pmgK88DFLezguxl8oooxGr5pLE60gKSwtjzmTfvn3bjYhvFI8Di4Oeo8Y4AA7UXg/J41hfrSa2W5pBT9KqBJ0tY4+Dh2LcoUqr5pLo7liDlBbGnEr/wV8dp353zePg2tSqnHbaaUUGJc5VSR7HcOW+mLIGQAgeM4MXC857G2ngjguIM0aGadVcEl/ntQx6zrksLi5ebVquax7HsLkqyeMYrloY9sPAwqD4zHmq0SURMGKrhDrPaNhcEgmCaWGkFILFsRE8DifWD5qrkjyO4SqzFuLWBRdcUIwZiNPJyoBRZm3WAYxhc0kA+7QwUl4gjz322DVd8ji0YgAMAq9cO85VSR7HcOX+EPQEMGigoyviZneDRwsjuix1LMFhc0kWFhYSMFJeLKurq9d0xePgWlzbBWxvDueqJI9juELJ37ZtWwEYWgI+pxjHcKMLGHVBP+eSpBy27N2795oueBwuTCP6mr9kVWAwJo9juMrDsN0i7qSZDAE+Zku0GiRiVT2bnEuS0kiWl5evKffjiL0S4qL0hGsKKGwI+Aa4Ig6Vdk4HWRbHP/J9A6NWdfK9cW/qplqnH4bBSIOeAm8d96OKh6Fb6oGRQc+UkWX//v3Xxn4c8SQTPNQ23Beus3379jWLQ4IXm8esgZsLkLADuvGQcW/6plrVD8MgdTnuUDc7UsXDsP0fzzKJWymHLUtLS9fGdFvkcNjmvtzE+HCV2Rss5GuvvbZgjrJhPHE5fbU+LP9mozntbRZAo6ofRrkd36g8mioeBs8Y5fO0MFIaCRaHVsawKsemoMG1bBZDB7Azzjij2DieuvI3ZJGiZllmIe5R1Q+DTb9eWrUNHgYxjASMlNakb6peF31iLQ61DdCwvsWiNwYy0cgHyjmWhjRqrAviGk6tBzBmgTFa1Q9DS2EQYLTBw0ATMFJalf6pdJ2nXDSJXcRNQQOw8BTcu3dvYXVAOacfB2QvfH6AA5Aws+LE+sgenVat6ochMBhDKm/+qvtbxcNI4lZKJ4LF4dwTF21bKVn6MjgegYW9b9++4mtcFWosCI6yuTiNAQszKFbDTrtW9cMoxyNi1qROXCN5GCljk/5m3hFHPsY5KE2UzWDvBzkIAAmLG4vj5JNPLk7iWB6Omk0Z96ZvqnX6YXCfDGBGRmid1gXJw0gZq/QX2g6bybIYWeTWlsQO1zHS3xRUoJyzsTZt2rS20Yx1AB6T3o8D64heqbxn3SnAD6Yng4ya8jCq5pLoVvKcJHslYKRsqCwuLu5wMZc5AIO0KWjErArZBTdeTMFOcj8OwKLMw8DlIujZBg8j3qf15pIYwwCUkoeRMhZZWVm53hiHzV/KAbu6/RyqlOAof4dmxYN4HJPej8OmQ7xn3iNZISwnJtOZSm3Cw6gzlwQLg9cSMFLGKvv3778+8jhMx7YNGpHHAQEs8jgAjUnvx2E/DHkYELdooPNImHrWhIdRNZfk4YcfzhhGyuQIFke5tiGayW3ENBwrSGCQ611//fUv4HFMej+OyMMgS0I/DK0A40JNeBg5lyRl6qS/mW+Ii3tQm7gm6qRzrsVclTKPY9L7cVC9SwxDHobNiNzgTXkYVYzdtDBSJlJWV1dvIMhWPiHbIn9xXbt/lXkck96PYxAPw/s0qC5kVB5GOeiZc0lSpkb6VsANkUvQFmjElnb451yTDcHmwOKY9H4cpFVvu+22Avz4P3C3DCDHe3W4PIxHci5JyjTLysrKjRs9V4XiLpoVU5uCu4J1wVwVuBGAifRzviegmFVpA1jW64eBBUQ/jIceemiNUIU1ZucyXZKq/6+KhyGgmiXh/qaFkTJVsn///hs3cq4KG5IiN1oHQgAjlmElLJvXOhU/stEtRW8DNJzdwt8cNJek3L8ijosYJbu0Hg9DYEH5Oi2MlKmU5eXlGzdqropt8CBK4aoQ/IxzVbAqbOZj7UqbLgyWhhYOMRWASx6Gs20NfMb/vW6VcBUPw1qSbKCTMvWyuLh40yTMVTGjAkhIN+drm/s0BQ3rYACkzZs3F1kSeRhs5OiO6EJEV63q/6viYWBpJXErZWakb3Hc1PVcFTYhsZH15qpoYfA1VgBWiGSrNkrrh/XDsNdqdMmilVWHvFXFw0jiVsrMyaOPPnpTl3NVNNk91blunKtCXIOeFTYo5jU2ul83BQ1cIABjy5YtRVA2pj+jW1EGzbq1OcnDSJlLWV1dvamruSoChua6MQTnqkDdJnZBShY3ws5fsTdHEyVLMoyHsR44jAIaycNImUvZu3fvzV3MVfEU90TXhIfTwUbGVcESwNoAKGxKHLMpTTTyMGSvWldiSjQGggWCUUAxeRgpcyvLy8s3y+PgI6dlOaNg1WxblghZjHPPPbeoVbG47ZhjjincCmMcWB9Wysrr8HWsEqwUA6u4NXxNtS1B1+9973sFUAAazInRuuBvtzGXJHkYKXMvi4uLN1sGbqFWVM32tngcWBwwR6Gck461+xeAwObH4ohZFJv3OHjZMQpYJ/btgBp+0UUXFYBkQV0EO+MsdUCjai5JjIskDyNlbqVvcdwSe45GU1ywKH/vcJWNRjyF4Ciuil3NAY6jjz56zUXBAjHGYe2KPTsikcu5JMxWxbKw25abe9TS9jpzSZKHkZLyksLiuMUaiy7nqrgx2ZAwR2nkA3DY4VyXRWCQPYplAUA4/hGrA1o6WRJiGBLXAA6JbG7wUcGuai5J8jBSUp4XLI4IEINaBzYFDHtKyByFAHbaaacVYGEGhY+oront+exLKnFr69athYXhe+XaWBrx7xjLqNsjtWouSfIwUlJKsmvXrls172Nsw4bFTUFDghWb2/J9GJukY6WSk1nB9XDQNLELe3LIw8AloR9GrPnQhfD9GscYZUB21VySBIyUlAGysrJyq/0s3WhyEpqChtyN2CkL8MDioAMYFoST6rEycF0iaOiSADSe/GY7BA/fbwQS/3Yd0Mi5JCkphyELCwu3usnsnTlKN+5hlobXkXbNyU6sgOwHrgrpU6yN2D4QAME9sZaE9LDT4LgewFMuxitbS3Xcq5xLkpLSQPob5TY5CQYZnWoeN3ybPA56jp555plFpWp0V7BAIG59//vfL/42FPU4DY6PvFYHFGImpdwPQyslplUz6JmSMoLs37//tkjFXm8zRjehiQIItA4EOCCA4ZbEfhixgY5BT+MX0T2pUrNCg+aScD0UQEwLIyXlMGRpaakADvuCxhRk7NrdRk8O5qpwbdKxNCv+8Ic/XPTDoPgMd2TQXJIYe6nSOnNJtKwSMFJSGkjf4rjdTVruIdHmXBWuuWfPnuJ6uCqXX355QQTj2jQxdqZqdCEic7Xq+lX9MGgdkICRktKSrK6u3m5thhu0bOa34Z5oTXDN2DTIgGes/Shv/DqgFD/PuSQpKR3Lrl27bjd2ENOant5NQUM6u+BRLhAb5F60OZckASMlpQM5cODAHbFWJY6AbAM0+ChIxLqX6IJE/sUoFk456Jn9MFJSNkj27Nlzh/GENkGDKlgtAVsH2kAn1saUq1jrBmJNE2c/jJSUMcjy8vIdsfcmPA4rS8vxBlOZTUGlTkxkWD8MrRX5GRn0TEnZYFlcXLwj8jhiv9GytjUmYZhW9cMwXpLl7SkpY5T+SX2nvSZ0G2LAchQeRRsxkap+GCifp4WRkjJG2b9//53GNco0bUGjjdqVOlrVDyMBIyVlQqRv6t9J4LLc+KYu8aotwBjWDwNNwEhJmSDpuwd3xV6ckUC1ES5KVT+M5GGkpEyg9C2Ou2ywE0GjjX4cdUAj+2GkpEyhLCws3KVb4onfRuevKs1+GCkpUywrKyvfZfOykXEZ+kDSeK6K8ZJyrQlf27A4/ixfp0uSkjJFsrS09F1jHG3MVSk3yrGU3XhJrLrNfhgpKVMqAIfdwstZlVHnqghA5ZkmMXsi+CRgpKRMsfRdhLu1NJrMVSlnYrgObonZEl5PCyMlZUZkdXX17rbmqhjsjMQtYx0JGCkpMyS7du26u+lcFdvzyUCNJfQJGCkpMygrKyv3HO5clVjabns+wAYXJbMkKSkzLHv27LnncOaqRNDAyrDfRlarpqTMgSwuLt4j6YuNT/cs4xIGScvFbzEDY/ZkYWEhASMlZV6kDxz32gdUlyOmY8tNjM22PPL87JO0MFJS5lCWlpbutf3eoEyKvTBMqdopLAEjJWWOZd++ffdqTWhtWHgmZRxgMcOSQc+UlBSqY+81jQpwWJeiqyKvIwEjJSVlTRYWFu6zyE3CFtYFXxPDSB5GSkrKi6QPDPfFGhMyJgDGoUOHEjBSUlIGCxaHM1uz+CwlJaWWrKys3J8uSUpKykjy5JNPJmCkDJT/D09TM/QYhIelAAAAAElFTkSuQmCC");
  background-size: 30px 30px;
  /* background-color: #f8f8ff; */
}

.panoTip {
  white-space: pre-line;
}

/* .pnlm-panorama-info {
  bottom: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0) !important;
  text-transform: capitalize;
}
*/
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
