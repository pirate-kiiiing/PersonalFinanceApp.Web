<template>
  <div class="asset">
    <div class="list">
      <md-list :style="listStyle">
        <md-list-item 
          md-expand
          :md-expanded="expanded"
          :style="listItemStyle"
        >
          <md-icon>
            <span style="color: white;">{{ AssetView.Icon }}</span>
          </md-icon>
          <span class="md-list-item-text asset-title">
            {{ AssetView.Title }}
          </span>

          <md-list slot="md-expand">
            <md-list-item style="margin: -12px -16px;">
              <div class="asset-catalog" :style="scrollStyle">
                <ChartLayout
                  v-if="assets.isExpandedChart(AssetType.Assets)"
                  :assetType="AssetType.Assets"
                />
                <SinceCatalogHeader :assetType="AssetType.Assets" />
                <div v-for="assetType in assets.displayAssetTypes" :key="assetType" >
                  <SinceCatalogToday :sinceCatalog="getSinceCatalogToday(assetType)" />
                  <div v-if="assets.isExpandedAccount(assetType) === true">
                    <div v-for="since in assets.pastSinces" :key="since">
                      <SinceCatalogPast :sinceCatalog="getSinceCatalogPast(assetType, since)" />
                    </div>
                  </div>
                </div>
                <!-- total asset -->
                <SinceCatalogToday :sinceCatalog="totalSinceCatalogToday" />
                <div v-if="assets.isExpandedAccount(totalAssetId) === true">
                  <div v-for="since in assets.pastSinces" :key="since">
                    <SinceCatalogPast :sinceCatalog="getTotalSinceCatalogPast(since)" />
                  </div>
                </div>
              </div>
            </md-list-item>
          </md-list>
        </md-list-item>
      </md-list>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import moment from 'moment';
import AssetConstants from './_constants';
import { ISinceCatalog, ISinceCatalogToday, Since, Sinces } from './_data';
import manager from './_manager';
import assets, { AssetType, IAccount, ICatalog } from './_store';
import ChartLayout from './ChartLayout.vue';
import SinceCatalogHeader from './SinceCatalogHeader.vue';
import SinceCatalogPast from './SinceCatalogPast.vue';
import SinceCatalogToday from './SinceCatalogToday.vue';
import { Theme } from '@/layout/_data';
import layout from '@/layout/_store';
import { BaseStatus } from '@/shared/_data';
import { device } from '@/shared/_tools';
import tenant from '@/tenant/_store';

@Component({
  components: {
    ChartLayout,
    SinceCatalogHeader,
    SinceCatalogPast,
    SinceCatalogToday,
  },
})
export default class Asset extends Vue {
  // data
  public readonly assets = assets;
  public readonly AssetType = AssetType;
  public readonly AssetView = AssetConstants[AssetType.Assets];
  public readonly layout = layout;
  public readonly totalAssetId = manager.getTotalAssetId(AssetType.Assets);
  public expanded: boolean = true;

  // styles
  get listStyle(): object {
    return {
      backgroundColor: AssetConstants.Layout.Color[layout.theme].ListBackground,
    };
  }

  get listItemStyle(): object {
    return {
      backgroundColor: this.AssetView.Color[layout.theme].Default,
    };
  }

  get scrollStyle(): object {
    return (device.isMobile() === true)
      ? { overflowX: 'scroll' }
      : {};
  }

  // computed
  get totalSinceCatalogToday(): ISinceCatalogToday {
    return {
      assetType: AssetType.Assets,
      date: Sinces.getDate(Since.Today).toString(),
      id: this.totalAssetId,
      isTotal: true,
      name: AssetConstants.Total.Name,
      pastBalance: assets.getTotal(AssetType.Assets, Since.Yesterday),
      showEdit: false,
      since: Since[Since.Today],
      showUpdateStatus: false,
      symbol: AssetConstants.Total.Symbol,
      todayBalance: assets.getTotal(AssetType.Assets, Since.Today),
    };
  }

  // methods
  public getSinceCatalogToday(assetType: AssetType): ISinceCatalogToday {
    const assetView = AssetConstants[assetType];

    return {
      assetType,
      date: Sinces.getDate(Since.Today).toString(),
      id: assetType,
      image: tenant.currentUserProfileImage,
      isTotal: false,
      name: AssetConstants[assetType].Name,
      pastBalance: assets.getTotal(assetType, Since.Yesterday),
      showEdit: (assetType === AssetType.Liquid) ? false : true,
      showUpdateStatus: false,
      since: Since[Since.Today],
      symbol: AssetConstants[assetType].Symbol!,
      todayBalance: assets.getTotal(assetType, Since.Today),
    };
  }

  public getSinceCatalogPast(assetType: AssetType, since: string): ISinceCatalog {
    return {
      assetType,
      date: Sinces.getDate(since).toString(),
      isTotal: false,
      pastBalance: assets.getTotal(assetType, Since[since]),
      since,
      todayBalance: assets.getTotal(assetType, Since.Today),
    };
  }

  public getTotalSinceCatalogPast(since: string): ISinceCatalog {
    return {
      assetType: AssetType.Assets,
      date: Sinces.getDate(since).toString(),
      isTotal: true,
      pastBalance: assets.getTotal(AssetType.Assets, since),
      since,
      todayBalance: assets.getTotal(AssetType.Assets, Since.Today),
    };
  }
}
</script>

<style lang="scss" scoped>

</style>
