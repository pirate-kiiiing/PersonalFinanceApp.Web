<template>
  <div
    class="overlay"
    v-if="layout.showLoader"
  >
    <div 
      class="loader"
      :style="loaderStyle"
    >
      <PacmanLoader />
      <div class="text">Loading...</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import PacmanLoader from 'vue-spinner/src/PacmanLoader.vue';
import layout from './_store';
import { device } from '@/shared/_tools';

@Component({
  components: {
    PacmanLoader,
  },
})
export default class Loader extends Vue {
  // data
  public layout = layout;

  // style
  get loaderStyle() {
    return (device.isMobile() === true) ? {
      top: '45%',
      left: '45%',
    } : {
      top: '45%',
      left: '48%',
    };
  }
}
</script>

<style lang="scss" scoped>
.loader {
  position: fixed;
  margin: auto;
}

.text {
  color: #e0e0e0;
  margin-top: 5px;
}

.overlay {
  background-color: rgba(0,0,0,0.5);
  position:fixed;
  left:0;
  top: 0;
  width:100%;
  height:100%;
  z-index: 50;
}
</style>