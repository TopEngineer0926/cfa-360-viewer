<template>
  <v-container>
    <amplify-authenticator>
      <div>
        My App
        <amplify-sign-out></amplify-sign-out>
      </div>
    </amplify-authenticator>
  </v-container>
</template>

<script>
export default {
  name: "HelloWorld",
};
</script>
