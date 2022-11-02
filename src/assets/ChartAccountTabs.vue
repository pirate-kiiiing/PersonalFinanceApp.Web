<template>
  <div class="layout">
    <div class="left">
      <md-tabs 
        class="md-transparent"
        :md-active-tab="assets.getSelectedChartId(assetType)"
      >
        <template slot="md-tab" slot-scope="{ tab }">
          <ChartAccountTab
            :assetType="assetType"
            :tab="tab" 
          />
        </template>
        <md-tab
          v-for="tab in tabs"
          :id="tab.id"
          :key="tab.id"
          :md-label="tab.symbol"
          :md-template-data="{ assetType: tab.assetType }"
          @click.prevent="onClick(tab)"
        >
        </md-tab>
      </md-tabs>
    </div>
    <md-content
      @click.prevent="toggleExpandChart()"
      class="right"
    >
    </md-content>
    <br class="clear" />
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import AssetConstants from './_constants';
import manager from './_manager';
import assets, { AssetType, IAccount } from './_store';
import ChartAccountTab from './ChartAccountTab.vue';
import layout from '@/layout/_store';

@Component({
  components: {
    ChartAccountTab,
  },
})
export default class ChartAccountTabs extends Vue {
  @Prop() public readonly assetType;
  // data
  public readonly AssetConstants = AssetConstants;
  public readonly assets = assets;
  public readonly layout = layout;
  public readonly manager = manager;

  // styles

  // computed
  get accounts(): IAccount[] {
    return assets.getAccountsOrderedByBalance(this.assetType);
  }

  get tabs(): Array<{ assetType: AssetType; id: string; name: string; symbol: string; }> {
    const tabs: Array<{ assetType: AssetType; id: string; name: string; symbol: string; }> = [];

    // add total first
    tabs.push({
      assetType: this.assetType,
      id: manager.getTotalAssetId(this.assetType),
      name: AssetConstants.Total.Name,
      symbol: AssetConstants.Total.Symbol,
    });

    if (this.assetType === AssetType.Assets) {
      assets
        .displayAssetTypes
        .forEach((assetType: AssetType) => {
          tabs.push({
            assetType,
            id: assetType,
            name: assetType,
            symbol: AssetConstants[assetType].Symbol!,
          });
        });
    } else {
      assets
        .getAccountsOrderedByBalance(this.assetType)
        .forEach((account) => {
          tabs.push({
            assetType: this.assetType,
            id: account.id,
            name: account.name,
            symbol: account.symbol,
          });
        });
    }

    return tabs;
  }

  // methods
  public onClick(tab: { id: string; name: string; symbol: string; }): void {
    const { id, name, symbol } = tab;

    assets.selectChart({
      assetType: this.assetType,
      id,
      name: (id === manager.getTotalAssetId(this.assetType))
        ? id
        : name,
    });
  }

  public toggleExpandChart(): void {
    assets.toggleExpandChart(this.assetType);
  }
}
</script>

<style lang="scss" scoped>
.clear {
  clear: left;
}

.layout {
  height: 55px;
}

.left {
  float: left;
}

.right {
  overflow: hidden;
  width: auto;
  height: 48px;
}
</style>
