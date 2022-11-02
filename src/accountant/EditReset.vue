<template>
  <div 
    :class="(canReset === true) ? 'reset' : ''"
    :style="divStyle"
    @click="reset"
  >
    <md-icon 
      :class="(canReset === true) ? 'md-primary': ''"
      :style="(canReset === true) ? '' : 'color: gray;'"
    >
      refresh
      <md-tooltip
        md-direction="right"
        :md-delay="delay"
      >Reset
      </md-tooltip>
    </md-icon>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import manager from './_manager';
import accountant, { ITransaction } from './_store';
import SharedConstants from '@/shared/_constants';

@Component
export default class EditReset extends Vue {
  @Prop() public readonly divStyle!: string;
  @Prop() public readonly transactionId!: string;
  // data
  public readonly delay = SharedConstants.Tooltip.Delay;

  // styles

  // computed
  get canReset(): boolean {
    return manager.transactionHasChanged(this.transactionId) === true;
  }

  // methods
  public reset(): void {
    if (this.canReset === false) {
      return;
    }

    accountant.resetFloatingTransactions(this.transactionId);
  }
}
</script>

<style lang="scss" scoped>
  .reset {
    cursor: pointer;
  }
</style>