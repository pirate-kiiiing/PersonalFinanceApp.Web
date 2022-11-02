<template>
  <div>
    <GChart
      type="BarChart"
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
import { Date } from '@/shared/Date';

@Component({
  components: {
    GChart,
  },
})
export default class ChartBar extends Vue {
  // data
  private readonly chartCategories: ExpenseCategory[] = manager.getChartCategories();
  private gchart;
  private google;
  private options = {
    animation: {
      startup: true,
      duration: 1000,
      easing: 'out',
    },
    annotations: {
      textStyle: {
        color: '',
        bold: true,
        auraColor: '',
      },
      alwaysOutside: true,
    },
    backgroundColor: '',
    bar: { groupWidth: '60%' },
    chartArea: {
      width: '77%',
      height: '80%',
    },
    hAxis: {
      textStyle: {
        color: '',
      },
      format: '$###,##0',
      viewWindowMode: 'maximized',
    },
    height: AccountantConstants.Chart.Height,
    isStacked: true,
    legend: 'none',
    series: [],
    title: 'Monthly Total',
    titleTextStyle: {
      fontSize: 22,
      color: '',
    },
    tooltip: { isHtml: true }, // Use an HTML tooltip.
    vAxis: {
      textStyle: {
        color: '',
      },
    },
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
  public onChartReady(gchart, google): void {
    this.gchart = gchart;
    this.google = google;

    this.drawChart();
  }

  private drawChart(): void {
    const data = new this.google.visualization.DataTable();

    data.addColumn('string', 'Month');
    this.chartCategories.forEach((category) => {
      data.addColumn('number', category);
      data.addColumn({ type: 'string', role: 'tooltip', p: { html: true } });
    });
    data.addColumn({ type: 'string', role: 'annotation' });

    const currentStartDay: string = sharedManager.getStartDay(accountant.selectedYear, accountant.selectedMonth);
    for (let i: number = -2; i <= 0; i++) {
      const startDate: Date = (new Date(currentStartDay)).addMonths(i);
      const endDate: Date = startDate.addMonths(1).addDays(-1);
      const row = this.getChartRow(startDate, endDate);

      data.addRows([row]);
    }

    this.setOptions();

    this.gchart.draw(data, this.options);
  }

  private getChartRow(startDate: Date, endDate: Date) {
    const month: number = startDate.getMonth();
    // cases where total of an expense category is negative
    let negativeTotal: number = 0;

    const row: any = [ sharedManager.getMonthAbbr(month) ];
    this.chartCategories.forEach((category) => {
      let total: number = accountant.getTotal({
        category,
        startDate: startDate.toString(),
        endDate: endDate.toString(),
      });

      if (total < 0) {
        negativeTotal += total;
        total = 0;
      }

      row.push(total);
      row.push(this.getTooltipString(category, total, month));
    });

    let monthlyTotal: number = accountant.getTotal({
      startDate: startDate.toString(),
      endDate: endDate.toString(),
    });
    monthlyTotal -= negativeTotal;

    row.push('$' + sharedManager.toCurrencyString(monthlyTotal)); // annotation

    return row;
  }

  private getTooltipString(
    category: ExpenseCategory,
    amount: number,
    month: number,
  ): string {
    const amountStr: string = sharedManager.toCurrencyString(amount);

    return `
      <div style="color: black; margin: 7px; font-size: 13px; font-family: Arial, Helvetica, sans-serif;">
        <b>${sharedManager.getMonthStr(month)}</b><br style="line-height: 18px;" />${category}:&nbsp;<b>$${amountStr}</b>
      </div>
      `;
  }

  private setOptions(): void {
    const series: any = this.chartCategories.map((category) => {
      return {
        color: AccountantConstants.Category.Colors[layout.theme][category],
      };
    });

    this.options.series = series;
    this.options.annotations.textStyle.auraColor = AccountantConstants.Chart.Colors[layout.theme].AuraBar;
    this.options.annotations.textStyle.color = AccountantConstants.Chart.Colors[layout.theme].Text;
    this.options.hAxis.textStyle.color = AccountantConstants.Chart.Colors[layout.theme].Text;
    this.options.titleTextStyle.color = AccountantConstants.Chart.Colors[layout.theme].Title;
    this.options.vAxis.textStyle.color = AccountantConstants.Chart.Colors[layout.theme].Text;
  }
}
</script>

<style lang="scss" scoped>
</style>
