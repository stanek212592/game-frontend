<template>
  <div style="display: flex; justify-content: center;">
    <img :src="images.LOGO.path" style="margin-top: 15%; height: 50%;"
         :alt="images.LOGO.label"/>
  </div>

</template>

<script>
import {defineComponent} from 'vue';
import images from "src/images/imagesEnum";

export default defineComponent({
  name: 'IndexPage',
  computed: {
    images() {
      return images
    }
  },
});
</script>

<style>
</style>
