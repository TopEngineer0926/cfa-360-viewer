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
        <v-card flat v-if="panos">
          <v-card-text>
            <v-select
              :items="panos"
              v-model="selectedProjectID"
              item-text="title"
              item-value="id"
              label="Select a project"
              solo
              @change="getProjectPermission"
            ></v-select>
            <v-data-table
              v-if="selectedProjectID"
              :headers="projectPermissionHeaders"
              :items="INDEXusers"
              :search="search"
              :items-per-page="500"
            >
              <template v-slot:[`item.projectAdmin`]="{ item }">
                <v-switch
                  v-model="item.projectAdmin"
                  @change="addProjectPermission(item, 'admin')"
                ></v-switch>
              </template>

              <template v-slot:[`item.projectEditor`]="{ item }">
                <v-switch
                  v-model="item.projectEditor"
                  @change="addProjectPermission(item, 'editor')"
                ></v-switch>
              </template>

              <template v-slot:[`item.projectViewer`]="{ item }">
                <v-switch
                  v-model="item.projectViewer"
                  @change="addProjectPermission(item, 'viewer')"
                ></v-switch>
              </template>
            </v-data-table>
          </v-card-text>
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
  createProjectPermission,
  updateProjectPermission,
} from "../graphql/mutations";
import {
  listPanos,
  listSitePermissions,
  getProjectPermission,
} from "../graphql/queries";

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

      panos: null,
      selectedProjectID: null,
      projectPermissionHeaders: [
        {
          text: "Name",
          align: "start",
          value: "fullname",
        },
        { text: "Email", value: "email" },
        { text: "Company", value: "company" },
        { text: "Permission", value: "permission" },
        { text: "Status", value: "status" },
        { text: "Set as Pano Project Admin", value: "projectAdmin" },
        { text: "Set as Pano Project Editor", value: "projectEditor" },
        { text: "Set as Pano Project Viewer", value: "projectViewer" },
      ],
      // panosCategoryList: [],
      // panosTitleList: [],
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
    loadPanos() {
      API.graphql(graphqlOperation(listPanos)).then((data) => {
        this.panos = data.data.listPanos.items;
        // this.panosCategoryList = this.panos.map((pano) => pano.category);
        // this.panosTitleList = this.panos.map((pano) => pano.title);
      });
    },
    async getProjectPermission() {
      this.projectPermission = (
        await API.graphql(
          graphqlOperation(getProjectPermission, { id: this.selectedProjectID })
        )
      ).data.getProjectPermission;
      console.log("projectPermission", this.projectPermission);
      if (this.projectPermission == null) {
        this.projectPermission = {
          id: this.selectedProjectID,
          admins: [],
          editors: [],
          viewers: [],
        };

        await API.graphql(
          graphqlOperation(createProjectPermission, {
            input: this.projectPermission,
          })
        );
      }
      this.updateProjectPermissionTable();
    },
    updateProjectPermissionTable() {
      this.INDEXusers.forEach((user) => {
        user.projectAdmin = this.projectPermission.admins.includes(
          user.username
        )
          ? true
          : false;
        user.projectEditor = this.projectPermission.editors.includes(
          user.username
        )
          ? true
          : false;
        user.projectViewer = this.projectPermission.viewers.includes(
          user.username
        )
          ? true
          : false;
      });
      this.$forceUpdate();
    },
    async addProjectPermission(user, type) {
      if (type == "admin") {
        if (user.projectAdmin) {
          this.projectPermission.admins.push(user.username);
        } else {
          this.projectPermission.admins = this.projectPermission.admins.filter(
            (username) => username !== user.username
          );
        }
      } else if (type == "editor") {
        if (user.projectEditor) {
          this.projectPermission.editors.push(user.username);
        } else {
          this.projectPermission.editors = this.projectPermission.editors.filter(
            (username) => username !== user.username
          );
        }
      } else if (type == "viewer") {
        if (user.projectViewer) {
          this.projectPermission.viewers.push(user.username);
        } else {
          this.projectPermission.viewers = this.projectPermission.viewers.filter(
            (username) => username !== user.username
          );
        }
      }

      await API.graphql({
        query: updateProjectPermission,
        variables: {
          input: this.projectPermission,
        },
      });
      this.updateProjectPermissionTable();
    },
  },
  watch: {
    tab: function (val) {
      if (val == 0) {
        if (!this.siteAdmins) {
          this.loadSiteAdmin();
        }
      } else if (val == 1) {
        this.loadPanos();
      }
    },
  },
};
</script>
 