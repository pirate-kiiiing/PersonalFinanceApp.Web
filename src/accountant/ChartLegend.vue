<template>
  <div align="center">
    <span 
      v-for="category in chartCategories" :key="category"
      :style="getLegendStyle(category)"
    >
      {{ getLegend(category) }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </span>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import AccountantConstants from './_constants';
import { ExpenseCategory } from './_data';
import manager from './_manager';
import layout from '@/layout/_store';

@Component
export default class ChartLegend extends Vue {
  // data
  private readonly chartCategories: ExpenseCategory[] = manager.getChartCategories();

  // computed

  // methods
  public getLegend(category: ExpenseCategory): string {
    return `⚫ ${category}`;
  }

  public getLegendStyle(category: ExpenseCategory): object {
    return {
      color: 'transparent',
      textShadow: `0 0 0 ${AccountantConstants.Category.Colors[layout.theme][category]}`,
    };
  }
}
</script>

<style lang="scss" scoped>
</style>
