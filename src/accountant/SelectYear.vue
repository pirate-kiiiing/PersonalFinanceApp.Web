<template>
  <div class="md-layout-item">
    <md-field class="select">
      <label for="year">Year</label>
      <md-select :value="accountant.selectedYear" name="year" id="year">
        <div
          v-for="year in years" :key="year"
          @click.prevent="onSelectAsync(year)"
        >
          <md-option :value="year" >{{ year }}</md-option>
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
export default class SelectYear extends Vue {
  // data
  public accountant = accountant;

  // styles

  // computed
  get years(): number[] {
    const years: number[] = [];
    const maxYear: number = Date.Today().getYear();

    for (
      let year: number = AccountantConstants.DateTime.StartYear;
      year <= maxYear;
      year++) {
      years.push(year);
    }

    return years;
  }

  // methods
  public async onSelectAsync(year: number): Promise<void> {
    await accountant.selectYearAsync(year);
  }
}
</script>

<style lang="scss" scoped>
  .select {
    width: 65px;
  }
</style>