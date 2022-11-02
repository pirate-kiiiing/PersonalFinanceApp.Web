<template>
  <div 
    @click.prevent="onClick($event)"
  >
    <md-app :md-theme="layout.mdTheme">
      <md-app-toolbar 
        class="md-primary" 
        md-elevation="0"
        :style="backgroundStyle"
      >
        <md-button 
          class="md-icon-button" 
          @click.prevent="layout.toggleMenu(!layout.showMenu)" 
          v-if="!layout.showMenu"
        >
          <md-icon :style="toolbarStyle">menu</md-icon>
        </md-button>
        <span 
          :style="toolbarStyle"
          class="md-title"
        >
         {{layout.menu.title}}
        </span>
        
        <div class="md-toolbar-section-end">
          <LayoutSetting :settingStyle="toolbarStyle" />
        </div>
      </md-app-toolbar>

      <md-app-drawer 
        :md-theme="layout.mdTheme"
        :md-active="layout.showMenu" 
        md-persistent="mini"
      >
        <LayoutMenu 
          :layoutStyle="toolbarStyle"
        />
      </md-app-drawer>

      <md-app-content :style="contentStyle">
        <router-view />
        <SnackBar />
      </md-app-content>
    </md-app>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import colors from 'material-colors';
import LayoutConstants from './_constants';
import { IMenu, Theme } from './_data';
import layout from './_store';
import LayoutMenu from './LayoutMenu.vue';
import LayoutSetting from './LayoutSetting.vue';
import SnackBar from './SnackBar.vue';

@Component({
  components: {
    LayoutMenu,
    LayoutSetting,
    SnackBar,
  },
})
export default class Layout extends Vue {
  // properties
  // data
  public layout = layout;
  // styles

  // computed
  get backgroundStyle(): object {
    return {
      backgroundColor: LayoutConstants.Header.Colors[layout.theme].Background,
      position: 'sticky',
    };
  }

  // needs to be computed to dynamically change based on theme
  get toolbarStyle(): object {
    return {
      color: LayoutConstants.Header.Colors[layout.theme].Theme,
      fontWeight: 'bold',
    };
  }

  get contentStyle(): object {
    return {
      backgroundColor: LayoutConstants.Layout.Colors[layout.theme].Background,
    };
  }

  // methods
  public onClick($event): void {
    // close setting panel when the user clicks outside its layer
    const clickedSettingButton: boolean =
      document.getElementById('setting-button')!.contains($event.target) === true;
    const clickedSettingPanel: boolean =
      document.getElementById('setting-panel')!.contains($event.target) === true;

    if (layout.showSetting === true &&
        clickedSettingButton === false &&
        clickedSettingPanel === false) {
      layout.toggleSetting(false);
    }
  }
}
</script>

<style lang="scss" scoped>
.md-app {
  height: 100vh;
}

.md-drawer {
  width: 230px;
  max-width: calc(100vw - 125px);
}
</style>