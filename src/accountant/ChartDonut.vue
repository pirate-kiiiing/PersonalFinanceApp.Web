<template>
  <div>
    <GChart
      type="PieChart"
      version="45.2"
      :data="null"
      @ready="onChartReady"
    />
  </div>
</template>

<script lang="ts">
import { GChart } from 'vue-google-charts';
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import moment from 'moment';
import AccountantConstants from './_constants';
import { ExpenseCategory } from './_data';
import manager from './_manager';
import accountant, { ITransaction } from './_store';
import LayoutConstants from '@/layout/_constants';
import { Theme } from '@/layout/_data';
import layout from '@/layout/_store';
import sharedManager from '@/shared/_manager';

@Component({
  components: {
    GChart,
  },
})
export default class ChartDonut extends Vue {
  // data
  private readonly chartCategories: ExpenseCategory[] = manager.getChartCategories();
  private gchart;
  private google;
  private options = {
    backgroundColor: '',
    chartArea: {
      width: '95%',
      height: '85%',
    },
    height: AccountantConstants.Chart.Height,
    legend: 'none',
    pieHole: 0.4,
    pieSliceBorderColor: '',
    pieSliceText: 'percent',
    slices: [],
    title: 'Distribution',
    titleTextStyle: {
      fontSize: 22,
      color: '',
    },
    tooltip: { isHtml: true }, // Use an HTML tooltip.
  };

  // styles

  // computed
  get theme(): Theme {
    return layout.theme;
  }

  get transactions(): ITransaction[] {
    return accountant.transactions;
  }

  // watch
  @Watch('theme')
  public onThemeChange(val: Theme, oldVal: Theme): void {
    this.drawChart();
  }

  @Watch('transactions')
  public onSelectedCatalogsChange(val: ITransaction, oldVal: ITransaction): void {
    this.drawChart();
  }

  // methods
  public getTooltipString(
    category: ExpenseCategory,
    amount: number,
    percent: number,
  ): string {
    const amountStr: string = sharedManager.toCurrencyString(amount);
    const percentStr: string = sharedManager.getFormattedPercent(percent);

    return `
      <div style="color: black; margin: 7px; font-size: 13px; font-family: Arial, Helvetica, sans-serif;">
        ${category}<br style="line-height: 18px;" /><b>$${amountStr}&nbsp;(${percentStr})</b>
      </div>
      `;
  }

  public onChartReady(gchart, google): void {
    this.gchart = gchart;
    this.google = google;

    this.drawChart();
  }

  private drawChart(): void {
    const data = new this.google.visualization.DataTable();
    const startDate: string =
      sharedManager.getStartDay(accountant.selectedYear, accountant.selectedMonth);
    const endDate: string =
      sharedManager.getLastDay(accountant.selectedYear, accountant.selectedMonth);

    data.addColumn('string', 'Category');
    data.addColumn('number', 'Amount');
    data.addColumn({ type: 'string', role: 'tooltip', p: { html: true } });

    this.chartCategories.forEach((category) => {
      const total: number = Math.max(accountant.getTotal({
        category,
        startDate,
        endDate,
      }), 0);
      const percentage: number = accountant.getProportion({
        category,
        startDate,
        endDate,
      });
      const row = [
        category,
        total,
        this.getTooltipString(category, total, percentage),
      ];

      data.addRows([row]);
    });

    this.setOptions();

    this.gchart.draw(data, this.options);
  }

  private setOptions(): void {
    const slices: any = this.chartCategories.map((category) => {
      return {
        color: AccountantConstants.Category.Colors[layout.theme][category],
      };
    });

    this.options.backgroundColor = LayoutConstants.Layout.Colors[layout.theme].Background;
    this.options.pieSliceBorderColor = AccountantConstants.Chart.Colors[layout.theme].Border;
    this.options.slices = slices;
    this.options.titleTextStyle.color = AccountantConstants.Chart.Colors[layout.theme].Title;
  }
}
</script>

<style lang="scss" scoped>
</style>
