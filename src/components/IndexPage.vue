<template>
  <div class="height-100 width-100">
    <div style="height: 75%; padding-top: 15%; display: flex; justify-content: center;">
      <img :src="images.LOGO.path" style="height: 100%;" :alt="images.LOGO.label"/>
    </div>
    <login-dialog :model-value="showLogin" no-storno-btn/>
  </div>
</template>

<script>
import {defineComponent} from 'vue';
import images from "src/imagesEnum";
import LoginDialog from "components/LoginDialog.vue";
import {user} from "stores/user";

export default defineComponent({
  name: 'IndexPage',
  components: {LoginDialog},
  computed: {
    images() {
      return images
    },
    showLogin(){
      return !user()?.login
      // return !user().login
    }
  },
});
</script>

<style>
</style>
