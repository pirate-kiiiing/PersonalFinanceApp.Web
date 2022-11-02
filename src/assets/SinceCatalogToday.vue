<template>
  <div
    class="asset-catalog today"
    :class="[
      layout.theme, 
      (hover === true) ? `hover-${layout.theme}` : ''
    ]"
    :style="assetCatalogStyle"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <md-list class="asset-catalog-user">
      <md-list-item>
        <div class="asset-catalog-today">
          <md-avatar>
            <img
              v-if="sinceCatalog.image"
              :src="sinceCatalog.image" alt="Avatar"
            >
          </md-avatar>
        </div>
      </md-list-item>
    </md-list>

    <md-list class="asset-catalog-symbol">
      <md-button 
        class="md-plain button"
        :style="buttonStyle"
        @click.prevent="toggleExpandAccount"
      >
        <span
          class="button-text"
          :style="buttonTextStyle">
          {{ sinceCatalog.symbol }}
        </span>
      </md-button>
    </md-list>

    <md-list class="asset-catalog-name">
      <md-list-item>
        <span 
          class="asset-catalog-today" 
          style="white-space: normal;"
        >{{ sinceCatalog.name }}
        </span>
      </md-list-item>
    </md-list>

    <md-list class="asset-catalog-since">
      <md-list-item>
        <span class="asset-catalog-today">
          {{ sinceCatalog.since }}
        </span>
      </md-list-item>
    </md-list>

    <md-list class="asset-catalog-date">
      <md-list-item>
        <div class="asset-catalog-today">
          <span>{{ sinceCatalog.date }}</span>
          <br />
          <div v-if="sinceCatalog.showUpdateStatus === true">
            <div v-if="sinceCatalog.updatedStatus === BaseStatus.Success">
              <span class="updated-date" :style="updatedTimeStyle">
                {{ sinceCatalog.updatedStatusMessage }}
              </span>
            </div>
            <div v-else>
              <md-icon>
                <span
                  class="update-failure"
                  :style="updatedTimeStyle"
                >
                  error_outline
                </span>
              </md-icon>
              <span
                class="updated-date"
                style="margin-left: -6px;"
                :style="updatedTimeStyle"
              >
                {{ sinceCatalog.updatedStatusMessage }}
              </span>
            </div>
          </div>
        </div>
      </md-list-item>
    </md-list>

    <md-list class="asset-catalog-balance">
      <md-list-item>
        <span class="asset-catalog-today">
          {{ balance }}
        </span>
      </md-list-item>
    </md-list>

    <md-list class="asset-catalog-change">
      <md-list-item>
        <span class="asset-catalog-today">
          <SinceCatalogChange
            :bold="true"
            :todayBalance="sinceCatalog.todayBalance"
            :pastBalance="sinceCatalog.pastBalance"
          />
        </span>
      </md-list-item>
    </md-list>

    <md-list class="asset-catalog-edit">
      <md-list-item>
        <span class="asset-catalog-today">
          <md-icon
            v-if="sinceCatalog.showEdit"
            :disabled="tenant.canEditCatalog === false"
          >
            <md-tooltip
              md-direction="bottom"
              :md-delay="delay"
            >{{ editCatalogMessage }}
            </md-tooltip>
            <span
              class="edit"
              :style="editIconStyle"
              @click.prevent="onClick(sinceCatalog)"
            >edit
            </span>
          </md-icon>
        </span>
      </md-list-item>
    </md-list>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import moment from 'moment';
import AssetConstants from './_constants';
import { ISinceCatalogToday, Since  } from './_data';
import manager from './_manager';
import assets, { AssetType, IAccount, ICatalog } from './_store';
import SinceCatalogChange from './SinceCatalogChange.vue';
import { Theme } from '@/layout/_data';
import layout from '@/layout/_store';
import SharedConstants from '@/shared/_constants';
import { BaseStatus } from '@/shared/_data';
import sharedManager from '@/shared/_manager';
import tenant from '@/tenant/_store';

@Component({
  components: {
    SinceCatalogChange,
  },
})
export default class SinceCatalog extends Vue {
  @Prop() public readonly sinceCatalog!: ISinceCatalogToday;

  // data
  public readonly BaseStatus = BaseStatus;
  public readonly delay = SharedConstants.Tooltip.Delay;
  public readonly layout = layout;
  public readonly tenant = tenant;
  public hover: boolean = false;

  // styles
  get assetCatalogStyle(): object {
    return {
      borderTop: `1px solid ${AssetConstants.Layout.Color[layout.theme].Border}`,
    };
  }

  get buttonStyle(): object {
    return (this.sinceCatalog.isTotal === true)
      ? {
        backgroundColor: AssetConstants[this.sinceCatalog.assetType].Color[layout.theme].Font,
        borderColor: AssetConstants[this.sinceCatalog.assetType].Color[layout.theme].Font,
      } : {
        borderColor: AssetConstants[this.sinceCatalog.assetType].Color[layout.theme].Font,
      };
  }

  get buttonTextStyle(): object {
    return (this.sinceCatalog.isTotal === true)
      ? {
        color: AssetConstants.Layout.Color[layout.theme].ButtonText,
      } : {
        color: AssetConstants[this.sinceCatalog.assetType].Color[layout.theme].Font,
      };
  }

  get editIconStyle(): object {
    return (tenant.canEditCatalog === true)
      ? {
        cursor: 'pointer',
      } : {
        cursor: 'auto',
      };
  }

  get updatedTimeStyle(): object {
    return {
      color: AssetConstants.Layout.Color[layout.theme][this.sinceCatalog.updatedStatus!],
    };
  }

  // computed
  get balance(): string {
    return `$${sharedManager.toCurrencyString(this.sinceCatalog.todayBalance)}`;
  }

  get editCatalogMessage(): string {
    return (tenant.canEditCatalog === true)
      ? 'Edit catalog'
      : 'Insufficient privilege';
  }

  // methods
  public onClick(sinceCatalog: ISinceCatalogToday): void {
    if (tenant.canEditCatalog === false) {
      return;
    }

    assets.toggleEditCatalog({
      assetType: this.sinceCatalog.assetType,
      accountId: (this.sinceCatalog.assetType === this.sinceCatalog.id)
        ? undefined // clicked from AssetType.Assets
        : this.sinceCatalog.id,
    });
  }

  public toggleExpandAccount(): void {
    assets.toggleExpandAccount({
      id: this.sinceCatalog.id,
      name: this.sinceCatalog.name,
    });
  }
}
</script>

<style lang="scss" scoped>
.asset-catalog-today {
  font-weight: bold;
  margin-top: -5px;
}

.button {
  margin-top: 0.3em;
  border: solid;
  border-width: 0.1em;
  border-radius: 5px;
}

.edit {
  font-size: 18px;
}

.updated-date {
  font-size: 12px;
  font-style: italic;
  font-weight: normal;
}

.button-text {
  font-weight: bold;
}

.update-failure {
  font-size: 18px;
  font-weight: 100;
  margin-left: -8px;
}
</style>
