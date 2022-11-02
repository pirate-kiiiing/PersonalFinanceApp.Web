<template>
  <div>
    <router-link :to="menu.path">
      <md-list-item @click="onClick">
        <md-icon
          :class="(isCurrentPage === true) ? 'md-accent' : ''"
        >{{menu.icon}}
        </md-icon>
        <span
          class="md-list-item-text"
          :style="menuItemStyle"
        >{{menu.title}}
        </span>
      </md-list-item>
    </router-link>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import LayoutConstants from './_constants';
import { IMenu, Menus, Theme } from './_data';
import layout from './_store';

@Component
export default class LayoutMenu extends Vue {
  @Prop() public readonly menu!: IMenu;
  // data
  // styles

  // computed
  get isCurrentPage(): boolean {
    return this.menu === layout.menu;
  }

  get menuItemStyle(): object {
    if (this.isCurrentPage === false) {
      return {};
    }

    return {
      color: LayoutConstants.Layout.Colors[layout.theme].Accent,
      fontWeight: 'bold',
    };
  }

  // methods
  public onClick(): void {
    if (layout.menu.name === this.menu.name) {
      return;
    }

    layout.setMenu(this.menu.name);
  }
}
</script>

<style lang="scss" scoped>
</style>