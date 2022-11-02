<template>
  <div class="md-layout-item" style="margin-left: -25px;">
    <md-field class="select">
      <label for="month">Month</label>
      <md-select :value="accountant.selectedMonth" name="month" id="month">
        <div
          v-for="month in months" :key="month"
          @click.prevent="onSelectAsync(month)"
        >
          <md-option :value="month">{{ month }}</md-option>
        </div>
      </md-select>
    </md-field>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import AccountantConstants from './_constants';
import accountant from './_store';
import { Date } from '@/shared/Date';

@Component
export default class SelectMonth extends Vue {
  // data
  public accountant = accountant;

  // styles

  // computed
  get months(): number[] {
    const months: number[] = [];

    for (let month: number = 1; month <= 12; month++) {
      months.push(month);
    }

    return months;
  }

  // methods
  public async onSelectAsync(month: number): Promise<void> {
    await accountant.selectMonthAsync(month);
  }
}
</script>

<style lang="scss" scoped>
  .select {
    width: 65px;
  }
</style>