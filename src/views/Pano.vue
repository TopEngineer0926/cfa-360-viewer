<template>
  <div v-if="isGuest || canReadContent" class="bg">
    
    <div v-if="planView.img" class="vue-pannellum">
      
      <div class="img"></div>
      <div class="button"></div>

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
            <v-expansion-panel-header hide-actions>
              <div class="row my-1">
                <div class="cols-2">
                  <v-btn
                    v-if="isEditable && (user.masterSiteAdmin || canCreateScene)"
                    @click.stop="initEditScene(planView.id)"
                    class="ma-1"
                    small
                    text
                  >
                    Edit Plan
                  </v-btn>
                </div>
                <div class="cols-2">
                  <v-btn
                    v-if="isEditable && (user.masterSiteAdmin || canCreateScene)"
                    @click.stop="initEditScene(null)"
                    class="ma-1"
                    small
                    text
                  >
                    Add Scene
                  </v-btn>
                </div>
                <div class="cols-2">
                  <v-btn
                    v-if="isEditable && canCreateTag"
                    small
                    text
                    @click.stop="addLayer()"
                    class="ma-1"
                  >
                    add layer
                  </v-btn>
                </div>
                <div class="cols-2">
                   <v-btn
                    v-if="isEditable && canCreateTag && currentSceneIndex == 0"
                    small
                    text
                    @click.stop="addPinConfig"
                    class="ma-1"
                  >
                    Add Pin
                  </v-btn>
                </div>
               
                <div class="cols-3">
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
                </div>
                <div class="cols-1">
                  <v-btn small text class="ma-1" @click="resizeExpand()">
                    <v-icon v-if="btnPanel == 0" class="ml-1">
                      mdi-arrow-expand-down</v-icon
                    >
                    <v-icon v-else class="ml-1"> mdi-arrow-expand-up</v-icon>
                  </v-btn> 
                </div>
              </div>
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
                        @click="changeSceneIndex(0); loadScene(planView.id);"
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
                                  @mouseover="mouseOver(scene)"
                                >
                                
                                  <v-img :src="scene.thumbnail" alt="" 
                                    class="rounded-10" width="100" height="100"
                                    @click.stop="changeSceneIndex(sceneIndex);loadScene(scene.id);"
                                  ></v-img>
                                  <v-btn 
                                    class="btn-edit" 
                                    @click.stop="changeSceneIndex(sceneIndex);initEditScene(scene.id)">Edit
                                  </v-btn>
                                </v-card>
                              </draggable>
                              </v-slide-group>
                            </v-sheet>                          
                        </div >
                        <div v-else>
                          <v-sheet
                              class="mx-auto bg-transparent"
                              elevation="2"
                              max-width="100%"
                              style="box-shadow:none !important"
                            >
                              <v-slide-group
                                v-model="currentSceneIndex"
                                show-arrows
                                style="margin-top:12px"
                              >
                              <v-card
                                v-for="(scene, sceneIndex) in panoSource.sceneArr"
                                :key="sceneIndex"
                                active-class="primary"  
                                class="plan-thumbnail"
                                v-if="sceneIndex > 0"
                                @mouseover="mouseOver(scene)"
                              >
                                
                                <v-img :src="scene.thumbnail" alt="" 
                                  class="rounded-10" width="100" height="100"
                                  @click.stop="changeSceneIndex(sceneIndex); loadScene(scene.id);"
                                ></v-img>
                              </v-card>
                            </v-slide-group>
                          </v-sheet>
                        </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <div style="text-align: center;">{{panotitle}}</div>
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
        <v-card-title class="headline">Edit</v-card-title>
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
    <v-dialog
      v-if="editPinSpotData.dialog"
      v-model="editPinSpotData.dialog"
      persistent
      max-width="600"
    >
      <v-card>
        <v-card-title v-if="isEditable" class="headline">Edit Pin</v-card-title>
        <v-card-text>
          <v-form
            v-if="isEditable"
            ref="editpinspotform"
            v-model="editPinSpotData.editValid"
            lazy-validation
          >
            <v-text-field
              v-model="editPinSpotData.spot.text"
              require
              :rules="[(v) => !!v || 'Pin Name is required']"
              label="Pin Name"
            ></v-text-field>
            <v-select
              v-model="editPinSpotData.spot.sceneID"
              :items="allScenes4Pin"
              label="Target Scene"
            ></v-select>
          </v-form>
          <div>
            <v-textarea
              v-model="editPinSpotData.spot.about"
              label="Description"
              auto-grow
              :rows="1"
              :readonly="!isEditable"
            ></v-textarea>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="isEditable"
            color="primary"
            text
            @click="savePinSpot"
            :disabled="!editPinSpotData.editValid"
          >
            Save
          </v-btn>
          <v-btn v-if="isEditable" color="grey" text @click="cancelPinSpot">
            Cancel
          </v-btn>
          <v-btn v-else color="grey" text @click="cancelPinSpot"> OK </v-btn>
          <v-btn v-if="isEditable" color="grey" text @click="deletePinSpot">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script defer>
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
      allScenes4Pin: [],
      panotitle : null,
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
      editPinSpotData: {
        dialog: false,
        editValid: false,
        spot: null
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
      isAddpin : false,
      customID : null,
      custonUsername : null,
      oldExpandHeight: 0
    };
  },
  created() {
    if (this.user.email == "360TempSharing@360TempSharing.com") {
      //Guest User
      if (this.$route.params.linkname) {
        API.graphql(
          graphqlOperation(sharingByLinkname, {linkname: this.$route.params.linkname})
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
        //Unauth
        this.$root.$dialogLoader.showSnackbar("Not authorized");
      }
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
    mouseOver(scene){
      this.panotitle = scene.title;
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
              this.pano.scenes[scene.id].pitch = 0;
              this.pano.scenes[scene.id].yaw = 0;
              this.pano.scenes[scene.id].minPitch = 0;
              this.pano.scenes[scene.id].maxPitch = 0;
              this.pano.scenes[scene.id].minYaw = 0;
              this.pano.scenes[scene.id].maxYaw = 0;
              this.pano.scenes[scene.id].hfov = 1;
              this.pano.scenes[scene.id].haov = 25;
              this.pano.scenes[scene.id].vaov = 25;
              this.pano.scenes[scene.id].showZoomCtrl = true;
              this.pano.scenes[scene.id].sceneFadeDuration = 1000;
              this.planView.id = scene.id;
              this.planView.img = thumb;
              
              this.loadHotSpots();
            }else{
              this.pano.scenes[scene.id].hfov = 0;
              this.pano.scenes[scene.id].sceneFadeDuration = 1000;
              this.pano.scenes[scene.id].pitch = 0;
              this.pano.scenes[scene.id].yaw = 0;
              
            }
          })
        );
        
        this.currentSceneIndex = 0;
        // this.pano.default = {
        //   firstScene: this.panoSource.sceneArr[0].id,
        //   autoLoad: true
        // };

        this.showPlanView();
        window.addEventListener('resize', ()=>this.resizeWindow());
      }
    },

    showPlanView(){
      if(this.currentSceneIndex == 0){
        this.viewer = null;
        let div_class = document.getElementsByClassName("img")[0];
        let div_expand = document.getElementsByClassName("default-slot")[0];
        let div_bg = document.getElementsByClassName("bg")[0];
        while (div_class.firstChild) {
          div_class.removeChild(div_class.lastChild);
        }
        var oImg = document.createElement("img");

        oImg.setAttribute('src', this.planView.img);
        oImg.setAttribute('alt', 'na');
        oImg.setAttribute('height', 'auto');

        oImg.setAttribute('width', div_bg.getBoundingClientRect().width);
        oImg.setAttribute('height', div_bg.getBoundingClientRect().height - div_expand.getBoundingClientRect().height);

        oImg.addEventListener('mousedown', (event)=>this.mousePinDownHandler(event));

        div_class.style.top = 0;
        div_class.style.left = 0;

        div_class.appendChild(oImg);
        this.drawButton();
      }
    },
    getScenetitlebyID(sceneID){
      let scene = this.panoSource.sceneArr;
      var title;
      scene.map((spot,index) => {
        if(spot.id == sceneID){
          title =  spot.title;
        }
      });
      return title;
    },
    resizeWindow(){
      if(this.currentSceneIndex != 0){
        return;
      } else {
        this.showPlanView();
      }
    },
    resizeExpand(){
      if(this.currentSceneIndex == 0){
        let div_class = document.getElementsByClassName("img")[0];
        let div_expand = document.getElementsByClassName("default-slot")[0]; 
        let div_bg = document.getElementsByClassName("bg")[0];
        let oImg = div_class.firstChild;
        let vm = this;
        const resize_ob = new ResizeObserver(function (entries) {
          oImg.setAttribute('width', div_bg.getBoundingClientRect().width);
          oImg.setAttribute('height', div_bg.getBoundingClientRect().height - div_expand.getBoundingClientRect().height);
          vm.drawButton();
        });
        resize_ob.observe(div_expand);
      } else {
        return;
      }
    },
    drawButton(){
      if(this.currentSceneIndex == 0){
        let div_class = document.getElementsByClassName("button")[0];
        let div_bg = document.getElementsByClassName("img")[0];
        let div_img = div_bg.firstChild;
        while (div_class.firstChild) {
          div_class.removeChild(div_class.lastChild);
        }
        let scene = this.panoSource.sceneArr[0];
        scene.spots.map((spot,index) => {
          let pin = document.createElement('div');
          let button = document.createElement('BUTTON');
          button.classList.add('ring-button')
          button.style.position = 'fixed';
          button.style.left = spot.pitch * div_img.getBoundingClientRect().width + 'px';
          button.style.top = spot.yaw * div_img.getBoundingClientRect().height + 'px';
          button.style.width = 20 + 'px';
          button.style.height = 20 + 'px';
          button.type = "button";
          button.addEventListener('click', ()=>{this.changeSceneIndex(index); this.loadScene(spot.sceneID);});
          button.setAttribute("value","generated button");

          let label = document.createElement('label');
          label.style.position = 'fixed';
          label.style.top = spot.yaw * div_img.getBoundingClientRect().height + 25 + 'px';
          label.style.left = spot.pitch * div_img.getBoundingClientRect().width + 10 + 'px';
          label.innerHTML = this.getScenetitlebyID(spot.sceneID);
          label.style.textAlign = "center";
          label.style.color = "#000000";

          pin.appendChild(button);
          pin.appendChild(label);

          div_class.appendChild(pin);
        });
      }
    },
    
    removeChild(){
      let div_class = document.getElementsByClassName("img")[0];
      while (div_class.firstChild) {
        div_class.removeChild(div_class.lastChild);
      }
      let div_class1 = document.getElementsByClassName("button")[0];
      while (div_class1.firstChild) {
        div_class1.removeChild(div_class1.lastChild);
      }
    },
    loadHotSpots(){
      let scene = this.panoSource.sceneArr[0];
      this.pano.scenes[scene.id].hotSpots = [];
      scene.spots.map((spot,index) => {
        let obj = {};
        obj.pitch = spot.pitch * window.screen.width;
        obj.yaw = spot.yaw * window.screen.height;
        obj.type = 'info';
        obj.text = spot.text;
        obj.createTooltipFunc = this.customTooltiphotspot;
        obj.createTooltipArgs = {index: index, sid: spot.sceneID};
        this.pano.scenes[scene.id].hotSpots.push(obj);
      });
    },
    loadScene(sceneID) {
      let div_slot = document.getElementsByClassName("default-slot")[0];

      let div,div1;
      div = document.getElementsByClassName("pnlm-ui pnlm-grab")[0];
      div1 = document.getElementsByClassName("pnlm-render-container")[0];
      if(div != null || div1 != null){
        div.remove();
        div1.remove();
      }

      if(this.currentSceneIndex == 0){
        console.log("1")
        div_slot.style.zIndex = 0;
        div_slot.style.position = "fixed";
        this.showPlanView();
      } else {
        console.log("2")
        this.viewer = window.pannellum.viewer(this.$el, this.pano);
        this.removeChild();
        div_slot.style.zIndex = 2;
        div_slot.style.position = "absolute";
        this.viewer.loadScene(sceneID);
      }
    },
    changeSceneIndex(index){
      this.currentSceneIndex = index;
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
    customTooltiphotspot(hotSpotDiv, args){
      if(!this.isEditable)
        return;
      hotSpotDiv.setAttribute('z-index', 2);
      hotSpotDiv.classList.add('custom-tooltip');
      var span = document.createElement('span');
      var pencil = document.createElement('i');
      var link = document.createElement('i');

      pencil.classList.add('fa');
      pencil.classList.add('fa-pencil');
      link.classList.add('fa');
      link.classList.add('fa-mail-forward');
      link.classList.add('link');
       
      span.appendChild(pencil);
      span.appendChild(link);
      hotSpotDiv.appendChild(span);
      
      span.style.width = span.scrollWidth - 20 + 'px';
      span.style.marginLeft = -(span.scrollWidth - hotSpotDiv.offsetWidth) / 2 + 'px';
      span.style.marginTop = -span.scrollHeight - 12 + 'px';      
      
      pencil.addEventListener('click', ()=>this.openDlg(args.index));
      link.addEventListener('click', ()=>this.loadScene(args.sid));
    },
    openDlg(index){
      let data = this.panoSource.sceneArr[0].spots[index];
      this.editPinSpotData = {
        dialog: true,
        editValid: true,
        spot: {
          contents: data.contents,
          id: data.id,
          text: data.text,
          sceneID: data.sceneID,
          about : data.about,
          layer: data.layer,
          link: data.link,
          pitch: data.pitch,
          style: data.style,
          yaw: data.yaw
        }
      };
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
          await this.panoSource.sceneArr.push({
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
    mousePinDownHandler(event) {
      let div_bg = document.getElementsByClassName("bg")[0];
      if(this.isAddpin == true){
        this.editPinSpotData = {
          dialog: true,
          editValid: false,
          spot: {
            pitch: event.pageX/div_bg.getBoundingClientRect().width,
            yaw: event.pageY/div_bg.getBoundingClientRect().height,
            style: "detail",
          }
        };
        this.isAddpin = false;
      }
    },
    addPinConfig() {
      this.isAddpin = true;
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
    cancelPinSpot() {
      this.editPinSpotData = {
        dialog: false,
        editValid: false,
        spot: null
      };
    },
    deletePinSpot(){
      this.viewer.removeHotSpot(this.editPinSpotData.spot.id);

      this.panoSource.sceneArr[0].spots =
        this.panoSource.sceneArr[0].spots.filter(
          (spot) => spot.id !== this.editPinSpotData.spot.id
        );

      this.loadHotSpots();
      this.savePano();
      this.loadScene(this.panoSource.sceneArr[0].id);
      this.editPinSpotData.dialog = false;
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
    async savePinSpot() {
      if (this.$refs.editpinspotform.validate()) {
        if (!this.panoSource.sceneArr[this.currentSceneIndex].spots) {
          this.panoSource.sceneArr[this.currentSceneIndex].spots = [];
        }
        
        if (this.editPinSpotData.spot.id) {
          //edit existing
          this.viewer.removeHotSpot(this.editPinSpotData.spot.id);
          let spotIndex = this.panoSource.sceneArr[0].spots.findIndex((spot) => spot.id == this.editPinSpotData.spot.id);
          this.panoSource.sceneArr[0].spots[spotIndex] = this.editPinSpotData.spot;
        } else {
          //create new
          this.editPinSpotData.spot.id = nanoid();
          this.panoSource.sceneArr[0].spots.push(
            this.editPinSpotData.spot
          );
        }        

        this.loadHotSpots();

        this.savePano();
        this.loadScene(this.panoSource.sceneArr[this.currentSceneIndex].id);
        this.editPinSpotData.dialog = false;
      }
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
    } 
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
    "editPinSpotData.dialog": function (val) {
      if (val) {
        //update scene list
        this.allScenes4Pin = [];

        for (let i =1;i<this.panoSource.sceneArr.length;i++ ) {    
          this.allScenes4Pin.push({
            text: this.panoSource.sceneArr[i].title,
            value: this.panoSource.sceneArr[i].id,
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
div.custom-img img{
  width: 100% !important;
  height: 100%;
}
div.custom-tooltip span {
    visibility: hidden;
    position: absolute;
    border-radius: 3px;
    background-color: #1c1b1b9e;
    color: #fff;
    text-align: center;
    width: 50px !important;
    padding: 5px 10px;
    margin-left: -220px;
    cursor: default;
}
div.custom-tooltip:hover span{
    visibility: visible;
}
div.custom-tooltip:hover span:after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-width: 10px;
    border-style: solid;
    border-color: #1c1b1b9e transparent transparent transparent;
    bottom: -20px;
    left: -10px;
    margin: 0 50%;
}
.link{
  margin-left: 15px;
}

[class*="col-"] {
  text-align: center;
}

.cols-1 {width: 8.33%; text-align: center;}
.cols-2 {width: 16.66%; text-align: center;}
.cols-3 {width: 25%; text-align: center;}
.cols-4 {width: 33.33%;}
.cols-5 {width: 41.66%;}
.cols-6 {width: 50%;}
.cols-7 {width: 58.33%;}
.cols-8 {width: 66.66%;}
.cols-9 {width: 75%;}
.cols-10 {width: 83.33%;}
.cols-11 {width: 91.66%;}
.cols-12 {width: 100%;}

@media only screen and (max-width: 740px) {
  /* For mobile phones: */
  [class*="cols-"] {
    width: 50%;
  }
}
@media only screen and (max-width: 400px) {
  /* For mobile phones: */
  [class*="cols-"] {
    width: 100%;
  }
}
.row::after {
  content: "";
  clear: both;
  display: block;
}

.ring-button {
  min-width: 30px;
  min-height: 30px;
  background: #4FD1C5;
  background: linear-gradient(90deg, rgba(129,230,217,1) 0%, rgba(79,209,197,1) 100%);
  border: none;
  border-radius: 1000px;
  box-shadow: 12px 12px 24px rgba(79,209,197,.64);
  transition: all 0.3s ease-in-out 0s;
  cursor: pointer;
  outline: none;
  position: relative;
  padding: 10px;
  }

.ring-button::before {
content: '';
  border-radius: 1000px;
  min-width: calc(50px + 12px);
  min-height: calc(50px + 12px);
  border: 6px solid #00FFCB;
  box-shadow: 0 0 50px rgba(0,255,203,.64);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: all .3s ease-in-out 0s;
}

.ring-button:hover, .ring-button:focus {
  color: #313133;
  transform: translateY(-6px);
}

.ring-button:hover::before, .ring-button:focus::before {
  opacity: 1;
}

.ring-button::after {
  content: '';
  width: 30px; height: 30px;
  border-radius: 100%;
  border: 6px solid #00FFCB;
  position: absolute;
  z-index: -1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: ring 1.5s infinite;
}

.ring-button:hover::after, .ring-button:focus::after {
  animation: none;
  display: none;
}

@keyframes ring {
  0% {
    width: 30px;
    height: 30px;
    opacity: 1;
  }
  100% {
    width: 30px;
    height: 30px;
    opacity: 0;
  }
}

</style>

<style scoped>
.bg {
  width: 100%;
  height: 100%;
  background-color: lightgray;
}

.vue-pannellum {
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  position: fixed; 
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  /* width: 500px; */
}

.v-expansion-panels.condensed .v-expansion-panel-header {
  padding-top: 0px;
  padding-bottom: 0px;
  min-height: auto;
}
</style>