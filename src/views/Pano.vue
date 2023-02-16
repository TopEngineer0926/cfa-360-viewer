<template>
  <div v-if="isGuest || canReadContent" class="bg">
    <div v-if="pano" class="vue-pannellum">
      <div class="default-slot">
        <v-expansion-panels
          v-if="panoSource"
          v-model="btnPanel"
          tile
          class="condensed"
        >
          <v-expansion-panel
            :style="{ 'background-color': 'rgba(255,255,255,0.3)' }"
          >
            <v-expansion-panel-header>
              <v-btn
                v-if="isEditable && (user.masterSiteAdmin || canCreateScene)"
                @click.stop="initEditPlan(null)"
                class="ma-1"
                small
                text
              >
                Add Plan
              </v-btn>
              <v-btn
                v-if="isEditable && (user.masterSiteAdmin || canCreateScene)"
                @click.stop="initEditScene(null)"
                class="ma-1"
                small
                text
              >
                Add Scene
              </v-btn>
              <v-btn
                v-if="isEditable && canCreateTag && isShow == false"
                small
                text
                @click.stop="addLayer()"
                class="ma-1"
              >
                add layer
              </v-btn>

              <v-btn
                v-if="isEditable && canCreateTag"
                small
                text
                @click.stop="addTagConfig"
                class="ma-1"
              >
                Add Tag
              </v-btn>
              <v-btn
                v-if="isEditable || canCreateTag || canCreateScene"
                small
                @click.stop="isEditable = !isEditable"
                text
                class="ma-1"
              >
                {{
                  isEditable ? "Change to User View" : "Change to Admin View"
                }}
              </v-btn>

              <v-btn small text class="ma-1">
                <v-icon v-if="btnPanel == 0" class="ml-1">
                  mdi-arrow-expand-down</v-icon
                >
                <v-icon v-else class="ml-1"> mdi-arrow-expand-up</v-icon>
              </v-btn>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row class="ma-0 pa-0">
                <v-col cols="2" class="ma-0 pa-0">
                  <v-row style="width:100%">
                    <v-col cols="12" class="main-plan">
                      <v-img
                        v-bind:src="planView.img"
                        class="rounded-10 plan-view"
                        height="135"
                        @click="loadPlan()"
                      ></v-img>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="10" class="ma-0 pa-0">
                  <v-row justify="center" align="center" class="ma-0 pa-0">
                    <v-col cols="12" class="ma-0 pa-0">
                      <div v-if="isEditable">
                          <v-sheet
                            class="mx-auto bg-transparent"
                            elevation="8"
                            max-width="100%"
                            style="box-shadow:none !important"
                          >
                            <v-slide-group
                              v-model="panoSource.sceneArr"
                              show-arrows
                              center-active
                            >
                              <draggable :list="panoSource.sceneArr" class="flex" @change="changePosition($event)">
                                <v-card
                                  v-for="(scene, sceneIndex) in panoSource.sceneArr"
                                  :key="sceneIndex"
                                  active-class="primary"
                                  class="plan-thumbnail"
                                  v-if="sceneIndex > 0"
                                >
                                  <v-img :src="scene.thumbnail" alt="" class="rounded-10" width="100" height="100" @click.stop="changeSceneIndex(sceneIndex);loadScene(scene.id);"></v-img>
                                  <v-btn class="btn-edit" @click.stop="changeSceneIndex(sceneIndex);initEditScene(scene.id)">Edit</v-btn>
                                </v-card>
                              </draggable>
                            </v-slide-group>
                          </v-sheet>
                      </div >
                      <div v-else>
                        <v-sheet
                            class="mx-auto bg-transparent"
                            elevation="2"
                            style="box-shadow:none !important"
                          >
                            <v-slide-group
                              v-model="currentSceneIndex"
                              show-arrows
                              style="margin-top:12px"
                            >
                            <div
                              v-for="(scene, sceneIndex) in panoSource.sceneArr"
                              :key="sceneIndex"
                              active-class="primary"
                              class="plan-thumbnail"
                              v-if="sceneIndex > 0"
                            >
                            <v-img :src="scene.thumbnail" alt="" class="rounded-10" width="100" height="100" @click.stop="loadScene(scene.id);"></v-img>
                            </div>
                          </v-slide-group>
                        </v-sheet>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
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
        <v-card-title v-if="isEditable" class="headline">Edit Tag</v-card-title>
        <v-card-title v-else class="headline">
          {{ editSpotData.spot.text }}</v-card-title
        >
        <v-card-text>
          <v-form
            v-if="isEditable"
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
              :readonly="!isEditable"
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
                    :readonly="!isEditable"
                    label="Content Name"
                  ></v-text-field>
                  <v-btn
                    v-if="isEditable"
                    icon
                    @click="deleteContent(content)"
                    class="ml-4"
                    ><v-icon>mdi-delete-outline </v-icon>
                  </v-btn>
                </v-row>
              </div>
            </div>
            <div v-if="isEditable">
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
            <div v-else-if="canTagComment">
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
              <div>
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
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="isEditable"
            color="primary"
            text
            @click="saveSpot"
            :disabled="!editSpotData.editValid"
          >
            Save
          </v-btn>
          <v-btn v-if="isEditable" color="grey" text @click="cancelSpot">
            Cancel
          </v-btn>
          <v-btn v-else color="grey" text @click="cancelSpot"> OK </v-btn>
          <v-btn v-if="isEditable" color="grey" text @click="deleteSpot">
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
  sharingByLinkname,
  sharingByPano,
  getProjectPermission,
} from "../graphql/queries";
import {
  updatePano,
  createComment,
  createEditStatus,
} from "../graphql/mutations";
import { nanoid } from "nanoid";
import draggable from "vuedraggable";
export default {
  name: "Pano",
  components: {
    ContentDisplay: () => import("../components/ContentDisplay"),
    draggable,
  },
  data: function () {
    return {
      isProjectAdmin: null,
      isProjectEditor: null,
      isProjectViewer: null,
      isShow : true,
      canCreateScene: null,
      canCreateTag: null,
      canTagComment: null,
      canReadContent: null,
      isGuest: null,
      isEditable: false,
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
      planView:{
        id: null,
        img: null
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
      sharing: {
        dialog: false,
        panoID: null,
        new: null,
        list: null,
        password: null,
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
      checkStatusInterval : null,
      btnPanel: [],
      index_Time : null,
      isPlanView : false,
      customID : null,
      custonUsername : null,
      plan_thumbnail: null,
    };
  },

  created() {
    if (this.$route.path.includes("sharing") == true) {
      //Guest User
    
        API.graphql(
          graphqlOperation(sharingByLinkname, {linkname: this.$route.params.linkname,})
        ).then((data) => {
          let sharingData = data.data.sharingByLinkname.items;
          this.customID = sharingData[0].panoID;
          this.custonUsername = this.$route.params.linkname;
          if (
            sharingData.length > 0 &&
            sharingData[0].linkname == this.$route.params.linkname && sharingData[0].ttl > new Date().getTime()
          ) {
            this.index_Time = sharingData[0].ttl;
            this.updateCheckEditStatusInterval();
            this.isGuest = true;
            this.initData();
          } else {
            this.$root.$dialogLoader.showSnackbar("Not authorized");
            this.$router.push({ path: "/" });
            this.$store.dispatch("logout");
          }
        });
    } else {
      //login user
      this.customID = this.$route.params.id;
      API.graphql(
        graphqlOperation(getProjectPermission, { id: this.$route.params.id })
      ).then((res) => {
        let projectPermission = res.data.getProjectPermission;

        if (projectPermission) {
          this.isProjectAdmin = projectPermission.admins.includes(
            this.user.username
          );
          this.isProjectEditor = projectPermission.editors.includes(
            this.user.username
          );
          this.isProjectViewer = projectPermission.viewers.includes(
            this.user.username
          );
        } else {
          this.isProjectAdmin = false;
          this.isProjectEditor = false;
          this.isProjectViewer = false;
        }

        this.canCreateScene =
          this.user.masterSiteAdmin ||
          (this.user.siteAdmin &&
            this.roleDefinitionTable.find((role) => role.name == "Site Admin")
              .createScene) ||
          (this.isProjectAdmin &&
            this.roleDefinitionTable.find(
              (role) => role.name == "Project Admin"
            ).createScene) ||
          (this.isProjectEditor &&
            this.roleDefinitionTable.find(
              (role) => role.name == "Project Editor"
            ).createScene) ||
          (this.isProjectViewer &&
            this.roleDefinitionTable.find(
              (role) => role.name == "Project Viewer"
            ).createScene)
            ? true
            : false;

        this.canCreateTag =
          this.user.masterSiteAdmin ||
          (this.user.siteAdmin &&
            this.roleDefinitionTable.find((role) => role.name == "Site Admin")
              .createTag) ||
          (this.isProjectAdmin &&
            this.roleDefinitionTable.find(
              (role) => role.name == "Project Admin"
            ).createTag) ||
          (this.isProjectEditor &&
            this.roleDefinitionTable.find(
              (role) => role.name == "Project Editor"
            ).createTag) ||
          (this.isProjectViewer &&
            this.roleDefinitionTable.find(
              (role) => role.name == "Project Viewer"
            ).createTag)
            ? true
            : false;

        this.canTagComment =
          this.user.masterSiteAdmin ||
          (this.user.siteAdmin &&
            this.roleDefinitionTable.find((role) => role.name == "Site Admin")
              .tagComment) ||
          (this.isProjectAdmin &&
            this.roleDefinitionTable.find(
              (role) => role.name == "Project Admin"
            ).tagComment) ||
          (this.isProjectEditor &&
            this.roleDefinitionTable.find(
              (role) => role.name == "Project Editor"
            ).tagComment) ||
          (this.isProjectViewer &&
            this.roleDefinitionTable.find(
              (role) => role.name == "Project Viewer"
            ).tagComment)
            ? true
            : false;

        this.canReadContent =
          this.user.masterSiteAdmin ||
          (this.user.siteAdmin &&
            this.roleDefinitionTable.find((role) => role.name == "Site Admin")
              .readContent) ||
          (this.isProjectAdmin &&
            this.roleDefinitionTable.find(
              (role) => role.name == "Project Admin"
            ).readContent) ||
          (this.isProjectEditor &&
            this.roleDefinitionTable.find(
              (role) => role.name == "Project Editor"
            ).readContent) ||
          (this.isProjectViewer &&
            this.roleDefinitionTable.find(
              (role) => role.name == "Project Viewer"
            ).readContent)
            ? true
            : false;

        this.initData();
      });
    }
  },

  beforeDestroy() {
    clearInterval(this.editStatusInterval);
    clearInterval(this.checkStatusInterval);
  },
  methods: {
    async initData() {

      if (this.canCreateScene || this.canCreateTag) {
        let items = (
          await API.graphql(
            graphqlOperation(editStatusByPano, {
              panoID: this.$route.params.id,
              sortDirection: "DESC",
            })
          )
        ).data.editStatusByPano.items;
        if (
          items &&
          items.length > 0 &&
          items[0].email !== this.user.email &&
          new Date() - new Date(items[0].createdAt) < 5 * 60 * 1000
        ) {
          this.isProjectAdmin = false;

          this.$root.$dialogLoader.showSnackbar(items[0].name + " is editing.");
        } else {
          this.isEditable = true;
          this.updateEditStatus();
          this.updateEditStatusInterval();
        }
      }

      if (this.isGuest || this.canReadContent) {
        API.graphql(
          graphqlOperation(getPano, { id: this.customID })
        ).then((data) => {
          this.panoSource = data.data.getPano;
          this.$store.commit("SET_NAVBAR_TEXT", {
            prototypeName: this.panoSource.prototypeName,
            category: this.panoSource.category,
            prototypeEdition: this.panoSource.prototypeEdition,
            description: this.panoSource.description,
          });

          if (!this.panoSource.layers) {
            this.panoSource.layers = [];
          }
          if (this.panoSource) {
            this.initPano();
          } else {
            this.$router.push({ path: "/panolist" });
          }
        });
      }                       
    },
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
            ttl: Math.round(Date.now() / 1000) + 7 * 24 * 60 * 60,
          },
        })
      );
    },

    updateCheckEditStatusInterval() {
      this.checkStatusInterval = setInterval(async () => {
        API.graphql(
          graphqlOperation(sharingByLinkname, {linkname: this.custonUsername,})
        ).then((data) => {
          let sharingData = data.data.sharingByLinkname.items;
          this.index_Time = sharingData[0].ttl;
        });
        if(this.index_Time < new Date().getTime()){
            this.$root.$dialogLoader.showSnackbar("Time out");
            this.$router.push({ path: "/" });
            this.$store.dispatch("logout");
        }
      }, 1* 5 * 1000 - 60);
    },
    async initPano() {
      if (this.panoSource.sceneArr && this.panoSource.sceneArr.length > 0) {
        this.pano = {
          title: this.panoSource.prototypeName,
          scenes: {},
        };
        await Promise.all(
          this.panoSource.sceneArr.map(async (scene, key) => {
            this.pano.scenes[scene.id] = {};
            this.pano.scenes[scene.id].title = scene.title;
            let thumb = await Storage.get(
              this.panoSource.id + "/" + scene.img,
              { expires: 432000 }
            );

            this.pano.scenes[scene.id].panorama = thumb;
            scene.thumbnail = thumb;

            if(key == 0){
              this.planView.id = scene.id;
              this.planView.img = thumb;
            }
          })
        );

        this.currentSceneIndex = 0;
        this.pano.default = {
          firstScene: this.panoSource.sceneArr[0].id,
          autoLoad: true,
          draggable : true,
          pitch: 0,
          "min-pitch": -180,
          "max-pitch": 180,
          "min-yaw": -180,
          "max-yaw": 180,
          yaw: 20,
        };

        this.viewer = window.pannellum.viewer(this.$el, this.pano);
        this.selectedLayersIndex = Array.from(
          Array(this.panoSource.layers.length).keys()
        );
        //this.loadLayers();
      }
    },

    loadScene(sceneID) {
      this.viewer = window.pannellum.viewer(this.$el, this.pano);
      this.viewer.loadScene(sceneID);
      let checkLoad = (viewer) => {
        if (viewer.isLoaded()) {
          // this.loadLayers();
        } else {
          setTimeout(checkLoad, 500, viewer); // setTimeout(func, timeMS, params...)
        }
      };
      checkLoad(this.viewer);
    },
    changeSceneIndex(index){
      this.currentSceneIndex = index;
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
        this.editSceneData.title =
          this.panoSource.sceneArr[this.editSceneData.sceneIndex].title;
      }
      this.editSceneData.imgToUpload = null;
      this.editSceneData.dialog = true;
    },
    deletePlan() {

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

            let url = await Storage.get(s3link);
            this.panoSource.sceneArr[sceneIndex].thumbnail = url;
            //edit scene panorama
            this.pano.scenes[sceneID].panorama = url;
            if (this.currentSceneIndex == sceneIndex) {
              this.loadScene(sceneID);
            }
          }
        } else {
          let panorama_url = await Storage.get(s3link);
          if (!this.pano) {
            // first scene
            this.pano = {
              default: { firstScene: sceneID, autoLoad: true },
              scenes: {
                [sceneID]: {
                  title: this.editSceneData.title,
                  panorama: panorama_url,
                },
              },
            };
            this.viewer = window.pannellum.viewer(this.$el, this.pano);
          } else {
            //add scene
            this.viewer.addScene(sceneID, {
              title: this.editSceneData.title,
              panorama: panorama_url,
            });
          }
          //add sceneArr
          if (!this.panoSource.sceneArr) {
            this.panoSource.sceneArr = [];
          }
          this.panoSource.sceneArr.push({
            thumbnail: panorama_url,
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
        let thisContents =
          this.panoSource.sceneArr[this.currentSceneIndex].spots[spotIndex]
            .contents;
        if (thisContents && thisContents.length > 0) {
          thisContents.forEach((content) => {
            if (content.link && !content.s3Upload) {
              Storage.remove(this.panoSource.id + "/" + content.link);
            }
          });
        }
        this.panoSource.sceneArr[this.currentSceneIndex].spots =
          this.panoSource.sceneArr[this.currentSceneIndex].spots.filter(
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
                      this.panoSource.id +
                        "/" +
                        nanoid() +
                        "." +
                        content.link.name.split(".").pop(),
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
          this.editSpotData.spot.contents =
            this.editSpotData.spot.contents.filter(
              (content) => !content.delete
            );
        }

        if (this.editSpotData.spot.id) {
          //edit existing
          this.viewer.removeHotSpot(this.editSpotData.spot.id);
          let spotIndex = this.panoSource.sceneArr[
            this.currentSceneIndex
          ].spots.findIndex((spot) => spot.id == this.editSpotData.spot.id);
          this.panoSource.sceneArr[this.currentSceneIndex].spots[spotIndex] =
            this.editSpotData.spot;
        } else {
          //create new
          this.editSpotData.spot.id = nanoid();
          this.panoSource.sceneArr[this.currentSceneIndex].spots.push(
            this.editSpotData.spot
          );
        }

        // this.loadLayers();
        this.editSpotData.dialog = false;
        this.savePano();
      }
    },

    savePano() {
      let saveTopano = JSON.parse(JSON.stringify(this.panoSource));
      saveTopano.sceneArr.map((scene, key) => {
        if(key == 0){
          this.planView.id = scene.id;
          this.planView.img = scene.thumbnail;
        }
        delete scene.thumbnail;
      })

      API.graphql({
        query: updatePano,
        variables: {
          input: saveTopano,
        },
      });
      // this.$router.go();
    },
    showSpot(spot) {
      let addSpot = JSON.parse(JSON.stringify(spot));
      if (this.isEditable) {
        addSpot.type = "info";
        addSpot.clickHandlerFunc = () => {
          this.editSpotData.spot = JSON.parse(JSON.stringify(spot));
          this.editSpotData.dialog = true;
        };
      } else {
        switch (addSpot.style) {
          case "detail":
            addSpot.type = "info";
            if (this.canReadContent) {
              addSpot.clickHandlerFunc = () => {
                this.editSpotData.spot = spot;
                this.editSpotData.dialog = true;
                if (this.canTagComment) {
                  this.getComments();
                }
              };
            }
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
    loadPlan() {
      this.isPlanView = true;
      this.viewer = pannellum.viewer(this.$el, {
        "type": "equirectangular",
        "draggable" : false,
        "panorama": this.planView.img,
        "pitch": 0,
        "min-pitch": 0,
        "max-pitch": 0,
        "min-yaw": 0,
        "max-yaw": 0,
        "yaw": 0,
        "hfov": 200,
    });
      // this.viewer = this.planView.img;
    },
    changePosition(e){
      if(e.moved){
        this.savePano();
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

        this.$refs.newContentForm.reset();
        this.editSpotData.newContent.type = "img";
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
    dragFinish(item) {
      let currentSceneID = this.viewer.getScene();
      this.panoSource.sceneArr.map((scene, index) => {
        if (currentSceneID === scene.id) {
          this.currentSceneIndex = index;
        }
      });

      API.graphql({
        query: updatePano,
        variables: {
          input: this.panoSource,
        },
      });
    },
  },
  computed: {
    ...mapState(["user", "roleDefinitionTable"]),
    ...mapState(["userAuth","navbarText"]),
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

    isEditable: function () {
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
.drop-zone {
  background-color: #eee;
  margin-right: 5px;
  padding: 10px;
}
.drag-el {
  background-color: #fff;
  margin-right: 10px;
  padding: 5px;
}

.square-hotspot {
  width: 20px;
  height: 20px;
  background-image: url("~@/assets/hotspot/square.jpg");
  background-size: 20px 20px;
  /* background-color: #f8f8ff; */
}

.triangle-hotspot {
  width: 20px;
  height: 20px;
  background-image: url("~@/assets/hotspot/triangle.png");
  background-size: 20px 20px;
  /* background-color: #f8f8ff; */
}

.cross-hotspot {
  width: 20px;
  height: 20px;
  background-image: url("~@/assets/hotspot/cross.png");
  background-size: 20px 20px;
  /* background-color: #f8f8ff; */
}

.circle-hotspot {
  width: 20px;
  height: 20px;
  background-image: url("~@/assets/hotspot/circle.png");
  background-size: 20px 20px;
  /* background-color: #f8f8ff; */
}

.diamond-hotspot {
  width: 20px;
  height: 20px;
  background-image: url("~@/assets/hotspot/diamond.png");
  background-size: 20px 20px;
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
.rounded-10{
  border-radius: 5px;
  border: 2px solid white;
}
.bg-transparent{
  background:transparent !important;
  border-radius: 10px;
}
.plan-thumbnail{
  padding: 5px;
  border: 2px solid white;
  border-radius: 10px;
  margin: 5px;
  background:transparent !important;
}
.plan-view{
  height: 120px;
  border: 2px solid #ffffff;
  border-radius: 10px;
  margin: 3px;
  cursor: grab;
}
.btn-edit{
  height: 20px !important;
  width: 68px;
  margin-top: 6px;
  background-color: white!important;
  border: 2px solid white;
}
.btn-plan-edit{
  height: 25px !important;
  width: calc(100% - 38px);
  margin: 3px;
  border-radius: 8px;
  background-color: white !important;
}
.main-plan{
  border: 2px solid white;
  border-radius: 10px;
  padding: 0px;
  margin-top: 17px;
  height: 100%;
}
.flex{
  display: flex;
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

.v-expansion-panels.condensed .v-expansion-panel-header {
  padding-top: 0px;
  padding-bottom: 0px;
  min-height: auto;
}
</style>