<template>
  <v-container v-if="panoSource">
    <h2 class="text-center mb-6">Project Editor</h2>
    <v-row>
      <v-col cols="4">
        <S3ImgDisplay
          :src="panoSource.thumbnail"
          :panoID="panoSource.id"
        ></S3ImgDisplay>
      </v-col>

      <v-col cols="8">
        <v-text-field
          v-model="panoSource.category"
          require
          :rules="[(v) => !!v || 'Category is required']"
          label="Category"
          @change="savePano"
        ></v-text-field>
        <v-text-field
          v-model="panoSource.title"
          require
          :rules="[(v) => !!v || 'Title is required']"
          label="Title"
          @change="savePano"
        ></v-text-field>
        <v-text-field
          v-model="panoSource.ptype"
          require
          :rules="[(v) => !!v || 'Type is required']"
          label="Type"
          @change="savePano"
        ></v-text-field>
        <v-text-field
          v-model="panoSource.psize"
          require
          :rules="[(v) => !!v || 'Size is required']"
          label="Size"
          @change="savePano"
        ></v-text-field>

        <v-file-input
          v-model="thumbnailToUpload"
          accept="image/*"
          label="Upload thumbnail"
          @change="uploadThumbnail"
        ></v-file-input>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4">
        <h3
          v-if="panoSource.sceneArr && panoSource.sceneArr.length > 0"
          class="text-center"
        >
          Tag Selector
        </h3>
        <v-text-field v-model="spotsSearch" label="Search"></v-text-field>

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
            <div v-for="(spot, spotIndex) in scene.spots" :key="spotIndex">
              <v-list-item
                link
                @click="loadSpot(sceneIndex, spotIndex)"
                v-if="
                  spot.style == 'detail' &&
                  (spotsSearch == '' || spot.text.includes(spotsSearch))
                "
              >
                <v-list-item-title v-text="spot.text"></v-list-item-title>
                <v-list-item-icon>
                  <v-icon>mdi-tag-outline</v-icon>
                </v-list-item-icon>
              </v-list-item>
            </div>
          </v-list-group>
        </v-list>
      </v-col>

      <v-col v-if="spot" cols="8">
        <h3 class="text-center">Tag Detail</h3>
        <v-card flat>
          <v-card-text>
            <v-row align="center" justify="center">
              <v-text-field
                v-model="spot.text"
                require
                :rules="[(v) => !!v || 'Title is required']"
                label="Tag Title"
                @change="savePano"
              ></v-text-field>
            </v-row>
            <v-row align="center" justify="center">
              <v-textarea
                v-model="spot.about"
                label="Description"
                auto-grow
                :rows="1"
                @change="savePano"
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
                    @change="savePano"
                  ></v-text-field>
                  <v-btn
                    icon
                    @click="deleteContentIndex(contentIndex)"
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
                  v-model="newContent.file"
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

            <div v-if="comments && comments.length > 0" class="mt-12">
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
    <v-row justify="center" class="ma-8">
      <v-btn @click="$router.push('/panolist').catch((err) => {})"
        >Return</v-btn
      ></v-row
    >
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import { API, graphqlOperation, Storage } from "aws-amplify";
import { getPano, commentsBySpotId } from "../graphql/queries";
import { updatePano } from "../graphql/mutations";
import { nanoid } from "nanoid";
import Compressor from "compressorjs";

export default {
  name: "Admin",
  components: {
    ContentDisplay: () => import("../components/ContentDisplay"),
    S3ImgDisplay: () => import("../components/S3ImgDisplay"),
  },
  data: function () {
    return {
      savePanoTimer: null,
      panoSource: null,
      spot: null,
      spotsSearch: "",
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
        file: null,
      },
      thumbnailToUpload: null,
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
    async uploadThumbnail() {
      if (this.thumbnailToUpload) {
        //delete org img
        if (this.panoSource.thumbnail) {
          Storage.remove(this.panoSource.id + "/" + this.panoSource.thumbnail);
        }

        //Compressor
        let compressedThumbnail = await new Promise((resolve, reject) => {
          new Compressor(this.thumbnailToUpload, {
            quality: 0.7,
            maxHeight: 512,
            maxWidth: 512,
            success: resolve,
            error: reject,
          });
        });

        this.panoSource.thumbnail = (
          await Storage.put(
            this.panoSource.id + "/" + nanoid(),
            compressedThumbnail,
            {
              contentType: compressedThumbnail.type,
              metadata: {
                user: this.user.email,
                type: "thumbnail",
              },
            }
          )
        ).key.split("/")[1];

        this.savePano();
        this.thumbnailToUpload = null;
      }
    },

    deleteContentIndex(contentIndex) {
      this.spot.contents.splice(contentIndex, 1);
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
      if (!this.spot.contents) {
        this.spot.contents = [];
      }
      this.spot.contents.push(this.newContent);
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
  // watch: {
  //   panoSource: function () {
  //     if (this.savePanoTimer) {
  //       clearTimeout(this.savePanoTimer);
  //       this.savePanoTimer = null;
  //     }
  //     this.savePanoTimer = setTimeout(() => {
  //       this.savePano;
  //     }, 1000);
  //   },
  // },
};
</script>