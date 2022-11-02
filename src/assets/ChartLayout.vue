<template>
  <div class="default">
    <ChartAccountTabs :assetType="assetType" />
    <Chart :assetType="assetType" />
    <ChartSinceTabs :assetType="assetType" />
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import Chart from './Chart.vue';
import ChartAccountTabs from './ChartAccountTabs.vue';
import ChartSinceTabs from './ChartSinceTabs.vue';

@Component({
  components: {
    Chart,
    ChartAccountTabs,
    ChartSinceTabs,
  },
})
export default class ChartLayout extends Vue {
  @Prop() public readonly assetType;
  // data

  // styles

  // computed

  // methods
}
</script>

<style lang="scss" scoped>
.default {
  min-width: 1100px;
}
</style>
