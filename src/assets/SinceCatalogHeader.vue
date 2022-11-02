<template>
  <div 
    class="asset-catalog"
    @click.prevent="toggleExpandChart()"
  >
    <md-list class="asset-catalog-user" :style="headerStyle">
      <md-list-item>
        <span 
          class="title"
          :class="layout.theme"
        >User
        </span>
      </md-list-item>
    </md-list>

    <md-list class="asset-catalog-symbol" :style="headerStyle">
      <md-list-item>
        <span 
          class="title"
          :class="layout.theme"
        >Symbol
        </span>
      </md-list-item>
    </md-list>

    <md-list class="asset-catalog-name" :style="headerStyle">
      <md-list-item>
        <span 
          class="title"
          :class="layout.theme"
        >Name
        </span>
      </md-list-item>
    </md-list>

    <md-list class="asset-catalog-since" :style="headerStyle">
      <md-list-item>
        <span 
          class="title"
          :class="layout.theme"
        >Since
        </span>
      </md-list-item>
    </md-list>

    <md-list class="asset-catalog-date" :style="headerStyle">
      <md-list-item>
        <span
          class="title"
          :class="layout.theme"
        >Date
        </span>
      </md-list-item>
    </md-list>

    <md-list class="asset-catalog-balance" :style="headerStyle">
      <md-list-item>
        <span
          class="title"
          :class="layout.theme"
        >Balance
        </span>
      </md-list-item>
    </md-list>
    
    <md-list class="asset-catalog-change" :style="headerStyle">
      <md-list-item>
        <span
          class="title"
          :class="layout.theme"
        >Change
        </span>
      </md-list-item>
    </md-list>

    <md-list class="asset-catalog-edit" :style="headerStyle">
      <md-list-item>
        <span
          class="title"
          :class="layout.theme"
        >Edit
        </span>
      </md-list-item>
    </md-list>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import AssetConstants from './_constants';
import assets, { AssetType } from './_store';
import { Theme } from '@/layout/_data';
import layout from '@/layout/_store';

@Component
export default class SinceCatalogHeader extends Vue {
  @Prop() public readonly assetType!: AssetType;
  // data
  public readonly layout = layout;

  // styles
  get headerStyle(): object {
    return {
      backgroundColor: AssetConstants.Layout.Color[layout.theme].Background,
    };
  }

  // computed

  // methods
  public toggleExpandChart(): void {
    assets.toggleExpandChart(this.assetType);
  }
}
</script>

<style lang="scss" scoped>
.asset-catalog {
  margin-top: -3px; margin-bottom: -3px;
}

.title {
  font-size: 16px; 
  font-weight: bold;
  margin-top: -5px;
}

.Light {
  color: #757575;
}

.Dark {
  color: #bdbdbd;
}

.title span {
  vertical-align: middle;
}
</style>
