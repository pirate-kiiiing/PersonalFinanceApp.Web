<template>
  <div class="md-layout md-gutter">
    <div class="md-layout-item">
      <md-field>
        <label for="since">Since</label>
        <md-select
          :value="selectedSince"
          name="since"
          id="since"
          md-dense
        >
          <div
            v-for="since in sinces"
            :key="since"
            @click.prevent="onSelect(since)"
          >
            <md-option
              :value="since"
              :disabled="isDisabled(since)"
            >
              {{ getSinceString(since) }}
            </md-option>
          </div>
        </md-select>
      </md-field>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import { Since, Sinces } from './_data';
import assets from './_store';

@Component
export default class SinceSelect extends Vue {
  // properties
  @Prop() public readonly selectedSince!: string;

  // data
  public readonly sinces =
    Sinces.keys().filter((since) => since !== Since[Since.Custom]);

  // styles

  // computed

  // methods
  public isDisabled(since: string): boolean {
    return Since[since] >= Since[this.selectedSince];
  }

  public getSinceString(since: string): string {
    return Sinces.toString(since);
  }

  public async onSelect(since: string): Promise<void> {
    if (this.isDisabled(since) === true) {
      return;
    }

    await assets.selectSinceAsync(since);
  }
}
</script>

<style lang="scss" scoped>
.md-field {
  max-width: 180px;
  float: right;
  margin-top: -8px; 
  margin-bottom: 4px;
}
</style>