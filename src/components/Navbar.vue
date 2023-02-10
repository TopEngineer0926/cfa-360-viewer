<template>
  <v-app-bar app flat dense color="white">
    <v-img
      :src="require('@/assets/logo.png')"
      max-width="70"
      class="mb-2"
      @click="$router.push('/panolist').catch((err) => {})"
      :style="{ cursor: 'pointer' }"
    />

    <v-row v-if="navbarText" class="ml-6" align="center">
      <v-col cols="auto">
        <h3>{{ navbarText.prototypeName }}</h3>
      </v-col>

      <v-col cols="auto">
        Template Release:
        {{ navbarText.prototypeEdition }}
      </v-col>

      <v-col cols="auto" v-if="navbarText.Description">
        Description:
        {{ navbarText.Description }}
      </v-col>

      <v-col cols="auto">
        <v-dialog v-model="INDEXdialog" persistent>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              text
              v-bind="attrs"
              v-on="on"
              v-show="false"
              @click="getIndexDesignInventory()"
            >
              Related Projects
            </v-btn>
          </template>

          <v-card>
            <v-card-title class="headline grey lighten-2">
              Related Projects in Design Inventory
            </v-card-title>

            <v-card-text v-if="INDEXprojects">
              <v-data-table
                :headers="headers"
                :items="INDEXprojects"
                disable-pagination
                hide-default-footer
              ></v-data-table>
            </v-card-text>
            <v-card-text v-else> Searching... </v-card-text>
            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="INDEXdialog = false">
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <div v-else>
      <v-btn
        text
        @click="$router.push('/panolist').catch((err) => {})"
        class="ml-4"
        >Gallery</v-btn
      >

      <v-btn
        v-if="user.masterSiteAdmin || user.siteAdmin"
        text
        @click="$router.push('/admin').catch((err) => {})"
        >Admin</v-btn
      >
    </div>

    <v-spacer />

    {{ user.name }}
    <v-chip v-if="user.masterSiteAdmin" color="primary" class="ml-2" small>
      Master Site Admin
    </v-chip>
    <v-chip v-else-if="user.siteAdmin" color="primary" class="ml-2" small>
      Site Admin
    </v-chip>
    <v-btn text @click="logout">Logout</v-btn>
  </v-app-bar>
</template>
<script>
import { mapState } from "vuex";
import { API } from "aws-amplify";
export default {
  name: "Nav",
  data: function () {
    return {
      INDEXprojects: null,
      INDEXdialog: false,
      headers: [
        {
          text: "Store",
          align: "start",
          value: "projectName",
        },
        { text: "Store #", value: "projectNumber" },
        { text: "Project Issuance Date", value: "projectIssueDate" },
        { text: "Store Address", value: "cfaAddress1" },
        { text: "City", value: "cfaCity" },
        { text: "County", value: "cfaCounty" },
      ],
    };
  },
  methods: {
    async logout() {
      await this.$store.dispatch("logout");
      this.$router.push("/");
    },
    getIndexDesignInventory() {
      this.INDEXprojects = null;
      API.post("index", "/index/design-inventory", {
        body: {
          prototypeName: this.navbarText.prototypeName,
          prototypeEdition: this.navbarText.prototypeEdition,
        },
      }).then((res) => {
        console.log(res);
        this.INDEXprojects = res.filter(
          (project) => project.projectNumber !== "00000"
        );
      });
    },
  },
  computed: mapState(["user", "navbarText"]),
};
</script>
