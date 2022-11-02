<template>
  <div
    class="verify"
    @click="verifyAsync"
  >
    <md-icon :class="(verified === true) ? '' : 'md-primary'">
      done
      <md-tooltip
        md-direction="right"
        :md-delay="delay"
      >{{ (verified === true) ? 'Unverify' : 'Verify' }}
      </md-tooltip>
    </md-icon>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import _ from 'lodash';
import accountant from './_store';
import SharedConstants from '@/shared/_constants';

@Component
export default class EditVerify extends Vue {
  @Prop() public readonly transactionId!: string;
  // data
  public readonly delay = SharedConstants.Tooltip.Delay;

  // styles

  // computed
  get verified(): boolean {
    return accountant.isVerified(this.transactionId);
  }

  // methods
  public async verifyAsync(): Promise<void> {
    await accountant.verifySelectedTransactionAsync({
      id: this.transactionId,
      verify: !this.verified,
    });
  }
}
</script>

<style lang="scss" scoped>
.verify {
  cursor: pointer;
}
</style>
