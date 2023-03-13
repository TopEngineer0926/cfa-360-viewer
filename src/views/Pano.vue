<template>
  <div v-if="isGuest || canReadContent" class="bg">
    
    <div v-if="planView.img" class="vue-pannellum">
      
      <div class="img-container">
        <div class="img"></div>
      </div>

      <div class="button"></div>

      <div class="default-slot">
        <div class="home-button">
          <v-btn
            color="black-white"
            fab
            small
            dark
            @click="changeSceneIndex(0); loadScene(planView.id);"
          >
            <v-icon>mdi-domain</v-icon>
          </v-btn>
        </div>

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
                    @click.stop="isPlan = true; initEditScene(planView.id)"
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
                  <v-btn
                    v-if="isEditable && canCreateTag && currentSceneIndex != 0"
                    small
                    text
                    @click.stop="addTagConfig"
                    class="ma-1"
                  >
                    Add Tag
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
                <v-col cols="12" class="ma-0 pa-0">
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
                                    class="rounded-10" width="100" height="100" style="width: 100px; height: 100px;"
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
        <v-card-title class="headline">{{ isPlan ? "Floor Plan" : "Scene" }}</v-card-title>
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
              v-if="isPlan"
              v-model="editSceneData.imgToUpload"
              accept="image/*"
              label="Select floor plan"
              :rules="[
                (v) => !!(editSceneData.sceneID || v) || 'Image is required',
              ]"
            ></v-file-input>
            <v-file-input
              v-else
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
          <v-btn
            v-if="!isPlan"
            color="primary"
            text
            @click="snapshotDialog = true"
            :disabled="!editSceneData.imgToUpload && !this.editSceneData.panorama"
          >
            Set thumbnail
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="saveScene(); isPlan = false;"
            :disabled="!editSceneData.editValid"
          >
            Save
          </v-btn>
          <v-btn color="grey" text @click="editSceneData.dialog = false; isPlan = false;">
            Cancel
          </v-btn>
          <v-btn
            v-if="panoSource.sceneArr && panoSource.sceneArr.length > 0"
            color="grey"
            text
            @click="deleteScene(); isPlan = false;"
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
              v-show="false"
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
              v-show="false"
              v-model="editPinSpotData.spot.about"
              label="Description"
              auto-grow
              :rows="1"
              :readonly="!isEditable"
            ></v-textarea>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn v-show="isAddpin == false" color="grey" text @click="changeSceneIndex(nextSceneID); loadScene(currentSceneID);">
            Go Scene
          </v-btn>
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
    <v-dialog
      v-show="snapshotDialog"
      v-model="snapshotDialog"
      persistent
      ref="snapshot"
      max-width="600"
    >
      <v-card>
        <v-card-title class="headline">Set the Thumbnail</v-card-title>
        <div id="pannellum-container"></div>
        <div id="output"></div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="captureSnapshot">
            Capture
          </v-btn>
          <v-btn color="grey" text @click="cancelSnapshotDialog">
            Cancel
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
      panoPin : null,
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
        panorama: null
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
        status : 1,
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
        spot: null,
        status : 0
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
      currentSceneID : null,
      nextSceneID : null,
      image_width: 0,
      image_height: 0,
      snapshotDialog: false,
      dlgViewer: null,
      thumbImg: null,
      isPlan: false
    };
  },
  async created() {
    if (this.$route.params.linkname) {
      //Check if Guest User
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
      //login user
      if (this.$route.params.linkname) {
        let data = await API.graphql(
          graphqlOperation(sharingByLinkname, {linkname: this.$route.params.linkname})
        )
        let sharingData = data.data.sharingByLinkname.items;
        this.customID = sharingData[0].panoID;
      } else {
        this.customID = this.$route.params.id;
      }

      API.graphql(
        graphqlOperation(getProjectPermission, { id: this.customID })
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
              panoID: this.customID,
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
            let panorama = await Storage.get(
              this.panoSource.id + "/" + scene.img,
              { expires: 432000 }
            );
            let thumb = await Storage.get(
              this.panoSource.id + "/" + scene.img + "/thumbnail",
              { expires: 432000 }
            );
            
            this.pano.scenes[scene.id].panorama = panorama;
            scene.thumbnail = thumb;
            if(key == 0){
              this.planView.id = scene.id;
              this.planView.img = panorama;
            }else{
              this.pano.scenes[scene.id].hfov = 120;
              this.pano.scenes[scene.id].sceneFadeDuration = 1000;
              this.pano.scenes[scene.id].pitch = 0;
              this.pano.scenes[scene.id].yaw = 0;
            }
            // this.loadHotSpots(key);
          })
        );
        
        this.currentSceneIndex = 0;
        window.addEventListener('resize', ()=>this.resizeWindow());
        this.removeChild(0);
        this.resizeExpand();
        this.showPlanView();
      }
    },
    getContainedSize(img) {
      var ratio = img.naturalWidth/img.naturalHeight;
      var width = img.height*ratio
      var height = img.height
      if (width > img.width) {
        width = img.width
        height = img.width/ratio
      }
      this.image_width = width;
      this.image_height = height;
    },
    showPlanView(){
      if(this.currentSceneIndex == 0){
        this.viewer = null;
        let div_container = document.getElementsByClassName("img-container")[0];
        let div_img = document.getElementsByClassName("img")[0];
        let div_expand = document.getElementsByClassName("default-slot")[0];
        let div_bg = document.getElementsByClassName("bg")[0];

        if (div_img) {
          while (div_img.firstChild) {
            div_img.removeChild(div_img.lastChild);
          }
        }

        var oImg = document.createElement("img");
        oImg.src = this.planView.img
        oImg.style.objectFit = 'contain'
        oImg.style.height = '100%'

        div_container.style.width = div_bg.getBoundingClientRect().width + 'px';
        div_container.style.height = (div_bg.getBoundingClientRect().height - div_expand.getBoundingClientRect().height) + 'px';
        div_img.style.height = '100%'
        oImg.addEventListener('mousedown', (event)=>this.mousePinDownHandler(event));

        oImg.onload = () => {
          this.getContainedSize(oImg)
          this.drawButton();
        }
        
        div_img.appendChild(oImg);
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
        let div_container = document.getElementsByClassName("img-container")[0];
        let div_expand = document.getElementsByClassName("default-slot")[0]; 
        let div_bg = document.getElementsByClassName("bg")[0];
        let home_button = document.getElementsByClassName("home-button")[0]; 
        let vm = this;

        const resize_ob = new ResizeObserver(function (entries) {
          if(vm.currentSceneIndex == 0){
            div_container.style.width = div_bg.getBoundingClientRect().width + 'px';
            div_container.style.height = (div_bg.getBoundingClientRect().height - div_expand.getBoundingClientRect().height) + 'px';
            home_button.style.bottom = div_expand.getBoundingClientRect().height + 10 + 'px';

            vm.showPlanView()
          } else {
            div_container.style.height = '0px';
          }
        });

        resize_ob.observe(div_expand);
    },
    getCurrentIndexById(id){
      let scene = this.panoSource.sceneArr;
      let scene_index;
      scene.map((scene,index) => {
        if(scene.id == id){
          scene_index =  index;
        }
      });
      return scene_index;
    },
    drawButton(){
      if(this.currentSceneIndex == 0){
        let div_container = document.getElementsByClassName("img-container")[0];
        let div_button = document.getElementsByClassName("button")[0];
        if (div_button) {
          while (div_button.firstChild) {
            div_button.removeChild(div_button.lastChild);
          }
        } else {
          return;
        }

        let scene = this.panoSource.sceneArr[0];
        scene.spots.map((spot,index) => {
          let start_Xpos, start_Ypos;
          start_Xpos = div_container.getBoundingClientRect().width/2 - this.image_width/2;
          start_Ypos = div_container.getBoundingClientRect().height/2 - this.image_height/2;

          let button = document.createElement('BUTTON');
          let button_group = document.createElement('div');
          let text = document.createElement('p');

          button_group.style.position = 'fixed';
          button_group.style.left = (spot.pitch * this.image_width + start_Xpos) + 'px';
          button_group.style.top = (spot.yaw * this.image_height + start_Ypos) + 'px';

          text.innerHTML = this.getScenetitlebyID(spot.sceneID);
          text.style.color = 'white';
          text.style.backgroundColor = 'red';
          text.style.marginLeft = - (text.outerText.length * 4) + 'px';

          button.style.backgroundColor = 'red'
          button.style.borderRadius = '50%'
          button.style.width = 20 + 'px';
          button.style.height = 20 + 'px';
          button.addEventListener('click', ()=>{
            if(this.isEditable == true){
              this.currentSceneID = spot.sceneID;
              this.nextSceneID = this.getCurrentIndexById(spot.sceneID);
              this.isAddpin = false;
              this.editPinSpotData = {
                dialog: true,
                editValid: false,
                spot: spot
              };
            } else {
              this.changeSceneIndex(index + 1); 
              this.loadScene(spot.sceneID);
            }
          })

          button_group.appendChild(button);
          button_group.appendChild(text);

          div_button.appendChild(button_group);
        });
      }
    },
    
    removeChild(status){
      if(status == 0){
        let div_class = document.getElementsByClassName("img-container")[0];
        if(div_class){
          div_class.style.height = '0px';
        }

        let div_img = document.getElementsByClassName("img")[0];
        if(div_img){
          while (div_img.firstChild) {
            div_img.removeChild(div_img.lastChild);
          }
        }

        let div_button = document.getElementsByClassName("button")[0];
        if(div_button){
          while (div_button.firstChild) {
            div_button.removeChild(div_button.lastChild);
          }
        }
        let div = document.getElementsByClassName("pnlm-ui pnlm-grab")[0];
        let div1 = document.getElementsByClassName("pnlm-render-container")[0];
        let div2 = document.getElementsByClassName("pnlm-ui")[0];

        if(div){
          div.remove();
        }

        if(div1){
          div1.remove();
        }
        if(div2){
          div2.remove();
        }

      } else if(status == 1) {
        let div_class = document.getElementsByClassName("img-container")[0];
        if(div_class){
          div_class.style.height = '0px';
        }

        let div_img = document.getElementsByClassName("img")[0];
        if(div_img){
          while (div_img.firstChild) {
            div_img.removeChild(div_img.lastChild);
          }
        }

        let div_button = document.getElementsByClassName("button")[0];
        if(div_button){
          while (div_button.firstChild) {
            div_button.removeChild(div_button.lastChild);
          }
        }
      }
    },
    // loadHotSpots(index){
    //   let scene = this.panoSource.sceneArr[index];
    //   this.pano.scenes[scene.id].hotSpots = [];
    //   if(scene.spots){
    //     scene.spots.map((spot,index) => {
    //       let obj = {};
    //       obj.pitch = spot.pitch;
    //       obj.yaw = spot.yaw;
    //       obj.type = 'info';
    //       obj.text = spot.text;
    //       obj.sceneID = spot.sceneID;
    //       obj.createTooltipFunc = this.customTooltiphotspot;
    //       obj.createTooltipArgs = {index: index, sid: spot.sceneID};
    //       this.pano.scenes[scene.id].hotSpots.push(obj);
    //     });
    //   }
    // },
    async loadScene(sceneID) {
      this.cancelPinSpot();
      let div_slot = document.getElementsByClassName("default-slot")[0];

      let div,div1;
      div = document.getElementsByClassName("pnlm-ui pnlm-grab")[0];
      div1 = document.getElementsByClassName("pnlm-render-container")[0];

      if(div){
        div.remove();
      }

      if(div1){
        div1.remove();
      }

      if(this.currentSceneIndex == 0){
        div_slot.style.zIndex = 0;
        div_slot.style.position = "fixed";
        this.resizeWindow();
      } else {
        this.pano = {
          title: this.panoSource.prototypeName,
          scenes: {},
        };
        await Promise.all(
          this.panoSource.sceneArr.map(async (scene, key) => {
            this.pano.scenes[scene.id] = {};
            this.pano.scenes[scene.id].title = scene.title;
            let panorama = await Storage.get(
              this.panoSource.id + "/" + scene.img,
              { expires: 432000 }
            );
            let thumb = await Storage.get(
              this.panoSource.id + "/" + scene.img + "/thumbnail",
              { expires: 432000 }
            );

            this.pano.scenes[scene.id].panorama = panorama;
            scene.thumbnail = thumb;

              this.pano.scenes[scene.id].hfov = 120;
              this.pano.scenes[scene.id].sceneFadeDuration = 1000;
              this.pano.scenes[scene.id].pitch = 0;
              this.pano.scenes[scene.id].yaw = 0;
          })
        );
        this.viewer = window.pannellum.viewer(this.$el, this.pano);
        this.removeChild(1);
        div_slot.style.zIndex = 2;
        div_slot.style.position = "absolute";
        this.viewer.loadScene(sceneID);
        this.selectedLayersIndex = Array.from(
          Array(this.panoSource.layers.length).keys()
        );

        let checkLoad = (viewer) => {
          if (viewer.isLoaded()) {
            this.loadLayers();
          } else {
            setTimeout(checkLoad, 500, viewer); // setTimeout(func, timeMS, params...)
          }
        };
        checkLoad(this.viewer);
      }
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
    changeSceneIndex(index){
      this.currentSceneIndex = index;
    },
    async initEditScene(sceneID) {
      if (!sceneID) {
        this.editSceneData.sceneID = null;
        this.editSceneData.sceneIndex = null;
        this.editSceneData.title = null;
        this.editSceneData.panorama = null;
      } else {
        this.editSceneData.sceneIndex = this.panoSource.sceneArr.findIndex(
          (scene) => scene.id == sceneID
        );
        this.editSceneData.sceneID = sceneID;
        this.editSceneData.title =
          this.panoSource.sceneArr[this.editSceneData.sceneIndex].title;

        let panorama = await Storage.get(
          this.panoSource.id + "/" + this.panoSource.sceneArr[this.editSceneData.sceneIndex].img,
          { expires: 432000 }
        );
        this.editSceneData.panorama = panorama;
      }
      this.editSceneData.imgToUpload = null;
      this.editSceneData.dialog = true;
    },
    async deleteScene() {
      await Storage.remove(
        this.panoSource.id +
          "/" +
          this.panoSource.sceneArr[this.editSceneData.sceneIndex].img
      );
      await Storage.remove(
        this.panoSource.id +
          "/" +
          this.panoSource.sceneArr[this.editSceneData.sceneIndex].img +
          "/thumbnail"
      );

      //+++remove content
      this.panoSource.sceneArr.splice(this.editSceneData.sceneIndex, 1);
 
      this.savePano();
      this.editSceneData.dialog = false;
      if (this.panoSource.sceneArr.length > 0) {
        this.currentSceneIndex = 0;
        this.initPano();
      } else {
        this.$router.push({ path: "/panolist" });
      }
    },
    loadLayers() {
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
    srcToFile(src, fileName, mimeType){
        return (fetch(src)
            .then(function(res){return res.arrayBuffer();})
            .then(function(buf){return new File([buf], fileName, {type:mimeType});})
        );
    },
    async saveScene() {
      if (this.$refs.editimgform.validate()) {
        let sceneID = this.editSceneData.sceneID
          ? this.editSceneData.sceneID
          : nanoid();
        let s3link = null;
        let s3ThumbLink = null;
        let imgID = nanoid();

        if (this.editSceneData.imgToUpload) {
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

          if (this.thumbImg === null) {
            s3ThumbLink = (
              await Storage.put(
                this.panoSource.id + "/" + imgID + "/thumbnail",
                this.editSceneData.imgToUpload,
                {
                  contentType: this.editSceneData.imgToUpload ? this.editSceneData.imgToUpload.type : "image/png",
                }
              )
            ).key;
          } else {
            let vm = this;
            await this.srcToFile(
              this.thumbImg,
              "thumbnail.png",
              'image/png'
            )
            .then(async function(thumbFile){
              s3ThumbLink = (
                await Storage.put(
                  vm.panoSource.id + "/" + imgID + "/thumbnail",
                  thumbFile,
                  {
                    contentType: "image/png"
                  }
                )
              ).key;
            })
          }
        } else {
          if (this.thumbImg !== null) {
            let sceneIndex = this.panoSource.sceneArr.findIndex(
              (scene) => scene.id == sceneID
            );
            let vm = this;
            await this.srcToFile(
              this.thumbImg,
              "thumbnail.png",
              'image/png'
            )
            .then(async function(thumbFile){
              s3ThumbLink = (
                await Storage.put(
                  vm.panoSource.id + "/" + vm.panoSource.sceneArr[sceneIndex].img + "/thumbnail",
                  thumbFile,
                  {
                    contentType: "image/png"
                  }
                )
              ).key;
            })
          }
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
            await Storage.remove(
              this.panoSource.id +
                "/" +
                this.panoSource.sceneArr[sceneIndex].img
            );

            if (s3ThumbLink) {
              await Storage.remove(
                this.panoSource.id +
                  "/" +
                  this.panoSource.sceneArr[sceneIndex].img +
                  "/thumbnail"
              );

              let thumb_url = await Storage.get(s3ThumbLink);
              this.panoSource.sceneArr[sceneIndex].thumbnail = thumb_url;
            }

            this.panoSource.sceneArr[sceneIndex].img = s3link.split("/")[1];

            let url = await Storage.get(s3link);

            //edit scene panorama
            this.pano.scenes[sceneID].panorama = url;
          }
        } else {
          let panorama_url = await Storage.get(s3link);
          let thumb_url = await Storage.get(s3ThumbLink);
          this.viewer = window.pannellum.viewer(this.$el, this.pano);

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
            thumbnail: thumb_url,
            id: sceneID,
            title: this.editSceneData.title,
            img: s3link.split("/")[1],
          });
        }
        this.savePano();
        this.editSceneData.dialog = false;
        this.thumbImg = null;
        this.initPano();
      }
      //  this.$forceUpdate();
    },
    mousePinDownHandler(event) {
      this.getContainedSize(event.target);
      let div_container = document.getElementsByClassName("img-container")[0];
      let start_Xpos, start_Ypos;

      start_Xpos = div_container.getBoundingClientRect().width/2 - this.image_width/2;
      start_Ypos = div_container.getBoundingClientRect().height/2 - this.image_height/2;
      
      if(this.isAddpin == true){
        let lenX,lenY;
        lenX = (event.pageX - start_Xpos)/this.image_width;
        lenY = (event.pageY - start_Ypos)/this.image_height;
        this.editPinSpotData = {
          dialog: true,
          editValid: false,
          spot: {
            pitch: lenX,
            yaw: lenY,
            style: "detail",
            about : " ",
            text : " "
          }
        };
        this.isAddpin = false;
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
      this.panoSource.sceneArr[0].spots =
        this.panoSource.sceneArr[0].spots.filter(
          (spot) => spot.id !== this.editPinSpotData.spot.id
        );
      // for(let i=0;i<this.panoSource.sceneArr.length;i++){
      //   this.loadHotSpots(i);
      // }
      
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
          let spotIndex = this.panoSource.sceneArr[0].spots.findIndex((spot) => spot.id == this.editPinSpotData.spot.id);
          this.panoSource.sceneArr[0].spots[spotIndex] = this.editPinSpotData.spot;
        } else {
          //create new
          this.editPinSpotData.spot.id = nanoid();
          this.panoSource.sceneArr[0].spots.push(
            this.editPinSpotData.spot
          );
        }        

        // for(let i=0;i<this.panoSource.sceneArr.length;i++){
        //   this.loadHotSpots(i);
        // }

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
        this.loadLayers();
        this.editSpotData.dialog = false;

        this.savePano();
      }
    },
    savePano() {
      let saveTopano = JSON.parse(JSON.stringify(this.panoSource));
      saveTopano.sceneArr.map((scene, key) => {
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
    },
    loadPanorama() {
      let el = document.getElementById('pannellum-container');
      let div_el = document.createElement('div');

      this.dlgViewer = window.pannellum.viewer(div_el, {
        "type": 'equirectangular',
        "panorama": this.editSceneData.imgToUpload ? `${URL.createObjectURL(this.editSceneData.imgToUpload)}` : this.editSceneData.panorama,
        "autoLoad": true,
        "hfov": 120
      });

      el.appendChild(div_el);
    },
    captureSnapshot() {
      this.thumbImg = this.dlgViewer.getRenderer().render(
        this.dlgViewer.getPitch() / 180 * Math.PI,
        this.dlgViewer.getYaw() / 180 * Math.PI,
        this.dlgViewer.getHfov() / 180 * Math.PI,
        {'returnImage': true}
      );

      this.snapshotDialog = false;

      let el = document.getElementById('pannellum-container');
      while (el.firstChild)
        el.removeChild(el.lastChild);
    },
    cancelSnapshotDialog() {
      let el = document.getElementById('pannellum-container');
      while (el.firstChild)
        el.removeChild(el.lastChild);

      this.dlgViewer = null;
      this.snapshotDialog = false;
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
    snapshotDialog: function (dialogState) {
     if (dialogState) {
        // At this point you dialog state should have opened Now you can call your function
        // But to be sure you can check for DOM update
        this.$nextTick(() => {
          // Call your method, as it's completely gurantees if the DOM get updated
          this.loadPanorama();
        })
      }
    }
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
  justify-content: center;
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

#pannellum-container {
  width: 100%;
  height: 400px;
}
</style>

<style scoped>
.bg {
  width: 100%;
  height: 100%;
  background-color: lightgray;
}

.home-button {
  position: absolute;
  left: 10px;
}

.vue-pannellum {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.img {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.img-container {
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