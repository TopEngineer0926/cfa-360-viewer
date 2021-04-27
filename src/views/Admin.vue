<template>
  <v-container v-if="INDEXusers">
    <v-tabs v-model="tab" align-with-title>
      <v-tabs-slider color="primary"></v-tabs-slider>

      <v-tab> Site Admin </v-tab>

      <v-tab> Project Permissions </v-tab>

      <v-tab> Role Definitions </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
            <v-data-table
              :headers="siteAdminHeaders"
              :items="INDEXusers"
              :search="search"
              :items-per-page="500"
            >
              <template v-slot:[`item.siteAdmin`]="{ item }">
                <v-switch
                  v-model="item.siteAdmin"
                  @change="addSitePermission(item)"
                ></v-switch>
              </template> </v-data-table
          ></v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>2</v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>3</v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import { API, graphqlOperation } from "aws-amplify";
import { mapState } from "vuex";
import {
  createSitePermission,
  deleteSitePermission,
} from "../graphql/mutations";
import { listSitePermissions } from "../graphql/queries";

// import { updatePano } from "../graphql/mutations";
// import { nanoid } from "nanoid";

export default {
  name: "Admin",

  data: function () {
    return {
      INDEXusers: null,
      siteAdmins: null,
      tab: null,
      search: "",
      siteAdminHeaders: [
        {
          text: "Name",
          align: "start",
          value: "fullname",
        },
        { text: "Email", value: "email" },
        { text: "Company", value: "company" },
        { text: "Permission", value: "permission" },
        { text: "Status", value: "status" },
        { text: "Set as Pano App Admin", value: "siteAdmin" },
      ],
    };
  },
  computed: mapState(["user"]),
  created() {
    this.$store.commit("SET_NAVBAR_TEXT", null);
    API.get("index", "/index/users").then((usersData) => {
      this.INDEXusers = usersData;
    });
  },
  methods: {
    async loadSiteAdmin() {
      this.siteAdmins = (
        await API.graphql(graphqlOperation(listSitePermissions))
      ).data.listSitePermissions.items;
      let siteAdminsEmail = this.siteAdmins.map((admin) => admin.id);
      this.INDEXusers.forEach((user) => {
        if (siteAdminsEmail.includes(user.username)) {
          user.siteAdmin = true;
        } else {
          user.siteAdmin = false;
        }
      });
      this.$forceUpdate();
    },
    async addSitePermission(user) {
      if (user.siteAdmin) {
        await API.graphql(
          graphqlOperation(createSitePermission, {
            input: { id: user.username },
          })
        );
      } else {
        await API.graphql(
          graphqlOperation(deleteSitePermission, {
            input: { id: user.username },
          })
        );
      }
    },
  },
  watch: {
    tab: function (val) {
      if (val == 0) {
        console.log("Site Admin Tab");
        if (!this.siteAdmins) {
          this.loadSiteAdmin();
        }
      }
    },
  },
};
</script>
 