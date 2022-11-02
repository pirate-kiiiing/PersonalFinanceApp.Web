<template>
  <div>
    <md-field md-clearable style="margin-top: -30px; margin-bottom: -35px;">
      <md-textarea
        v-model="accountant.getSelectedFloatingTransaction(transactionId).note"
        md-autogrow
      ></md-textarea>
    </md-field>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import _ from 'lodash';
import accountant, { ITransaction } from './_store';

@Component
export default class EditNote extends Vue {
  @Prop() public transactionId!: string;
  // data
  public readonly accountant = accountant;

  // computed
}
</script>

<style lang="scss" scoped>

</style>
