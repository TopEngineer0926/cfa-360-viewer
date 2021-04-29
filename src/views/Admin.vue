<template>
  <v-container v-if="INDEXusers">
    <v-tabs v-model="tab" align-with-title>
      <v-tabs-slider color="primary"></v-tabs-slider>

      <v-tab
        v-show="
          (user.siteAdmin &&
            roleDefinitionTable.find((role) => role.name == 'Site Admin')
              .assignSiteAdmin) ||
          user.masterSiteAdmin
        "
      >
        Site Admin
      </v-tab>

      <v-tab> Project Permissions </v-tab>

      <v-tab
        v-show="
          (user.siteAdmin &&
            roleDefinitionTable.find((role) => role.name == 'Site Admin')
              .adjustRole) ||
          user.masterSiteAdmin
        "
      >
        Role Definitions
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item
        v-show="
          (user.siteAdmin &&
            roleDefinitionTable.find((role) => role.name == 'Site Admin')
              .assignSiteAdmin) ||
          user.masterSiteAdmin
        "
      >
        <v-card flat>
          <v-card-text>
            <v-row>
              <v-col> </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                  solo
                ></v-text-field>
              </v-col>
            </v-row>

            <v-data-table
              :headers="siteAdminHeaders"
              :items="INDEXusers"
              :search="search"
              :items-per-page="500"
            >
              <template v-slot:[`item.siteAdmin`]="{ item }">
                <v-checkbox
                  v-model="item.siteAdmin"
                  @change="addSitePermission(item)"
                ></v-checkbox>
              </template> </v-data-table
          ></v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat v-if="panos">
          <v-card-text>
            <v-row>
              <v-col>
                <v-select
                  :items="panos"
                  v-model="selectedProjectID"
                  item-text="title"
                  item-value="id"
                  label="Select a project"
                  solo
                  @change="getProjectPermission"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                  solo
                ></v-text-field>
              </v-col>
            </v-row>

            <v-data-table
              v-if="selectedProjectID"
              :headers="projectPermissionHeaders"
              :items="INDEXusers"
              :search="search"
              :items-per-page="500"
            >
              <template v-slot:[`item.projectAdmin`]="{ item }">
                <v-checkbox
                  v-model="item.projectAdmin"
                  :disabled="
                    !(
                      user.siteAdmin &&
                      roleDefinitionTable.find(
                        (role) => role.name == 'Site Admin'
                      ).assignSiteAdmin
                    ) && !user.masterSiteAdmin
                  "
                  @change="addProjectPermission(item, 'admin')"
                ></v-checkbox>
              </template>

              <template v-slot:[`item.projectEditor`]="{ item }">
                <v-checkbox
                  v-model="item.projectEditor"
                  @change="addProjectPermission(item, 'editor')"
                ></v-checkbox>
              </template>

              <template v-slot:[`item.projectViewer`]="{ item }">
                <v-checkbox
                  v-model="item.projectViewer"
                  @change="addProjectPermission(item, 'viewer')"
                ></v-checkbox>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item
        v-show="
          (user.siteAdmin &&
            roleDefinitionTable.find((role) => role.name == 'Site Admin')
              .adjustRole) ||
          user.masterSiteAdmin
        "
      >
        <v-card flat>
          <v-card-text>
            <v-data-table
              :headers="siteSettingHeaders"
              :items="roleDefinitionTable"
              :search="search"
              :items-per-page="100"
              hide-default-footer
            >
              <template v-slot:[`item.assignSiteAdmin`]="{ item }">
                <v-checkbox
                  v-model="item.assignSiteAdmin"
                  :disabled="item.name !== 'Site Admin'"
                  @change="saveSiteSetting"
                ></v-checkbox>
              </template>
              <template v-slot:[`item.assignProject`]="{ item }">
                <v-checkbox
                  v-model="item.assignProject"
                  :disabled="item.name !== 'Site Admin'"
                  @change="saveSiteSetting"
                ></v-checkbox>
              </template>

              <template v-slot:[`item.adjustRole`]="{ item }">
                <v-checkbox
                  v-model="item.adjustRole"
                  :disabled="item.name !== 'Site Admin'"
                  @change="saveSiteSetting"
                ></v-checkbox>
              </template>

              <template v-slot:[`item.createProject`]="{ item }">
                <v-checkbox
                  v-model="item.createProject"
                  :disabled="
                    ['Master Site Admin', 'Project Viewer'].includes(item.name)
                  "
                  @change="saveSiteSetting"
                ></v-checkbox>
              </template>

              <template v-slot:[`item.createScene`]="{ item }">
                <v-checkbox
                  v-model="item.createScene"
                  :disabled="item.name == 'Master Site Admin'"
                  @change="saveSiteSetting"
                ></v-checkbox>
              </template>

              <template v-slot:[`item.createTag`]="{ item }">
                <v-checkbox
                  v-model="item.createTag"
                  :disabled="item.name == 'Master Site Admin'"
                  @change="saveSiteSetting"
                ></v-checkbox>
              </template>

              <template v-slot:[`item.tagComment`]="{ item }">
                <v-checkbox
                  v-model="item.tagComment"
                  :disabled="item.name == 'Master Site Admin'"
                  @change="saveSiteSetting"
                ></v-checkbox>
              </template>
              <template v-slot:[`item.readContent`]="{ item }">
                <v-checkbox
                  v-model="item.readContent"
                  :disabled="item.name == 'Master Site Admin'"
                  @change="saveSiteSetting"
                ></v-checkbox>
              </template> </v-data-table
          ></v-card-text>
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
  updateSiteSetting,
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
      tab: 1,
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
        { text: "Set as Site Admin", value: "siteAdmin" },
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
        { text: "Set as Project Admin", value: "projectAdmin" },
        { text: "Set as Project Editor", value: "projectEditor" },
        { text: "Set as Project Viewer", value: "projectViewer" },
      ],

      siteSettingHeaders: [
        {
          text: "Role Name",
          align: "start",
          value: "name",
        },
        { text: "Assign New Site Admin", value: "assignSiteAdmin" },
        { text: "Assign Project Admin", value: "assignProject" },
        { text: "Adjust Role Permissions", value: "adjustRole" },
        { text: "Create New Projects", value: "createProject" },
        { text: "Create New Scenes Within Projects", value: "createScene" },
        { text: "Create New Tags Within Scenes", value: "createTag" },
        { text: "Read/Write Tag Comments", value: "tagComment" },
        {
          text: "Readl All Other Content(Except Comments)",
          value: "readContent",
        },
      ],
      // panosCategoryList: [],
      // panosTitleList: [],
    };
  },
  computed: mapState(["user", "roleDefinitionTable"]),
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
    async loadPanos() {
      await API.graphql(graphqlOperation(listPanos)).then((data) => {
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
    // async loadSiteSetting() {
    //   let siteSettingData = (
    //     await API.graphql(
    //       graphqlOperation(getSiteSetting, { type: "role-definition" })
    //     )
    //   ).data.getSiteSetting;

    //   siteSettingData.config = JSON.parse(siteSettingData.config);

    // siteSettingData.config = {
    //   roleTable: [
    //     {
    //       name: "Master Site Admin",
    //       assignSiteAdmin: true,
    //       assignProject: true,
    //       adjustRole: true,
    //       createProject: true,
    //       createScene: true,
    //       createTag: true,
    //       tagComment: true,
    //       readContent: true,
    //     },
    //     {
    //       name: "Site Admin",
    //       assignSiteAdmin: true,
    //       assignProject: true,
    //       adjustRole: true,
    //       createProject: true,
    //       createScene: true,
    //       createTag: true,
    //       tagComment: true,
    //       readContent: true,
    //     },
    //     {
    //       name: "Project Admin",
    //       assignSiteAdmin: true,
    //       assignProject: true,
    //       adjustRole: true,
    //       createProject: true,
    //       createScene: true,
    //       createTag: true,
    //       tagComment: true,
    //       readContent: true,
    //     },
    //     {
    //       name: "Project Editor",
    //       assignSiteAdmin: true,
    //       assignProject: true,
    //       adjustRole: true,
    //       createProject: true,
    //       createScene: true,
    //       createTag: true,
    //       tagComment: true,
    //       readContent: true,
    //     },
    //     {
    //       name: "Project Viewer",
    //       assignSiteAdmin: true,
    //       assignProject: true,
    //       adjustRole: true,
    //       createProject: true,
    //       createScene: true,
    //       createTag: true,
    //       tagComment: true,
    //       readContent: true,
    //     },
    //   ],
    // };
    //   this.siteSetting = siteSettingData;
    // },
    async saveSiteSetting() {
      let siteSettingData = {
        type: "role-definition",
        config: JSON.stringify({
          roleTable: this.roleDefinitionTable,
        }),
      };
      await API.graphql({
        query: updateSiteSetting,
        variables: {
          input: siteSettingData,
        },
      });
    },
  },
  watch: {
    tab: {
      immediate: true,
      handler(val) {
        if (val == 0) {
          if (!this.siteAdmins) {
            this.loadSiteAdmin();
          }
        } else if (val == 1) {
          this.loadPanos();
        } else if (val == 2) {
          // this.loadSiteSetting();
        }
      },
    },
  },
};
</script>
 