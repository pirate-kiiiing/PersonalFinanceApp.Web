<template>
  <div
    :class="(canSave === true) ? 'save' : ''"
    :style="divStyle"
    @click="saveAsync"
  >
    <md-icon 
      :class="(canSave === true) ? 'md-accent' : ''"
      :style="(canSave === true) ? '' : 'color: gray;'"
    >
      save
      <md-tooltip
        md-direction="right"
        :md-delay="delay"
      >Save
      </md-tooltip>
    </md-icon>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import _ from 'lodash';
import manager from './_manager';
import accountant, { ITransaction } from './_store';
import SharedConstants from '@/shared/_constants';

@Component
export default class EditSave extends Vue {
  @Prop() public readonly divStyle!: string;
  @Prop() public readonly transactionId!: string;
  // data
  public readonly delay = SharedConstants.Tooltip.Delay;

  // styles

  // computed
  get canSave(): boolean {
    return manager.transactionHasChanged(this.transactionId) === true;
  }

  // methods
  public async saveAsync(): Promise<void> {
    if (this.canSave === false) {
      return;
    }

    await accountant.saveSelectedTransactionAsync(this.transactionId);
  }
}
</script>

<style lang="scss" scoped>
.save {
  cursor: pointer;
}
</style>
