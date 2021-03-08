<template>
  <v-container v-if="panoSource">
    <v-row>
      <v-col cols="4">
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

      <v-col cols="8">
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
    </v-row>
    <v-row>
      <v-col cols="4">
        <v-list>
          <v-list-group
            v-for="(scene, sceneIndex) in panoSource.sceneArr"
            :key="sceneIndex"
            :value="true"
            no-action
            sub-group
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>{{ scene.title }}</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="(spot, spotIndex) in scene.spots"
              :key="spotIndex"
              link
              @click="loadSpot(sceneIndex, spotIndex)"
            >
              <v-list-item-title v-text="spot.text"></v-list-item-title>
              <v-list-item-icon>
                <v-icon>mdi-tag-outline</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-group>
        </v-list>
      </v-col>

      <v-col v-if="spot" cols="8">
        <v-card flat>
          <v-card-text>
            <v-row align="center" justify="center">
              <v-text-field
                v-model="spot.text"
                require
                :rules="[(v) => !!v || 'Title is required']"
                label="Tag Title"
              ></v-text-field>
            </v-row>
            <v-row align="center" justify="center">
              <v-textarea
                v-model="spot.about"
                label="Description"
                auto-grow
                :rows="1"
              ></v-textarea
            ></v-row>
            <div v-if="spot.contents && spot.contents.length > 0">
              <div
                v-for="(content, contentIndex) in spot.contents"
                :key="contentIndex"
                class="mt-4"
              >
                <v-row align="center" justify="center">
                  <v-col>
                    <ContentDisplay
                      :content="content"
                      :panoID="panoSource.id"
                    ></ContentDisplay
                  ></v-col>
                </v-row>

                <v-row class="mt-2" align="center" justify="center">
                  <v-text-field
                    v-model="content.name"
                    label="Content Name"
                  ></v-text-field>
                  <v-btn
                    icon
                    @click="deleteContentIndex(spot, contentIndex)"
                    class="ml-4"
                    ><v-icon>mdi-delete-outline </v-icon>
                  </v-btn>
                </v-row>
              </div>
            </div>
            <v-divider class="ma-8"></v-divider>
            <v-row>
              <v-col>
                <v-select
                  v-model="newContent.type"
                  :items="contentTypes"
                  label="Type"
                ></v-select
              ></v-col>
              <v-col>
                <v-text-field
                  label="video Id"
                  v-model="newContent.link"
                  v-if="newContent.type == 'youtube'"
                ></v-text-field>
                <v-file-input
                  v-else
                  v-model="newContent.link"
                  label="Select File"
                ></v-file-input>
              </v-col>
            </v-row>
            <v-row>
              <v-text-field
                v-model="newContent.name"
                label="Content Name"
              ></v-text-field>
              <v-btn block @click="addNewContent">Add Content</v-btn></v-row
            >

            <div v-if="comments" class="mt-12">
              <h2 class="text-center">Comments</h2>
              <div v-for="(comment, index) in comments" :key="index">
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
          </v-card-text>
        </v-card>
      </v-col>
      <v-col v-else cols="8"></v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import { API, graphqlOperation, Storage } from "aws-amplify";
import { getPano, commentsBySpotId } from "../graphql/queries";
import { updatePano } from "../graphql/mutations";
import { nanoid } from "nanoid";

export default {
  name: "Admin",
  components: {
    ContentDisplay: () => import("../components/ContentDisplay"),
  },
  data: function () {
    return {
      panoSource: null,
      spot: null,
      comments: null,
      spotStyles: [
        { text: "Product Detail", value: "detail" },
        { text: "Change Pano Image", value: "scene" },
      ],
      contentTypes: [
        { text: "Image", value: "img" },
        { text: "PDF", value: "pdf" },
        { text: "Youtube", value: "youtube" },
      ],
      newContent: {
        type: "img",
        name: null,
        thumbnail: null,
        link: null,
      },
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
    deleteContentIndex(spot, contentIndex) {
      spot.contents.splice(contentIndex, 1);
      this.savePano();
      //   this.$forceUpdate();
    },
    loadSpot(sceneIndex, spotIndex) {
      this.spot = this.panoSource.sceneArr[sceneIndex].spots[spotIndex];
      this.getComments();
    },

    async getComments() {
      this.comments = (
        await API.graphql(
          graphqlOperation(commentsBySpotId, {
            spotID: this.spot.id,
            sortDirection: "DESC",
            // limit: 10,
          })
        )
      ).data.commentsBySpotID.items;
      console.log(this.comments);
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
      if (this.newContent.type !== "youtube") {
        this.newContent.link = (
          await Storage.put(
            this.panoSource.id + "/" + nanoid(),
            this.newContent.file,
            {
              contentType: this.newContent.file.type,
              metadata: {
                user: this.user.email,
                type: "spotDetail",
              },
            }
          )
        ).key.split("/")[1];
      }
      delete this.newContent.file;
      this.savePano();
      this.newContent = {
        type: "img",
        name: null,
        thumbnail: null,
        file: null,
        link: null,
      };
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