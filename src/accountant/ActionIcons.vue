<template>
  <div>
    <md-button
      class="md-icon-button"
      :disabled="isDisabled === true"
      @click.prevent="unselectAll()"
    >
      <md-icon :style="unselectStyle">tab_unselected</md-icon>
      <md-tooltip md-direction="bottom" :md-delay="delay">Unselect All</md-tooltip>
    </md-button>
    <md-button
      class="md-icon-button"
      :disabled="isDisabled === true"
      @click.prevent="showEdit()"
    >
      <md-icon :style="editStyle">edit</md-icon>
      <md-tooltip md-direction="bottom" :md-delay="delay">Edit</md-tooltip>
    </md-button>
    <md-button
      class="md-icon-button"
      :disabled="isDisabled === true"
      @click.prevent="showDelete()"
    >
      <md-icon :style="deleteStyle">delete</md-icon>
      <md-tooltip md-direction="bottom" :md-delay="delay">Delete</md-tooltip>
    </md-button>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import { TransactionType } from './_data';
import accountant from './_store';
import LayoutConstants from '@/layout/_constants';
import layout from '@/layout/_store';
import SharedConstants from '@/shared/_constants';

@Component
export default class ActionIcons extends Vue {
  @Prop() public readonly type!: TransactionType;
  // data
  public readonly accountant = accountant;
  public readonly delay = SharedConstants.Tooltip.Delay;

  // styles
  get editStyle(): object {
    return (this.isDisabled === true)
      ? {
        color: LayoutConstants.Layout.Colors[layout.theme].Disabled,
      } : {
        color: LayoutConstants.Layout.Colors[layout.theme].Primary,
      };
  }

  get deleteStyle(): object {
    return (this.isDisabled === true)
      ? {
        color: LayoutConstants.Layout.Colors[layout.theme].Disabled,
      } : {
        color: LayoutConstants.Layout.Colors[layout.theme].Accent,
      };
  }

  get unselectStyle(): object {
    return (this.isDisabled === true)
      ? {
        color: LayoutConstants.Layout.Colors[layout.theme].Disabled,
      } : {};
  }

  // computed
  get isDisabled(): boolean {
    return accountant.getSelectedTransactions(this.type).length <= 0;
  }

  // methods
  public showEdit(): void {
    accountant.toggleEdit({
      show: true,
      type: this.type,
    });
  }

  public showDelete(): void {
    accountant.toggleDelete({
      show: true,
      type: this.type,
    });
  }

  public unselectAll(): void {
    accountant.unselectAll(this.type);
  }
}
</script>


