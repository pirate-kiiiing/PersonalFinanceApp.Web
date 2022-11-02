<template>
  <div
    class="asset-catalog past"
    :class="[
      (hover === true) ? `hover-${layout.theme}` : ''
    ]"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <md-list class="asset-catalog-user">
      <md-list-item>
      </md-list-item>
    </md-list>

    <md-list class="asset-catalog-symbol">
      <md-list-item>
      </md-list-item>
    </md-list>

    <md-list class="asset-catalog-name">
      <md-list-item>
      </md-list-item>
    </md-list>

    <md-list class="asset-catalog-since">
      <md-list-item>
        <span class="asset-catalog-past">
          {{ sinceCatalog.since }}
        </span>
      </md-list-item>
    </md-list>

    <md-list class="asset-catalog-date">
      <md-list-item>
        <span class="asset-catalog-past">
          {{ sinceCatalog.date }}
        </span>
      </md-list-item>
    </md-list>

    <md-list class="asset-catalog-balance">
      <md-list-item>
        <span class="asset-catalog-past">
          {{ balance }}
        </span>
      </md-list-item>
    </md-list>
    
    <md-list class="asset-catalog-change">
      <md-list-item>
        <span class="asset-catalog-past">
          <SinceCatalogChange
            :bold="false"
            :todayBalance="sinceCatalog.todayBalance"
            :pastBalance="sinceCatalog.pastBalance"
          />
        </span>
      </md-list-item>
    </md-list>

    <md-list class="asset-catalog-edit">
      <md-list-item>
        <span class="asset-catalog-past">
        </span>
      </md-list-item>
    </md-list>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import { ISinceCatalog } from './_data';
import { AssetType } from './_store';
import SinceCatalogChange from './SinceCatalogChange.vue';
import { Theme } from '@/layout/_data';
import layout from '@/layout/_store';
import sharedManager from '@/shared/_manager';

@Component({
  components: {
    SinceCatalogChange,
  },
})
export default class SinceCatalogPast extends Vue {
  @Prop() public readonly sinceCatalog!: ISinceCatalog;

  // data
  public readonly layout = layout;
  public hover: boolean = false;

  // styles

  // computed
  get balance(): string {
    return `$${sharedManager.toCurrencyString(this.sinceCatalog.pastBalance)}`;
  }

  // methods
}
</script>

<style lang="scss" scoped>
.asset-catalog-past {
  margin-top: -15px;
}

.asset-catalog .past > .md-list {
  height: 50px;
  display: inline-block;
}
</style>
