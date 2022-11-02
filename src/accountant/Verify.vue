<template>
  <div 
    class="verify"
    @click="verify"
  >
    <md-icon :style="iconStyle">
      {{ (verified === true) ? 'done' : 'clear' }}
    </md-icon>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import accountant, { ITransaction } from './_store';

@Component
export default class Verify extends Vue {
  @Prop() public readonly transactionId!: string;
  @Prop() public readonly iconStyle!: object;
  // data

  // styles

  // computed
  get verified(): boolean {
    return accountant.isVerified(this.transactionId);
  }

  // methods
  public verify(): void {
    //
  }
}
</script>

<style lang="scss" scoped>
  .verify {
    cursor: pointer;
  }
</style>