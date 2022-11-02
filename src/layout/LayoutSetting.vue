<template>
  <div>
    <md-button 
      id="setting-button" 
      @click.prevent="layout.toggleSetting(!layout.showSetting)"
      class="setting-button"
    >
      <md-icon :style="settingStyle">
        settings_applications
      </md-icon>
    </md-button>

    <div id="setting-panel">
      <div 
        :class="settingLayoutClass" 
        class="full-control"
        v-if="layout.showSetting"
      >
        <md-list>
          <md-subheader :style="settingStyle">Settings</md-subheader>

          <md-list-item>
            <md-icon :style="iconStyle">wb_sunny</md-icon>
            <span class="md-list-item-text">{{ theme }}</span>
            <md-switch 
              v-model="theme" 
              class="md-accent"
              true-value="Light"
              false-value="Dark" 
            />
          </md-list-item>
          <md-list-item>
            <md-avatar class="md-small" style="margin-right: 32px;">
              <img :src="tenant.currentUserProfileImage" alt="Avatar" />
            </md-avatar>
            <span class="md-list-item-text">Signed In</span>
            <md-switch
              v-model="signedIn"
              class="md-accent"
              @click="test()"
            />
          </md-list-item>
        </md-list>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import LayoutConstants from './_constants';
import { Theme } from './_data';
import layout from './_store';
import { device } from '@/shared/_tools';
import tenant from '@/tenant/_store';

@Component
export default class LayoutSetting extends Vue {
  @Prop(Object) public readonly settingStyle!: object;
  // data
  public theme: Theme = layout.theme;
  public layout = layout;
  public tenant = tenant;
  public signedIn: boolean = true;

  // styles
  get iconStyle(): object {
    return {
      color: LayoutConstants.Header.Colors[layout.theme].Icon,
    };
  }

  get settingLayoutClass(): string {
    return (device.isMobile() === false)
      ? 'setting-layout' : 'setting-layout-mobile';
  }

  // computed

  // methods
  @Watch('theme')
  public toggleTheme(curTheme: Theme, prevTheme: Theme): void {
    layout.setTheme(curTheme);
  }

  @Watch('signedIn')
  public async toggleSignIn(cur: boolean, prev: boolean): Promise<void> {
    await tenant.signOut();
  }
}
</script>

<style lang="scss" scoped>
.setting-button {
  left: 10px;
  min-width: 30px;
}

.setting-layout {
  position: absolute; 
  top: 64px; 
  right: 0;
  box-shadow: -2px 2px 5px rgba(0, 0, 0, 0.3);
  z-index: 5;
}

.setting-layout-mobile {
  position: absolute; 
  top: 56px; 
  right: 0;
  box-shadow: -2px 2px 5px rgba(0, 0, 0, 0.3);
  z-index: 5;
}

.full-control > .md-list {
    width: 250px;
    max-width: 100%;
    height: 250px;
    display: inline-block;
    overflow: auto;
    border: 1px solid rgba(#000, .12);
    vertical-align: top;
  }
</style>
