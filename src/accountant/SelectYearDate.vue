<template>
  <div class="md-layout md-gutter wrapper">
    <SelectYear />
    <SelectMonth />
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import SelectMonth from './SelectMonth.vue';
import SelectYear from './SelectYear.vue';

@Component({
  components: {
    SelectMonth,
    SelectYear,
  },
})
export default class SelectYearDate extends Vue {
  @Prop() public readonly divStyle!: string;
  @Prop() public readonly transactionId!: string;
  // data

  // styles

  // computed

  // methods
}
</script>

<style lang="scss" scoped>
.wrapper {
  margin-left: 2px;
  width: 210px;
}
</style>