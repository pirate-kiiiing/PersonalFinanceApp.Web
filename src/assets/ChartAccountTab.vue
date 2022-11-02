<template>
  <span class="default" :style="style">{{ tab.label }}</span>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import AssetConstants from './_constants';
import { AssetType } from './_store';
import layout from '@/layout/_store.ts';

@Component
export default class ChartAccountTab extends Vue {
  @Prop() public readonly tab!: any;
  @Prop() public readonly assetType!: AssetType;
  // data

  // styles
  get style(): object {
    return {
      color: (this.assetType === AssetType.Assets)
        ? AssetConstants[this.tab.data.assetType].Color[layout.theme].Font
        : AssetConstants[this.assetType].Color[layout.theme].Font,
    };
  }

  // computed

  // methods
}
</script>

<style lang="scss" scoped>
.default {
  text-transform: none;
  font-size: 14px;
}
</style>
