<template>
  <div>
    <md-field style="width: 80px; margin-top: -30px; margin-bottom: -30px;">
      <span class="md-prefix">$</span>
      <md-input
        v-model="accountant.getSelectedFloatingTransaction(transactionId).amount"
        @keypress="isNumber($event)"
      ></md-input>
    </md-field>
    </md-datepicker>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import _ from 'lodash';
import accountant from './_store';

@Component
export default class EditAmount extends Vue {
  @Prop() public transactionId!: string;
  // data
  public readonly accountant = accountant;

  // methods
  public isNumber($event: any) {
    // console.log($event.keyCode); //keyCodes value
    const keyCode = ($event.keyCode ? $event.keyCode : $event.which);
    const amount: string = '' + accountant.getSelectedFloatingTransaction(this.transactionId).amount;

    // only allow number, dash, and dot
    // 45 = minus
    // 46 = dot
    if (keyCode !== 45 && keyCode !== 46 && (keyCode < 48 || keyCode > 57)) {
      $event.preventDefault();
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
