<template>
  <v-container>
    <v-row justify="center" class="my-4">
      <v-btn
        v-if="
          user.masterSiteAdmin ||
          (user.siteAdmin &&
            roleDefinitionTable.find((role) => role.name == 'Site Admin')
              .createProject)
        "
        color="primary"
        @click="createPanoFunc"
        >Create</v-btn
      >
    </v-row>
    <v-row justify="center" class="my-4">
      <v-col cols="4">
        <v-select
          value="All Categories"
          :items="categoryList"
          label="Solo field"
          solo
          @change="filterByCategory"
        ></v-select>
      </v-col>
    </v-row>

    <div
      v-if="panos && panos.length > 0"
      class="d-flex flex-wrap justify-center"
    >
      <div v-for="(pano, index) in panosFilter" :key="index">
        <v-hover v-slot="{ hover }" class="ma-6">
          <v-card
            :elevation="hover ? 12 : 2"
            width="500"
            height="200"
            @click="$router.push('/pano/' + pano.id)"
          >
            <v-list-item three-line>
              <v-list-item-content>
                <div class="overline mb-4">
                  {{ pano.category ? pano.category : "Category Not Assigned" }}
                </div>
                <v-list-item-title class="headline mb-1">
                  {{ pano.prototypeName }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ pano.prototypeEdition }}</v-list-item-subtitle
                >
                <v-list-item-subtitle>
                  {{ pano.description }}</v-list-item-subtitle
                >
              </v-list-item-content>

              <v-list-item-avatar tile height="120" width="200" color="grey">
                <v-img
                  :src="
                    pano.thumbnail
                      ? pano.thumbnailUrl
                      : 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='
                  "
                >
                </v-img>
              </v-list-item-avatar>
            </v-list-item>

            <v-card-actions v-if="user.siteAdmin">
              <v-spacer />
              <v-btn
                icon
                @click.stop="$router.push('/panosetting/' + pano.id)"
                class="mr-14"
              >
                <v-icon>mdi-cog-outline</v-icon>
              </v-btn>

              <v-btn icon @click.stop="getTempsharing(pano.id)" class="mr-14"
                ><v-icon>mdi-share </v-icon>
              </v-btn>

              <v-btn icon @click.stop="deletePanoConfirm(pano)"
                ><v-icon>mdi-delete-outline </v-icon>
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-hover>
      </div>
    </div>
    <div v-else-if="panos && panos.length == 0" class="text-center">
      <h3>
        Please reach out to Corey Overton for access to scenes within the
        virtual restaurant viewer.
      </h3>
    </div>
    <div v-else-if="!panos" class="text-center">
      <h3>Loading. Please wait.</h3>
      <v-progress-circular
        indeterminate
        color="primary"
        class="mt-4"
      ></v-progress-circular>
    </div>
    <v-dialog
      v-if="editPano.dialog"
      v-model="editPano.dialog"
      persistent
      max-width="600"
    >
      <v-card>
        <v-card-title class="headline"> Edit </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="editPano.editValid" lazy-validation>
            <v-text-field
              v-model="editPano.prototypeName"
              require
              :rules="[(v) => !!v || 'Prototype Name is required']"
              label="Prototype Name"
            ></v-text-field>
            <v-text-field
              v-model="editPano.prototypeEdition"
              label="Prototype Edition"
            ></v-text-field>
            <v-text-field
              v-model="editPano.description"
              label="Description"
            ></v-text-field>
            <!-- <v-file-input
              v-model="editPano.imgToUpload"
              accept="image/*"
              label="Select panorama image"
            ></v-file-input> -->
            <v-file-input
              v-model="editPano.thumbnailToUpload"
              accept="image/*"
              label="Select thumbnail image"
            ></v-file-input>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="savePano"
            :disabled="!editPano.editValid"
          >
            Save
          </v-btn>
          <v-btn color="grey" text @click="editPano.dialog = false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-if="sharing.dialog" v-model="sharing.dialog" max-width="600">
      <v-card>
        <v-card-title class="headline"> Temporary sharing Links</v-card-title>
        <v-card-text>
          <div v-if="sharing.list">
            <div v-for="(sharingitem, index) in sharing.list" :key="index">
              <v-row align="center">
                <v-col cols="1">
                  <h3>{{ index + 1 }}</h3>
                </v-col>

                <v-col>
                  <v-btn
                    text
                    @click="
                      copySharingLink(sharingitem.panoID, sharingitem.password)
                    "
                    >Copy the Sharing Link</v-btn
                  >
                </v-col>

                <v-col>
                  Link Vaild Until
                  {{ new Date(sharingitem.ttl * 1000).toLocaleString() }}
                </v-col>
                <v-col cols="1">
                  <v-btn icon @click="deleteTempsharing(sharingitem, index)">
                    <v-icon>mdi-delete</v-icon></v-btn
                  >
                </v-col>
              </v-row>
            </div>
          </div>
          <h2 class="mt-8">Create a new sharing link</h2>
          <v-row align="center">
            <v-col>
              <v-text-field
                v-model="sharing.newHours"
                label="Valid hours from now"
                type="number"
              ></v-text-field>
            </v-col>
            <v-col> <v-btn block @click="addTempsharing()">Add</v-btn></v-col>
          </v-row>

          <!-- <v-form ref="form" v-model="editPano.editValid" lazy-validation>
            <v-text-field
              v-model="editPano.prototypeName"
              require
              :rules="[(v) => !!v || 'prototypeName is required']"
              label="prototypeName"
            ></v-text-field>
            <v-text-field v-model="editPano.prototypeEdition" label="Type"></v-text-field>
            <v-text-field v-model="editPano.description" label="Size"></v-text-field>
            
            <v-file-input
              v-model="editPano.thumbnailToUpload"
              accept="image/*"
              label="Select thumbnail image"
            ></v-file-input>
          </v-form> -->
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="grey" text @click="sharing.dialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <foot />
  </v-container>
</template>

<script>
import { API, graphqlOperation, Storage } from "aws-amplify";
import {
  createPano,
  deletePano,
  createTemporarySharing,
  deleteTemporarySharing,
} from "../graphql/mutations";
import {
  listPanos,
  sharingByPano,
  getProjectPermission,
} from "../graphql/queries";
import { mapState } from "vuex";

import { updatePano } from "../graphql/mutations";
import { nanoid } from "nanoid";
import Compressor from "compressorjs";

export default {
  name: "PanoList",

  components: {
    foot: () => import("../components/Foot.vue"),
  },

  data: function () {
    return {
      panos: null,
      panosFilter: null,
      categoryList: ["All Categories"],
      editPano: {
        index: null,
        prototypeEdition: null,
        description: null,
        editValid: false,
        dialog: false,
        prototypeName: null,
        imgToUpload: null,
        thumbnailToUpload: null,
      },
      sharing: {
        dialog: false,
        panoID: null,
        new: null,
        list: null,
      },
    };
  },
  computed: mapState(["user", "roleDefinitionTable"]),
  created() {
    this.$store.commit("SET_NAVBAR_TEXT", null);
    this.loadPanos();
  },
  methods: {
    loadPanos() {
      API.graphql(graphqlOperation(listPanos)).then(async (data) => {
        let panosData = data.data.listPanos.items;
        let panosRes = [];

        await Promise.all(
          panosData.map(async (pano) => {
            let projectPermission = (
              await API.graphql(
                graphqlOperation(getProjectPermission, { id: pano.id })
              )
            ).data.getProjectPermission;

            if (
              this.user.masterSiteAdmin ||
              this.user.siteAdmin ||
              (projectPermission &&
                (projectPermission.admins.includes(this.user.username) ||
                  projectPermission.editors.includes(this.user.username) ||
                  projectPermission.viewers.includes(this.user.username)))
            ) {
              if (pano.category) {
                this.categoryList.push(pano.category);
              }
              if (pano.thumbnail) {
                pano.thumbnailUrl = await Storage.get(
                  pano.id + "/" + pano.thumbnail,
                  { expires: 432000 }
                );
              }
              panosRes.push(pano);
            }
          })
        );

        panosRes = panosRes.sort((a, b) => {
          let fa = a.prototypeName.toLowerCase(),
            fb = b.prototypeName.toLowerCase();
          if (fa < fb) {
            return -1;
          }
          if (fa > fb) {
            return 1;
          }
          return 0;
        });

        this.panos = panosRes;
        this.panosFilter = panosRes;
      });
    },
    filterByCategory(category) {
      if (category == "All Categories") {
        this.panosFilter = this.panos;
      } else {
        this.panosFilter = this.panos.filter(
          (pano) => pano.category == category
        );
      }
    },

    async createPanoFunc() {
      try {
        let newPanoId = await API.graphql(
          graphqlOperation(createPano, {
            input: { prototypeName: "New Project" },
          })
        );
        this.$router.push({
          path: "/panosetting/" + newPanoId.data.createPano.id,
        });
      } catch (error) {
        console.error("createPano", error);
      }
    },
    deletePanoFunc(pano) {
      //delete thumbnail
      if (pano.thumbnail) {
        Storage.remove(pano.id + "/" + pano.thumbnail);
      }

      //delete scene imgs
      if (pano.sceneArr && pano.sceneArr.length > 0) {
        pano.sceneArr.forEach((scene) => {
          Storage.remove(pano.id + "/" + scene.img);
        });
      }

      //delete pano
      API.graphql(
        graphqlOperation(deletePano, {
          input: { id: pano.id },
        })
      );

      //delete Spots
      // +++++
      //delete Comments
      // +++++
      this.panos.splice(
        this.panos.findIndex((e) => e.id == pano.id),
        1
      );
      this.panosFilter.splice(
        this.panosFilter.findIndex((e) => e.id == pano.id),
        1
      );
    },
    async deletePanoConfirm(pano) {
      if (
        await this.$root.$confirm(
          `Delete ${pano.prototypeName}?`,
          "This action cannot be undone. This scene will be deleted permanently.",
          { color: this.$vuetify.theme.currentTheme.primary }
        )
      ) {
        this.$root.$dialogLoader.start(
          "Deleted Successfully",
          {},
          () => {
            this.deletePanoFunc(pano);
          },
          true
        );
      }
    },
    async savePano() {
      if (this.$refs.form.validate()) {
        let newPano = {
          id: this.panos[this.editPano.index].id,
          prototypeName: this.editPano.prototypeName,
        };
        if (this.editPano.description) {
          newPano.description = this.editPano.description;
        }
        if (this.editPano.prototypeEdition) {
          newPano.prototypeEdition = this.editPano.prototypeEdition;
        }
        // if (this.editPano.imgToUpload) {
        //   let imgId = nanoid();
        //   newPano.img = (
        //     await Storage.put(imgId, this.editPano.imgToUpload, {
        //       level: "protected",
        //       contentType: this.editPano.imgToUpload.type,
        //       metadata: { user: this.user.email },
        //     })
        //   ).key;
        //   //delete org img
        //   if (this.panos[this.editPano.index].img) {
        //     Storage.remove(this.pano.img, { level: "protected" });
        //   }
        // }

        // if (
        //   !this.editPano.thumbnailToUpload &&
        //   !this.panos[this.editPano.index].thumbnail &&
        //   this.editPano.imgToUpload
        // ) {
        //   this.editPano.thumbnailToUpload = this.editPano.imgToUpload;
        // }

        if (this.editPano.thumbnailToUpload) {
          //Compressor
          let compressedThumbnail = await new Promise((resolve, reject) => {
            new Compressor(this.editPano.thumbnailToUpload, {
              quality: 0.7,
              maxHeight: 512,
              maxWidth: 512,
              success: resolve,
              error: reject,
            });
          });
          let imgId = nanoid();
          newPano.thumbnail = (
            await Storage.put(newPano.id + "/" + imgId, compressedThumbnail, {
              contentType: compressedThumbnail.type,
              metadata: {
                user: this.user.email,
                type: "thumbnail",
              },
            })
          ).key.split("/")[1];
          //delete org img
          if (this.panos[this.editPano.index].thumbnail) {
            Storage.remove(
              this.panos[this.editPano.index].id +
                "/" +
                this.panos[this.editPano.index].thumbnail
            );
          }
        }
        console.log("updatePano", newPano);
        await API.graphql({
          query: updatePano,
          variables: {
            input: newPano,
          },
        });
        this.loadPanos();
        this.editPano.dialog = false;
      }
    },
    getTempsharing(panoID) {
      this.sharing.panoID = panoID;
      API.graphql({
        query: sharingByPano,
        variables: {
          panoID: panoID,
        },
      }).then((data) => {
        this.sharing.list = data.data.sharingByPano.items;
        this.sharing.dialog = true;
      });
    },

    async addTempsharing() {
      let newSharing = {
        panoID: this.sharing.panoID,
        password: nanoid(),
        ttl: Math.round(Date.now() / 1000) + this.sharing.newHours * 60 * 60,
      };
      await API.graphql(
        graphqlOperation(createTemporarySharing, {
          input: newSharing,
        })
      );
      this.sharing.list.push(newSharing);
      this.sharing.new = null;
    },

    deleteTempsharing(item, index) {
      API.graphql(
        graphqlOperation(deleteTemporarySharing, {
          input: { id: item.id },
        })
      );
      this.sharing.list.splice(index, 1);
    },
    copySharingLink(panoID, password) {
      let base = window.location.href.replace("panolist", "pano");
      this.$root.$dialogLoader.start(
        "Link Copied to the clipboard",
        {},
        navigator.clipboard.writeText(base + "/" + panoID + "/" + password),
        true
      );
    },
  },
};
</script>
<style scoped>
amplify-s3-image {
  --height: 200px;
  --width: 400px;
}
</style>