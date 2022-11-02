<template>
  <div
    class="remove"
    :style="divStyle"
    @click="remove()"
  >
    <md-icon>
      remove_circle_outline
      <md-tooltip
        md-direction="right"
        :md-delay="delay"
      >Remove from selection
      </md-tooltip>
    </md-icon>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import _ from 'lodash';
import manager from './_manager';
import accountant from './_store';
import SharedConstants from '@/shared/_constants';

@Component
export default class EditSave extends Vue {
  @Prop() public readonly divStyle!: string;
  @Prop() public readonly transactionId!: string;
  // data
  public readonly accountant = accountant;
  public readonly delay = SharedConstants.Tooltip.Delay;

  // styles

  // computed

  // methods
  public async remove(): Promise<void> {
    accountant.removeTransaction(this.transactionId);
  }
}
</script>

<style lang="scss" scoped>
.remove {
  cursor: pointer;
}
</style>
