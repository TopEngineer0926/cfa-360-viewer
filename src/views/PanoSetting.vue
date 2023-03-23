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
        ></v-text-field>
        <v-text-field
          v-model="panoSource.prototypeName"
          require
          :rules="[(v) => !!v || 'Prototype Name is required']"
          label="Prototype Name"
        ></v-text-field>
        <v-text-field
          v-model="panoSource.prototypeEdition"
          require
          :rules="[(v) => !!v || 'Template Release is required']"
          label="Template Release"
        ></v-text-field>
        <v-text-field
          v-model="panoSource.description"
          require
          :rules="[(v) => !!v || 'Description is required']"
          label="Description"
        ></v-text-field>

        <v-file-input
          v-model="thumbnailToUpload"
          accept="image/*"
          label="Upload thumbnail"
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
            <div v-for="(spot, spotIndex) in scene.spots" :key="spotIndex" style = "margin-left: 32px;">
              <v-list-item
                link
                @click="loadSpot(sceneIndex, spotIndex)"
                v-if="
                  spot.style == 'detail' &&
                  (spotsSearch == '' ||
                    spot.text.toLowerCase().includes(spotsSearch.toLowerCase()))
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
    <v-row justify="center" class="ma-8" style="gap: 20px">
      <v-btn @click="confirmPanoDlg = true">Create</v-btn>
      <v-btn @click="$router.push('/panolist').catch((err) => {})">Return</v-btn>
    </v-row>

    <v-dialog
      v-if="confirmPanoDlg"
      v-model="confirmPanoDlg"
      persistent
      max-width="350"
    >
      <v-card>
        <v-card-title class="headline"> Create Pano </v-card-title>
        <v-card-text>Are you sure to create new pano ?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="savePano"
          >
            Confirm
          </v-btn>
          <v-btn color="grey" text @click="confirmPanoDlg = false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
      confirmPanoDlg: false
    };
  },
  created: function () {
    this.$store.commit("SET_NAVBAR_TEXT", null);
    if (!this.user.siteAdmin) {
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
    async savePano() {
      console.log("save", this.panoSource);
      await this.uploadThumbnail();
      await API.graphql({
        query: updatePano,
        variables: {
          input: this.panoSource,
        },
      });

      var FileURL = location.protocol + "//" + location.host + "/white.png";
      let vm = this;
      this.GetFileObjectFromURL(FileURL, function (fileObject) {
        Storage.put(
          vm.panoSource.id + "/plan_image",
          fileObject,
          {
            contentType: "image/png"
          }
        )
      });

      this.$router.push('/panolist').catch((err) => {})
      // this.$router.go();
    },
    GetFileBlobUsingURL(url, convertBlob) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.addEventListener('load', function() {
            convertBlob(xhr.response);
        });
        xhr.send();
    },
    blobToFile(blob, name) {
        blob.lastModifiedDate = new Date();
        blob.name = name;
        return blob;
    },
    GetFileObjectFromURL(filePathOrUrl, convertBlob) {
      let vm = this;
       this.GetFileBlobUsingURL(filePathOrUrl, function (blob) {
          convertBlob(vm.blobToFile(blob, 'testFile.png'));
       });
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