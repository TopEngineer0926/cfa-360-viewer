<template>
  <div v-if="pano">
    <v-pannellum
      v-if="pano.imgUrl"
      :pano="pano"
      style="height: 85vh"
    ></v-pannellum>

    <v-img
      v-else
      :style="{ 'max-height': '70vh' }"
      src="data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="
    />

    <v-container>
      <v-btn
        color="primary"
        dark
        @click="
          editPano.dialog = true;
          editPano.title = pano.title;
        "
      >
        Edit
      </v-btn>

      <v-dialog
        v-if="editPano.dialog"
        v-model="editPano.dialog"
        persistent
        max-width="600"
      >
        <v-card>
          <v-card-title class="headline"> Edit </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="editValid" lazy-validation>
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
                label="Select thumbnail"
              ></v-file-input>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="savePano"> Save </v-btn>
            <v-btn color="grey" text @click="editPano.dialog = false">
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import { API, graphqlOperation, Storage } from "aws-amplify";
import { getPano } from "../graphql/queries";
import { updatePano } from "../graphql/mutations";
import { nanoid } from "nanoid";
import { mapState } from "vuex";
import Compressor from "compressorjs";
// import awsconfig from "@/aws-exports";

export default {
  name: "Pano",
  components: {
    "v-pannellum": () => import("@/components/Pannellum.vue"),
  },
  computed: mapState(["user"]),
  data: function () {
    return {
      pano: null,
      editValid: false,
      editPano: {
        dialog: false,
        title: null,
        imgToUpload: null,
        thumbnailToUpload: null,
      },
    };
  },
  mounted() {
    API.graphql(graphqlOperation(getPano, { id: this.$route.params.id })).then(
      async (data) => {
        let panoData = data.data.getPano;
        if (panoData) {
          if (panoData.img) {
            panoData.imgUrl = await Storage.get(panoData.img, {
              level: "protected",
            });
          }
          this.pano = panoData;
          console.log("getPano", this.pano);
        } else {
          this.$router.push({ path: "/panolist" });
        }
      }
    );
  },

  methods: {
    async savePano() {
      if (this.$refs.form.validate()) {
        let newPano = {
          id: this.pano.id,
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
          if (this.pano.img) {
            Storage.remove(this.pano.img, { level: "protected" });
          }
        }

        if (
          !this.editPano.thumbnailToUpload &&
          !this.pano.thumbnail &&
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
          if (this.pano.thumbnail) {
            Storage.remove(this.pano.thumbnail, { level: "protected" });
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
