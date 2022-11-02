<template>
  <div v-if="isLoaded === true">
    <SelectYearDate />
    <!-- Charts -->
    <div style="margin-left: 15px;">
      <ChartLayout />
    </div>

    <!-- Transaction Table -->
    <TransactionTable :type="TransactionType.Transaction" />
    <ActionButtons />
    <TransactionTable :type="TransactionType.Pending" />
    <div class="bottom-padding"></div>
    
    <!-- Dialogs -->
    <DeleteTransactions />
    <EditTransactions />
    <EditPendings />
    <MergeTransactions />
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import { TransactionType } from './_data';
import accountant from './_store';
import ActionButtons from './ActionButtons.vue';
import ChartLayout from './ChartLayout.vue';
import DeleteTransactions from './DeleteTransactions.vue';
import EditPendings from './EditPendings.vue';
import EditTransactions from './EditTransactions.vue';
import MergeTransactions from './MergeTransactions.vue';
import SelectYearDate from './SelectYearDate.vue';
import TransactionTable from './TransactionTable.vue';

@Component({
  components: {
    ActionButtons,
    ChartLayout,
    DeleteTransactions,
    EditPendings,
    EditTransactions,
    MergeTransactions,
    SelectYearDate,
    TransactionTable,
  },
})
export default class Accountant extends Vue {
  // data
  public TransactionType = TransactionType;

  // lifecycle
  public async mounted(): Promise<void> {
    // navigating back to Assets menu triggers mounted again (e.g. Dashboard -> Assets)
    if (this.isLoaded === true) {
      return;
    }

    await accountant.initAsync();
  }

  // computed
  get isLoaded(): boolean {
    return accountant.transactions.length > 0;
  }

  // methods
}
</script>

<style lang="scss" scoped>
.bottom-padding {
  padding-bottom: 15px;
}
</style>
