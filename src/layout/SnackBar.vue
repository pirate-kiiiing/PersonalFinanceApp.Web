<template>
  <div>
    <md-snackbar
      md-position="center"
      md-persistent
      :md-active.sync="snackBar.show" 
      :md-duration="snackBar.duration"
      :style="snackBarStyle"
    >
      <span>
        <span 
          v-if="snackBar.isSuccess !== undefined"
          style="position: left;"
          class="status"
          :style="statusStyle"
        >{{ (snackBar.isSuccess) ? 'Success!' : 'Oops!' }}
        </span>
        <span
          class="message"
          :style="messageStyle"
        >{{ snackBar.message }}
        </span>
      </span>
      <md-button 
        class="md-primary"
        @click.prevent="onClickDismiss()"
      >
        Dismiss
      </md-button>
    </md-snackbar>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import LayoutConstants from './_constants';
import { IMenu, Theme } from './_data';
import layout, { ISnackBar } from './_store';
import SharedConstants from '@/shared/_constants';

@Component
export default class SnackBar extends Vue {
  // properties

  // data

  // styles
  get messageStyle(): object {
    return {
      color: LayoutConstants.Layout.Colors[layout.theme].SnackBarText,
    };
  }

  get snackBarStyle(): object {
    return {
      backgroundColor: LayoutConstants.Layout.Colors[layout.theme].SnackBar,
    };
  }

  get statusStyle(): object {
    if (this.snackBar.isSuccess === undefined) {
      return {};
    }

    const successStr: string = (this.snackBar.isSuccess === true) ? 'Success' : 'Failure';

    return {
      color: SharedConstants.Layout.Colors[layout.theme][successStr],
    };
  }

  // computed
  get snackBar(): ISnackBar {
    return layout.snackBar;
  }

  // methods
  public onClickDismiss(): void {
    layout.dismissSnackBar();
  }
}
</script>

<style lang="scss" scoped>
.status {
  font-weight: bold;
  padding-right: 20px;
}
</style>