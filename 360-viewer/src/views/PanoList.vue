<template>
  <v-container>
    <div v-if="panos" class="d-flex flex-wrap">
      <v-card
        elevation="3"
        v-for="(pano, index) in panos"
        :key="index"
        class="ma-6"
        @click="$router.push('/pano/' + pano.id)"
        width="400"
      >
        <!-- <v-img :src="`pano/ue${index + 1}.jpg`" class="white--text align-end">
          <v-card-title v-text="pano.title"></v-card-title>
        </v-img> -->
        {{ pano.title }}
      </v-card>
    </div>
    <v-btn v-if="user.admin" @click="createPanoFunc">Create</v-btn>
  </v-container>
</template>

<script>
import { API, graphqlOperation } from "aws-amplify";
import { createPano } from "../graphql/mutations";
import { listPanos } from "../graphql/queries";
import { mapState } from "vuex";

export default {
  name: "Pano",
  data: function () {
    return {
      panos: null,
    };
  },
  computed: mapState(["user"]),
  created() {
    API.graphql(graphqlOperation(listPanos)).then((data) => {
      this.panos = data.data.listPanos.items;
    });
  },
  methods: {
    async createPanoFunc() {
      try {
        let newPanoId = await API.graphql(
          graphqlOperation(createPano, {
            input: { title: "New Scene" },
          })
        );
        console.log("newPanoId", newPanoId);
        this.$router.push({ path: "/pano/" + newPanoId.data.createPano.id });
      } catch (error) {
        console.error("createPano", error);
      }
    },
  },
};
</script>
