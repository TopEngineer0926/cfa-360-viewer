<template>
  <div v-if="pano">
    <!-- <v-pannellum
      v-if="pano.img"
      :pano="pano"
      style="height: 85vh"
    ></v-pannellum> -->
    <amplify-s3-image v-if="pano.img" level="protected" :img-key="pano.img" />

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
          editDialog = true;
          editTitle = pano.title;
        "
      >
        Edit
      </v-btn>

      <v-dialog
        v-if="editDialog"
        v-model="editDialog"
        persistent
        max-width="600"
      >
        <v-card>
          <v-card-title class="headline"> Edit </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="editValid" lazy-validation>
              <v-text-field
                v-model="editTitle"
                require
                :rules="[(v) => !!v || 'Title is required']"
                label="Title"
              ></v-text-field>
              <v-file-input
                v-model="imgToUpload"
                accept="image/*"
                label="Select image"
              ></v-file-input>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="savePano"> Save </v-btn>
            <v-btn color="grey" text @click="editDialog = false">
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
// import awsconfig from "@/aws-exports";

export default {
  name: "Pano",
  components: {
    // "v-pannellum": () => import("@/components/Pannellum.vue"),
  },
  data: function () {
    return {
      pano: null,
      editDialog: false,
      editValid: false,
      imgToUpload: null,
      editTitle: null,
    };
  },
  mounted() {
    API.graphql(graphqlOperation(getPano, { id: this.$route.params.id })).then(
      (data) => {
        if (data.data.getPano) {
          this.pano = data.data.getPano;
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
          title: this.editTitle,
        };

        if (this.imgToUpload) {
          let imgId = nanoid();
          let key = `panos/${imgId}`;
          newPano.img = (
            await Storage.put(key, this.imgToUpload, {
              level: "protected",
              contentType: this.imgToUpload.type,
              metadata: { panoid: this.pano.id },
            })
          ).key;

          //delete org img
          if (this.pano.img) {
            Storage.remove(this.pano.img, { level: "protected" });
          }
        }

        await API.graphql({
          query: updatePano,
          variables: {
            input: newPano,
          },
        });
        this.editDialog = false;
        this.$router.go();
      }
    },
  },
};
</script>
