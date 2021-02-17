<template>
  <div>
    <div class="vue-pannellum">
      <div class="default-slot">
        <v-card class="ml-4" width="256">
          <v-navigation-drawer permanent>
            <v-system-bar>Layers</v-system-bar>

            <v-divider></v-divider>
            <v-list nav dense>
              <v-list-item-group v-model="currentLayer" color="primary">
                <v-list-item v-for="(item, i) in items" :key="i">
                  <v-list-item-icon>
                    <v-icon> mdi-layers </v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title v-text="item.text"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-navigation-drawer>
        </v-card>
        <div class="mb-8 ml-4 mt-4">
          <v-btn small @click="addTagConfig">Add Tag</v-btn>
        </div>
      </div>
    </div>
    <v-dialog
      v-if="specsDialog.dialog"
      v-model="specsDialog.dialog"
      transition="dialog-bottom-transition"
      max-width="800"
    >
      <v-card>
        <v-toolbar color="#E0E0E0">
          <v-toolbar-title> {{ specsDialog.content.title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn icon dark @click="specsDialog.dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-img height="250" contain :src="specsDialog.content.img" class="mt-2">
        </v-img>
        <v-card-title> Description </v-card-title>
        <v-card-text>
          {{ specsDialog.content.text }}
          <youtube video-id="8Uix_ZQ7qRw" ref="youtube"></youtube>
        </v-card-text>
        <!-- <v-divider></v-divider> -->
        <v-card-title> Comments </v-card-title>

        <v-card-text>
          <v-list three-line>
            <template v-for="(item, index) in specsDialog.comments">
              <v-subheader
                v-if="item.header"
                :key="index"
                v-text="item.header"
              ></v-subheader>
              <v-list-item :key="index">
                <v-list-item-avatar>
                  <v-img :src="item.avatar"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-html="item.title"></v-list-item-title>
                  <v-list-item-subtitle
                    v-html="item.subtitle"
                  ></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider :key="index"></v-divider>
            </template>
          </v-list>
          <v-row>
            <v-col cols="1">
              <v-list-item-avatar class="ml-4">
                <v-img
                  src="https://cdn.vuetifyjs.com/images/lists/5.jpg"
                ></v-img
              ></v-list-item-avatar>
            </v-col>
            <v-col class="ml-2">
              <v-textarea
                v-model="specsDialog.newComment"
                label="Add Comment"
                auto-grow
              ></v-textarea>
            </v-col>
            <v-col cols="2" align-self="center">
              <v-btn @click="addComment">Add</v-btn>
            </v-col>
          </v-row>
        </v-card-text>
        <!-- <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="specsDialog.dialog = false">
            Close
          </v-btn>
        </v-card-actions> -->
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import "pannellum";
import "pannellum/build/pannellum.css";
export default {
  props: {
    pano: { type: Object, required: true },
  },
  data() {
    return {
      viewer: null,
      specsDialog: {
        content: null,
        comments: null,
        dialog: false,
        newComment: null,
      },
      currentLayer: 0,
      items: [
        { text: "Layer 1" },
        { text: "Layer 2" },
        { text: "Layer 3" },
        { text: "Layer 4" },
        { text: "Layer 5" },
      ],
    };
  },
  created() {
    this.loadPano();
  },
  mounted() {
    this.viewer = window.pannellum.viewer(this.$el, {
      type: "equirectangular",
      name: this.pano.title,
      panorama: this.pano.imgUrl,
      autoLoad: true,
    });
  },
  methods: {
    loadPano() {
      // for (let scene in this.pano.scenes) {} this.pano.scenes[scene].hotSpots.forEach((spot) => {
      if (this.pano.hotSpots) {
        this.pano.hotSpots.forEach((spot) => {
          if (spot.data) {
            spot.clickHandlerFunc = () => {
              this.specsDialog.newComment = null;
              this.specsDialog.dialog = true;
              this.specsDialog.content = spot.data;
              this.specsDialog.comments = spot.comments;
            };
          }
        });
      }
    },
    addComment() {
      this.specsDialog.comments.push({
        avatar: "https://cdn.vuetifyjs.com/images/lists/5.jpg",
        title: "current user",
        subtitle: this.specsDialog.newComment,
      });
      this.specsDialog.newComment = null;
    },
    addTagConfig() {
      this.viewer.on("mousedown", this.mouseDownHandler);
    },
    mouseDownHandler(event) {
      let coords = this.viewer.mouseEventToCoords(event);
      // let pitch = this.viewer.getPitch();
      // let yaw = this.viewer.getYaw();
      // let hfov = this.viewer.getHfov();

      // console.log("pitch, yaw, hfov", pitch, yaw, hfov);
      console.log("coords", coords);
      let newSpot = {
        pitch: coords[0],
        yaw: coords[1],
        type: "info",
        text: "VIATechnik",
        data: {
          title: "Hospital Bed",
          text:
            "When a person is looking to find the right hospital bed, they must be aware of the available hospital bed dimensions. Many different hospital bed sizes are available on the market. AvaCare Medical has some of the best manual and electric hospital beds, made by the top manufacturers in the medical equipment industry, and we are happy to share all of the most important information about them with you!",
          img:
            "https://mltj3vd7pfrs.i.optimole.com/Esa3E_0-VV-eGMC8/w:auto/h:auto/q:auto/https://www.lsmed.eu/wp-content/uploads/ScanAfia-XTK-01.jpg",
        },
        comments: [
          {
            avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
            title: "William",
            subtitle: `I'll be in your neighborhood doing errands this weekend. Do you want to hang out?`,
          },
          {
            avatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
            title: "James",
            subtitle: `Wish I could come, but I'm out of town this weekend.`,
          },
          {
            avatar: "https://cdn.vuetifyjs.com/images/lists/3.jpg",
            title: "Harper",
            subtitle: "Do you have Paris recommendations? Have you ever been?",
          },
          {
            avatar: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
            title: "Evelyn",
            subtitle:
              "Have any ideas about what we should get Heidi for her birthday?",
          },
        ],
      };
      newSpot.clickHandlerFunc = () => {
        this.specsDialog.newComment = null;
        this.specsDialog.dialog = true;
        this.specsDialog.content = newSpot.data;
        this.specsDialog.comments = newSpot.comments;
      };

      this.viewer.addHotSpot(newSpot);
      this.viewer.off("mousedown", this.mouseDownHandler);
    },
    // addHotspot(event) {
    //   this.viewer.mouseEventToCoords(event);
    // },
  },
  beforeDestroy() {
    this.viewer.destroy();
  },
};
</script>

<style>
.panoTip {
  white-space: pre-line;
}

.pnlm-panorama-info {
  bottom: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0) !important;
  text-transform: capitalize;
}
</style>

<style scoped>
.top-slot {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
}
.default-slot {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  width: 150px;
}
</style>
