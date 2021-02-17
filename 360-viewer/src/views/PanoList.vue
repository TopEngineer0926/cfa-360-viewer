<template>
  <v-container>
    <v-row justify="center" class="my-4">
      <v-btn v-if="user.admin" color="primary" @click="createPanoFunc"
        >Create</v-btn
      >
    </v-row>

    <div v-if="panos" class="d-flex flex-wrap justify-center">
      <div v-for="(pano, index) in panos" :key="index">
        <v-hover v-slot="{ hover }">
          <v-card
            :elevation="hover ? 12 : 2"
            class="ma-6"
            width="500"
            height="200"
            @click="$router.push('/pano/' + pano.id)"
          >
            <v-img
              :src="
                pano.thumbnail
                  ? pano.thumbnailUrl
                  : 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='
              "
              height="200"
              max-width="500"
              class="white--text align-end grey"
            >
              <v-card-title v-text="pano.title"></v-card-title>
            </v-img>

            <!-- <v-card-text> {{ pano.title }}</v-card-text> -->
          </v-card>
        </v-hover>
        <div v-if="user.admin" class="mb-6">
          <v-btn icon @click="deletePanoConfirm(index)" class="ml-4"
            ><v-icon>mdi-delete-outline </v-icon>
          </v-btn>
          <v-btn
            icon
            @click="
              editPano.dialog = true;
              editPano.index = index;
              editPano.title = pano.title;
            "
          >
            <v-icon>mdi-pencil-outline</v-icon>
          </v-btn>
        </div>
      </div>
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
              v-model="editPano.title"
              require
              :rules="[(v) => !!v || 'Title is required']"
              label="Title"
            ></v-text-field>
            <v-file-input
              v-model="editPano.imgToUpload"
              accept="image/*"
              label="Select panorama image"
            ></v-file-input>
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
  </v-container>
</template>

<script>
import { API, graphqlOperation, Storage } from "aws-amplify";
import { createPano, deletePano } from "../graphql/mutations";
import { listPanos } from "../graphql/queries";
import { mapState } from "vuex";

import { updatePano } from "../graphql/mutations";
import { nanoid } from "nanoid";
import Compressor from "compressorjs";

export default {
  name: "Pano",
  data: function () {
    return {
      panos: null,
      editPano: {
        index: null,
        editValid: false,
        dialog: false,
        title: null,
        imgToUpload: null,
        thumbnailToUpload: null,
      },
    };
  },
  computed: mapState(["user"]),
  created() {
    API.graphql(graphqlOperation(listPanos)).then(async (data) => {
      let panosRes = data.data.listPanos.items;
      //Get thumbnail URL
      await Promise.all(
        panosRes.map(async (pano) => {
          if (pano.thumbnail) {
            pano.thumbnailUrl = await Storage.get(pano.thumbnail, {
              level: "protected",
            });
          }
          return pano;
        })
      );
      this.panos = panosRes;
    });
  },
  methods: {
    async createPanoFunc() {
      try {
        let newPanoId = await API.graphql(
          graphqlOperation(createPano, {
            input: { title: "New Scene" },
          })
        );
        this.$router.push({ path: "/pano/" + newPanoId.data.createPano.id });
      } catch (error) {
        console.error("createPano", error);
      }
    },
    deletePanoFunc(index) {
      //delete img, thumbnail
      if (this.panos[index].img) {
        Storage.remove(this.panos[index].img, { level: "protected" });
      }
      if (this.panos[index].thumbnail) {
        Storage.remove(this.panos[index].thumbnail, { level: "protected" });
      }
      //delete pano
      API.graphql(
        graphqlOperation(deletePano, {
          input: { id: this.panos[index].id },
        })
      );
      this.panos.splice(index, 1);
    },
    async deletePanoConfirm(index) {
      if (
        await this.$root.$confirm(
          `Delete ${this.panos[index].title}?`,
          "This action cannot be undone. This scene will be deleted permanently.",
          { color: this.$vuetify.theme.currentTheme.primary }
        )
      ) {
        this.$root.$dialogLoader.start(
          "Deleted Successfully",
          {},
          () => {
            this.deletePanoFunc(index);
          },
          true
        );
      }
    },
    async savePano() {
      if (this.$refs.form.validate()) {
        let newPano = {
          id: this.panos[this.editPano.index].id,
          title: this.editPano.title,
        };

        if (this.editPano.imgToUpload) {
          let imgId = nanoid();
          let key = `${this.pano.id}/${imgId}`;
          newPano.img = (
            await Storage.put(key, this.editPano.imgToUpload, {
              level: "protected",
              contentType: this.editPano.imgToUpload.type,
              metadata: { user: this.user.email },
            })
          ).key;
          //delete org img
          if (this.panos[this.editPano.index].img) {
            Storage.remove(this.pano.img, { level: "protected" });
          }
        }

        if (
          !this.editPano.thumbnailToUpload &&
          !this.panos[this.editPano.index].thumbnail &&
          this.editPano.imgToUpload
        ) {
          this.editPano.thumbnailToUpload = this.editPano.imgToUpload;
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
          let key = `${this.pano.id}/${imgId}`;
          newPano.thumbnail = (
            await Storage.put(key, compressedThumbnail, {
              level: "protected",
              contentType: compressedThumbnail.type,
              metadata: { user: this.user.email },
            })
          ).key;
          //delete org img
          if (this.panos[this.editPano.index].thumbnail) {
            Storage.remove(this.panos[this.editPano.index].thumbnail, {
              level: "protected",
            });
          }
        }

        await API.graphql({
          query: updatePano,
          variables: {
            input: newPano,
          },
        });
        this.editPano.dialog = false;
        this.$router.go();
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
</style>