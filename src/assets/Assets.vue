<template>
  <div v-if="isLoaded === true">
    <SinceSelect :selectedSince="assets.minSince" />
    <AssetTotal />
    <div v-for="assetType in assets.assetTypes" :key="assetType">
      <Asset :assetType="assetType" />
    </div>
    <EditCatalog />
    <div class="edit-button">
      <md-button 
        class="md-primary"
        @click="toggleEditCatalog()"
        :disabled="tenant.canEditCatalog === false"
      >Edit
      </md-button>
      <md-tooltip
        md-direction="bottom"
        :md-delay="delay"
      >{{ editCatalogMessage }}
      </md-tooltip>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import AssetConstants from './_constants';
import manager from './_manager';
import assets, { AssetType } from './_store';
import Asset from './Asset.vue';
import AssetTotal from './AssetTotal.vue';
import EditCatalog from './EditCatalog.vue';
import SinceSelect from './SinceSelect.vue';
import { Theme } from '@/layout/_data';
import layout from '@/layout/_store';
import SharedConstants from '@/shared/_constants';
import { Date } from '@/shared/Date';
import tenant from '@/tenant/_store';

@Component({
  components: {
    Asset,
    AssetTotal,
    EditCatalog,
    SinceSelect,
  },
})
export default class Assets extends Vue {
  // properties

  // data
  public readonly assets = assets;
  public readonly AssetType = AssetType;
  public readonly delay = SharedConstants.Tooltip.Delay;
  public readonly tenant = tenant;

  // styles

  // lifecycle
  public async mounted(): Promise<void> {
    // navigating back to Assets menu triggers mounted again (e.g. Dashboard -> Assets)
    if (this.isLoaded === true) {
      return;
    }

    await assets.initAsync();
  }

  // computed
  get editCatalogMessage(): string {
    return (tenant.canEditCatalog === true)
      ? 'Edit catalog'
      : 'Insufficient privilege';
  }

  get isLoaded(): boolean {
    return assets.catalogs.length > 0;
  }

  // methods
  public toggleEditCatalog(): void {
    assets.toggleEditCatalog();
  }
}
</script>

<style lang="scss" scoped>
.edit-button {
  position: absolute;
  right: 10px;
}
</style>
