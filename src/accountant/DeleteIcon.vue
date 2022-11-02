<template>
  <div>
    <md-button
      class="md-icon-button"
      @click.prevent="deleteTransaction()"
    >
      <md-icon :style="iconStyle">delete</md-icon>
      <md-tooltip md-direction="bottom" :md-delay="delay">Delete</md-tooltip>
    </md-button>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import { TransactionType } from './_data';
import accountant, { ITransaction } from './_store';
import LayoutConstants from '@/layout/_constants';
import layout from '@/layout/_store';
import SharedConstants from '@/shared/_constants';

@Component
export default class DeleteTransactions extends Vue {
  @Prop() public readonly id!: string;
  @Prop() public readonly type!: TransactionType;
  // data
  public readonly accountant = accountant;
  public readonly delay = SharedConstants.Tooltip.Delay;

  // styles
  get iconStyle(): object {
    return {
      color: LayoutConstants.Layout.Colors[layout.theme].Accent,
    };
  }

  // computed

  // methods
  public async deleteTransaction(): Promise<void> {
    await accountant.deleteTransactionAsync({
      id: this.id,
      type: this.type,
    });
  }
}
</script>

<style lang="scss" scoped>
</style>