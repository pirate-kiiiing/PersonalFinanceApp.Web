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
                  v-if="assets.isExpandedChart(assetType)"
                  :assetType="assetType"
                />
                <SinceCatalogHeader :assetType="assetType" />
                <div v-for="account in accounts" :key="account.id" >
                  <SinceCatalogToday :sinceCatalog="getSinceCatalogToday(account)" />
                  <div v-if="assets.isExpandedAccount(account.id) === true">
                    <div v-for="since in assets.pastSinces" :key="since">
                      <SinceCatalogPast :sinceCatalog="getSinceCatalogPast(account, since)" />
                    </div>
                  </div>
                </div>
                <!-- total account catalog -->
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
import tenant, { IUser } from '@/tenant/_store';

@Component({
  components: {
    ChartLayout,
    SinceCatalogHeader,
    SinceCatalogPast,
    SinceCatalogToday,
  },
})
export default class Asset extends Vue {
  @Prop() public readonly assetType!: AssetType;

  // data
  public readonly assets = assets;
  public readonly AssetView = AssetConstants[this.assetType];
  public readonly layout = layout;
  public readonly totalAssetId = manager.getTotalAssetId(this.assetType);
  public expanded: boolean = false;

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
  get accounts(): IAccount[] {
    return assets.getAccountsOrderedByBalance(this.assetType);
  }

  get totalSinceCatalogToday(): ISinceCatalogToday {
    return {
      assetType: this.assetType,
      date: Sinces.getDate(Since.Today).toString(),
      id: this.totalAssetId,
      isTotal: true,
      name: `${this.assetType} ${AssetConstants.Total.Name}`,
      pastBalance: assets.getTotal(this.assetType, Since.Yesterday),
      showEdit: false,
      showUpdateStatus: false,
      since: Since[Since.Today],
      symbol: AssetConstants.Total.Symbol,
      todayBalance: assets.getTotal(this.assetType, Since.Today),
    };
  }

  // methods
  public getSinceCatalogToday(account: IAccount): ISinceCatalogToday {
    const assetView = AssetConstants[account.assetType];
    const catalog: ICatalog | undefined = assets.getCatalog(account.id, Since.Today);
    const accountUser: IUser | undefined = tenant.getUser(account.userId);
    const image: string = (accountUser) ? accountUser.profileImageUrl : '';
    let updatedStatus: BaseStatus;
    let updatedStatusMessage: string;

    if (!catalog || !catalog.lastModified) {
      if (account.isTracked === true) {
        updatedStatus = BaseStatus.Error;
        updatedStatusMessage = 'Failed to update';
      } else {
        updatedStatus = BaseStatus.Warning;
        updatedStatusMessage = 'No longer tracked';
      }
    } else {
      const updatedTime: moment.Moment = moment.unix(catalog.lastModified);
      const diffMinutes: number = moment().diff(updatedTime, 'minutes');

      updatedStatus = (diffMinutes < AssetConstants.UpdateToleranceMinutes)
        ? BaseStatus.Success
        : BaseStatus.Warning;
      updatedStatusMessage = `Updated ${updatedTime.format('hh:mm A')}`;
    }

    return {
      assetType: account.assetType,
      date: Sinces.getDate(Since.Today).toString(),
      id: account.id,
      image,
      isTotal: false,
      name: account.name,
      pastBalance: assets.getBalance(account.id, Since.Yesterday),
      showEdit: true,
      showUpdateStatus: true,
      since: Since[Since.Today],
      symbol: account.symbol,
      todayBalance: assets.getBalance(account.id, Since.Today),
      updatedStatus,
      updatedStatusMessage,
    };
  }

  public getSinceCatalogPast(account: IAccount, since: string): ISinceCatalog {
    return {
      assetType: account.assetType,
      date: Sinces.getDate(since).toString(),
      isTotal: false,
      pastBalance: assets.getBalance(account.id, since),
      since,
      todayBalance: assets.getBalance(account.id, Since.Today),
    };
  }

  public getTotalSinceCatalogPast(since: string): ISinceCatalog {
    return {
      assetType: this.assetType,
      date: Sinces.getDate(since).toString(),
      isTotal: true,
      pastBalance: assets.getTotal(this.assetType, Since[since]),
      since,
      todayBalance: assets.getTotal(this.assetType, Since.Today),
    };
  }
}
</script>

<style lang="scss">
$content-width: 100%;

.list {
  width: $content-width;
}

.asset {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap-reverse;
  z-index: 0;
}

.asset > .md-list {
  width: $content-width;
  max-width: 100%;
  height: 400px;
  display: inline-block;
  overflow: auto;
  border: 1px solid rgba(#000, .12);
  vertical-align: top;
}

.asset-catalog {
  width: 100%;
  max-width: 100%;
  height: 100%;
  vertical-align: top;
}

.asset-catalog > .md-list {
  height: 60px;
  display: inline-block;
}

.asset-catalog .Dark > .md-list {
  border-bottom: 1px solid rgba(#fff, .1);
}

.asset-catalog .Light > .md-list {
  border-bottom: 1px solid rgba(#000, .1);
}

.asset-title {
  color: white;
  font-weight: 500;
  font-size: 1.25rem;
}

.asset-catalog-user {
  width: 5%;
  min-width: 65px;
}

.asset-catalog-symbol {
  width: 10%;
  min-width: 100px;
}

.asset-catalog-name {
  width: 25%;
  min-width: 250px;
}

.asset-catalog-since {
  width: 10%;
  min-width: 100px;
}

.asset-catalog-date {
  width: 15%;
  min-width: 150px;
}

.asset-catalog-change {
  width: 15%;
  min-width: 200px;
}

.asset-catalog-balance {
  width: 15%;
  min-width: 150px;
}

.asset-catalog-edit {
  width: 5%;
  min-width: 50px;
}

.hover-Dark > .md-list {
  background-color: black;
}

.hover-Light > .md-list {
  background-color: #ececec;
}

.updated-date {
  font-size: 12px;
  font-style: italic;
}
</style>
