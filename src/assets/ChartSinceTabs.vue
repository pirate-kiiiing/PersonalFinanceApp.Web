<template>
  <div class="default">
    <md-tabs 
      md-alignment="fixed"
      :md-active-tab="selectedChartSince"
    >
      <template slot="md-tab" slot-scope="{ tab }">
        <ChartSinceTab
          :assetType="assetType"
          :tab="tab" 
        />
      </template>
        <md-tab
          v-for="since in chartSinces"
          :id="since"
          :key="since" 
          :md-label="Sinces.toString(since)"
          :md-template-data="templateData"
          @click.prevent="onClick(since)"
        >
        </md-tab>
    </md-tabs> 
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import AssetConstants from './_constants';
import { Since, Sinces } from './_data';
import manager from './_manager';
import assets, { AssetType } from './_store';
import ChartSinceTab from './ChartSinceTab.vue';
import { Theme } from '@/layout/_data';
import layout from '@/layout/_store.ts';

@Component({
  components: {
    ChartSinceTab,
  },
})
export default class ChartSinceTabs extends Vue {
  @Prop() public readonly assetType!: AssetType;
  // data
  public chartSinces = [
    Since[Since.TwoWeeks],
    Since[Since.OneMonth],
    Since[Since.ThreeMonths],
    Since[Since.SixMonths],
    Since[Since.OneYear],
  ];
  public readonly Sinces = Sinces;

  // styles
  get style(): object {
    return {
      backgroundColor: AssetConstants[this.assetType].Color[layout.theme].Font,
    };
  }

  // computed
  get selectedChartSince() {
    return assets.getSelectedChartSince(this.assetType);
  }

  get templateData() {
    return {
      assetType: (this.assetType === AssetType.Assets)
        ? assets.getSelectedChartId(this.assetType)
        : this.assetType,
    };
  }

  // methods
  public async onClick(since: string): Promise<void> {
    await assets.selectChartSinceAsync({
      assetType: this.assetType,
      since,
    });
  }
}
</script>

<style lang="scss" scoped>
.default {
  padding-bottom: 10px;
}
</style>
