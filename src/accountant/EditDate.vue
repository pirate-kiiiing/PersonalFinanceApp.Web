<template>
  <div>
    <md-datepicker
      v-model="accountant.getSelectedFloatingTransaction(transactionId).date"
      md-immediately
      style="margin-top: -30px; margin-bottom: -15px;"
      :md-disabled-dates="disabledDates"
    >
    </md-datepicker>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import _ from 'lodash';
import accountant from './_store';
import { Date } from '@/shared/Date';

@Component
export default class EditDate extends Vue {
  @Prop() public transactionId!: string;
  // data
  public readonly accountant = accountant;

  public disabledDates = (date) => date > Date.Today().toJsDate();

  // computed
}
</script>

<style lang="scss" scoped>

</style>
