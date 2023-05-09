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
      >Create</v-btn>
    </v-row>
    <v-row justify="center" class="my-4">
      <v-col cols="4" style="min-width:195px;">
        <v-select
          v-model = select
          value="All Categories"
          :items="categoryList"
          label="Solo field"
          solo
          @change="filterByCategory"
          style="min-width:165px;"
        ></v-select>
      </v-col>
    </v-row>

    <div
      v-if="panos && panos.length > 0"
      class="d-flex flex-wrap justify-center"
      style="margin-bottom: 50px;"
    >

    <v-expansion-panels 
      multiple>
      <v-expansion-panel
        v-for="(item,i) in expandItems"
        :key="i"
        v-if = "select == 'All Categories' || select == item"
      >
        <v-expansion-panel-header>
          Template Release:{{item}}   (Total : {{filterByCategory1(item)}})
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div class="v-row v-row--dense">
            <div v-for="(pano, index) in panosFilter" :key="index" v-if= "pano.category == item" class="response">
              <v-hover v-slot="{ hover }">
                <v-card
                  :elevation="hover ? 12 : 2"
                  height="200"
                  @click="$router.push('/pano/' + pano.id)"
                  v-if = "pano.category == item"
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
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
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
              label="Template Release"
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

    <v-dialog v-if="sharing.dialog" v-model="sharing.dialog" max-width="800">
      <v-card>
        <v-card-title class="headline">Temporary sharing Links</v-card-title>
        <v-row align="center" no-gutters style="justify-content: flex-end">
          <div style="margin-right: 50px"> 
            <v-btn block @click="addTempsharing()">Add a Link</v-btn>
          </div>
        </v-row>
        <v-card-text>
          <div v-if="sharing.list">
            <div v-for="(sharingitem, index) in sharing.list" :key="index">
              <v-row align="center">
                <v-col cols="2">
                  <v-text-field
                    v-if = "sharingitem.linkname != 'LINK_'"
                    label="Link Name"
                    v-model="linknameArray[index]"
                    disabled
                  ></v-text-field>
                  <v-text-field
                    v-else
                    label="Link Name"
                    v-model="linknameArray[index]"
                    :rules="rules"
                  ></v-text-field>
                </v-col>

                <v-col cols="3">
                  <v-menu
                    v-model="menuArray[index]"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="linkdateArray[index]"
                        value = "sharingitem.ttl"
                        label="Expiration Date"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="linkdateArray[index]"
                      value = "sharingitem.ttl"
                      @input="menu = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>

                <v-col cols="1">
                  <div v-if = "sharingitem.linkname != 'LINK_'">
                    <v-btn
                      text
                      @click="
                        copySharingLink(sharingitem.panoID,sharingitem.linkname,sharingitem.password)
                      "
                      >Copy</v-btn>
                  </div>
                </v-col>

                <v-col cols="2" align="center">
                  <div v-if = "sharingitem.linkname != 'LINK_'">
                    <v-btn text @click="deleteTempsharing(sharingitem, index)">Delete</v-btn>
                  </div>
                </v-col>

                <v-col cols="2" align="center">
                  <div v-if = "sharingitem.linkname != 'LINK_'">
                    <v-btn text @click="updateTempsharing(sharingitem, index)">Update</v-btn>
                  </div>
                  <div v-else>
                    <v-btn text @click="createTempsharing(sharingitem, index)">Create</v-btn>
                  </div>
                </v-col>
              </v-row>
            </div>
          </div>

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

        <v-row align="center" no-gutters style="justify-content: flex-end">
          <v-col cols="8">
          </v-col>
          <v-col cols="3">
            <v-btn color="grey" text @click="sharing.dialog = false">
              Close
            </v-btn>
          </v-col>
        </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snakeBar.snackbar"
      :bottom="snakeBar.y === 'bottom'"
      :color="snakeBar.color"
      :left="snakeBar.x === 'left'"
      :multi-line="snakeBar.mode === 'multi-line'"
      :right="snakeBar.x === 'right'"
      :timeout="snakeBar.timeout"
      :top="snakeBar.y === 'top'"
      :vertical="snakeBar.mode === 'vertical'"
    >
      {{ snakeBar.text }}
    </v-snackbar>
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
  updateTemporarySharing,
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
      linkdate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      linknameArray : [],
      linkdateArray : [],
      menuArray : [],
      menu: false,
      select : "All Categories",
      panos: null,
      panosFilter: null,
      categoryList: ["All Categories"],
      expandItems : [],
      filterItems : [],
      snakeBar : {
        color: '',
        mode: '',
        snackbar: false,
        text: '',
        timeout: 4000,
        x: null,
        y: 'bottom',
      },
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
      rules: [
        value => (!!value || value == ' ') || 'Required.',
      ],
      sharing: {
        dialog: false,
        panoID: null,
        new: null,
        list: null,
        ttl : null,
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
        var arr = [];
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
                arr.push(pano.category);
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
            this.expandItems = [...new Set(arr)];
            this.expandItems.sort();
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
    filterByCategory1(category) {
      let array = this.panos.filter(
          (pano) => pano.category == category
        );
      return array.length;
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
    async deletePanoFunc(pano) {
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
      await API.graphql(
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

      this.loadPanos();
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
    changeSetTime(time){
      const d = new Date();
      d.setTime(time);   
      let date = d.toISOString().split("T")[0];
      return date;
    },
    getTempsharing(panoID) {
      this.linkdateArray.splice(0,this.linkdateArray.length);
      this.menuArray.splice(0,this.menuArray.length);
      this.linknameArray.splice(0,this.linknameArray.length);
      this.sharing.panoID = panoID;
      API.graphql({
        query: sharingByPano,
        variables: {
          panoID: panoID,
          filter: {
            owner: {
              eq: this.user.email.replace("@", "AT")
            }
          }
        },
      }).then((data) => {
        this.sharing.list = data.data.sharingByPano.items;
        for (let i=0; i<this.sharing.list.length; i++){
          let ttl_time = this.changeSetTime(this.sharing.list[i].ttl);
          this.sharing.list[i].ttl = ttl_time;
          this.linkdateArray[i] = ttl_time;
          this.linknameArray[i] = this.sharing.list[i].linkname;
        }
        
        this.sharing.dialog = true;
      });
    },

    async addTempsharing() {
      this.linkdate = new Date().toISOString().split("T")[0];

      let linkname = 'LINK_';
      let newItem = {
        panoID: this.sharing.panoID,
        password: nanoid(),
        ttl: this.linkdate,
        linkname : linkname,
      }
      this.linkdateArray.push(this.linkdate);
      this.linknameArray.push(linkname);
      this.sharing.list.push(newItem);
      this.sharing.new = null;
    },

    async createTempsharing(item, index) {
      const date = new Date(this.linkdateArray[index]).setHours(23, 59, 59);
      let linkname = this.linknameArray[index];
      let check_item = true;
      if(linkname == 'LINK_' ||linkname == ''){

        this.snakeBar.color = "error";
        this.snakeBar.text = "Linkname is must required!";
        this.snakeBar.snackbar = true;

      } else {
        this.sharing.list.map((shareItem, key) => {
          if(shareItem.linkname == linkname){
            check_item = false;
          }
        })
        if (check_item == true){
          let newSharing = {
            panoID: item.panoID,
            password: nanoid(),
            ttl: date,
            linkname : linkname,
          };
          await API.graphql(
            graphqlOperation(createTemporarySharing, {
              input: newSharing,
            })
          );
          let modifyItem = {
            id : item.id,
            panoID: this.sharing.panoID,
            password: nanoid(),
            ttl: this.linkdateArray[index],
            linkname : linkname,
          }
          this.sharing.list[index] = modifyItem;
          this.getTempsharing(this.sharing.panoID);
        } else {
          this.snakeBar.color = "error";
          this.snakeBar.text = "Linkname is not valid!";
          this.snakeBar.snackbar = true;
        }
      }
    },
    async updateTempsharing(item, index) {
      const date = new Date(this.linkdateArray[index]).setHours(23, 59, 59);
      let linkname = this.linknameArray[index];
      let check_item = true;
      this.sharing.list.map((shareItem, key) => {
          if(shareItem.linkname == linkname){
            check_item = false;
          }
        })
        if (check_item == false){
          let updateSharing = {
            id : item.id,
            panoID: item.panoID,
            password: nanoid(),
            ttl: date,
            linkname : linkname,
          };
          await API.graphql(
            graphqlOperation(updateTemporarySharing, {
              input: updateSharing,
            })
          );
          let modifyItem = {
            id : item.id,
            panoID: this.sharing.panoID,
            password: nanoid(),
            ttl: this.linkdateArray[index],
            linkname : linkname,
          }
          this.sharing.list[index] = modifyItem;
          this.getTempsharing(this.sharing.panoID);
        } else {
          this.snakeBar.color = "error";
          this.snakeBar.text = "Linkname is not invalid!";
          this.snakeBar.snackbar = true;
        }
    },
    async deleteTempsharing(item, index) {
      await API.graphql(
        graphqlOperation(deleteTemporarySharing, {
          input: { id: item.id },
        })
      );
      await this.getTempsharing(this.sharing.panoID);
      this.sharing.list.splice(index, 1);
    },

    copySharingLink(panoID,linkname,password) {
      if(linkname == 'LINK_' ||linkname == ''){

        this.snakeBar.color = "error";
        this.snakeBar.text = "Linkname is must requarid!";
        this.snakeBar.snackbar = true;

      } else {
        let base = window.location.href.replace("panolist","sharing");
        this.$root.$dialogLoader.start(
          "Link Copied to the clipboard",
          {},
          navigator.clipboard.writeText(base + "/" + linkname),
          true
        );
      }
    },
  },
};
</script>
<style scoped>
amplify-s3-image {
  --height: 200px;
  --width: 400px;
}
.v-row {
    display: flex;
    flex-wrap: wrap;
    flex: 1 1 auto;
    margin: -12px;
}
.v-row--dense>.v-col, .v-row--dense>[class*=v-col-] {
    padding: 5px;
}
.response {
  flex: 0 0 100%;
  max-width: 100%;
}
@media (min-width: 600px){
  .response {
    flex: 0 0 50%;
    max-width: 50%;
    padding: 10px;
  }
}


</style>