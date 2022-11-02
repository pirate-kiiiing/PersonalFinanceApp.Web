<template>
  <div>
    <GChart
      type="LineChart"
      version="45.2"
      :data="null"
      @ready="onChartReady"
    />
  </div>
</template>

<script lang="ts">
import { GChart } from 'vue-google-charts';
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import chart from './_chart';
import { Since } from './_data';
import assets from './_store';
import { Theme } from '@/layout/_data';
import layoutStore from '@/layout/_store';

@Component({
  components: {
    GChart,
  },
})
export default class Chart extends Vue {
  @Prop() public readonly assetType;

  // data
  private gchart;
  private google;

  // styles

  // computed
  get selectedCatalogs() {
    return assets.getCatalogs(this.selectedChartId);
  }

  get selectedChartId(): string {
    return assets.getSelectedChartId(this.assetType);
  }

  get selectedChartSince(): string {
    return assets.getSelectedChartSince(this.assetType);
  }

  get theme(): Theme {
    return layoutStore.theme;
  }

  // watch
  @Watch('selectedCatalogs')
  public onSelectedCatalogsChange(val: string, oldVal: string) {
    this.drawChart();
  }
  @Watch('selectedChartSince')
  public onSelectedChartSince(val: Since, oldVal: Since) {
    this.drawChart();
  }
  @Watch('theme')
  public onThemeChanged(val: Theme, oldVal: Theme) {
    this.drawChart();
  }

  // methods
  public onChartReady(gchart, google) {
    this.gchart = gchart;
    this.google = google;

    this.drawChart();
  }

  private drawChart(): void {
    chart.drawChart(this.assetType, this.gchart, this.google);
  }
}
</script>

<style lang="scss" scoped>
</style>
