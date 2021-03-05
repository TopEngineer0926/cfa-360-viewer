<template>
  <v-container v-if="panoSource">
    <v-row>
      <v-col>
        <v-text-field
          v-model="panoSource.title"
          require
          :rules="[(v) => !!v || 'Title is required']"
          label="Title"
        ></v-text-field>
        <v-text-field
          v-model="panoSource.ptype"
          require
          :rules="[(v) => !!v || 'Type is required']"
          label="Type"
        ></v-text-field>
        <v-text-field
          v-model="panoSource.psize"
          require
          :rules="[(v) => !!v || 'Size is required']"
          label="Size"
        ></v-text-field>
      </v-col>

      <v-col>
        <v-img
          :src="
            panoSource.thumbnail
              ? getImgUrl(panoSource.thumbnail)
              : 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='
          "
          height="200"
          max-width="500"
          class="white--text align-end grey"
        >
        </v-img>
      </v-col>
    </v-row>

    <v-row v-for="(scene, sceneIndex) in panoSource.sceneArr" :key="sceneIndex">
      {{ scene.title }}
      <v-row v-for="(spot, spotIndex) in scene.spots" :key="spotIndex">
        {{ spot.text }}
        <div v-if="spot.contents && spot.contents.length > 0">
          <v-row
            v-for="(content, contentIndex) in spot.contents"
            :key="contentIndex"
          >
            {{ content }}
          </v-row>
        </div>
      </v-row>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import { API, graphqlOperation, Storage } from "aws-amplify";
import { getPano, commentsBySpotId } from "../graphql/queries";
import { updatePano, createComment } from "../graphql/mutations";
// import { nanoid } from "nanoid";

export default {
  name: "Admin",
  components: {
    ContentDisplay: () => import("../components/ContentDisplay"),
  },
  data: function () {
    return {
      panoSource: null,
      spotStyles: [
        { text: "Product Detail", value: "detail" },
        { text: "Change Pano Image", value: "scene" },
      ],
      contentTypes: [
        { text: "Image", value: "img" },
        { text: "PDF", value: "pdf" },
        { text: "Youtube", value: "youtube" },
      ],
    };
  },
  created: function () {
    if (!this.user.admin) {
      this.$router.push({ path: "/panolist" });
    }
  },
  mounted() {
    API.graphql(graphqlOperation(getPano, { id: this.$route.params.id })).then(
      (data) => {
        if (data.data.getPano) {
          this.panoSource = data.data.getPano;
        } else {
          this.$router.push({ path: "/panolist" });
        }
      }
    );
  },
  methods: {
    deleteContent(content) {
      content.delete = true;
      this.$forceUpdate();
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
    async getImgUrl(link) {
      let url = await Storage.get(this.panoSource.id + "/" + link);
      console.log(url);
      return url;
    },
  },
  computed: {
    ...mapState(["user"]),
  },
};
</script>