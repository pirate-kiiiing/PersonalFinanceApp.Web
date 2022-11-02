<template>
  <div v-if="accountant.showEditTransactions">
    <md-dialog 
      :md-active="accountant.showEditTransactions"
      style="width: 90%;"
      :style="manager.getScrollStyle()">
      <md-dialog-title :style="titleStyle">Edit Settled Transactions</md-dialog-title>

      <md-table
        v-model="selectedTransactions"
        md-fixed-header
      >
        <md-table-row
          slot="md-table-row" 
          slot-scope="{ item }"
          class="md-primary"
          style="height: 57px;"
        >
          <md-table-cell 
            md-label="Users"
            class="edit-user"
          >
            <md-avatar>
              <img
                :src="accountant.getUserProfileImage(item.accountId)"
                alt="Avatar"
              >
            </md-avatar>
          </md-table-cell>
          <md-table-cell 
            md-label="Symbol"
            md-sort-by="symbol"
            class="edit-symbol"
          >{{ accountant.getAccountSymbol(item.accountId) }}
          </md-table-cell>
          <md-table-cell 
            md-label="Date" 
            md-sort-by="date"
            class="edit-date"
          ><EditDate :transactionId="item.id" />
          </md-table-cell>
          <md-table-cell 
            md-label="Name" 
            md-sort-by="name"
            class="edit-name"
          >{{ item.name }}
          </md-table-cell>
          <md-table-cell 
            md-label="Amount" 
            md-sort-by="amount"
            class="edit-amount"
            :style="manager.getAmountStyle(item.amount)"
          >
            <EditAmount :transactionId="item.id" />
          </md-table-cell>
          <md-table-cell 
            md-label="Category" 
            md-sort-by="category"
            class="edit-category"
          >
            <ExpenseCategorySelect :transactionId="item.id" />
          </md-table-cell>
          <md-table-cell 
            md-label="Note" 
            md-sort-by="note"
            class="edit-note"
          >
            <EditNote :transactionId="item.id" />
          </md-table-cell>
          <md-table-cell 
            md-label="Actions" 
            class="edit-actions"
          >
            <EditRemove :transactionId="item.id" divStyle="float: left;" />
            <div style="width: 4px; float: left;">&nbsp;</div>
            <EditReset :transactionId="item.id" divStyle="float: left;" />
            <div style="width: 4px; float: left;">&nbsp;</div>
            <EditSave :transactionId="item.id" divStyle="float: left;" />
            <div style="width: 5px; float: left;">&nbsp;</div>
            <EditVerify :transactionId="item.id" />
          </md-table-cell>
        </md-table-row>
      </md-table>

      <md-dialog-actions>
        <md-button @click="closeEdit()">Close</md-button>
        <md-button
          class="md-primary"
          :disabled="isChanged === false"
          @click="accountant.resetFloatingTransactionss(type)"
        >Reset All
        </md-button>
        <md-button
          class="md-accent"
          :disabled="isChanged === false"
          @click="accountant.saveSelectedTransactionsAsync(type)"
        >Save All
        </md-button>
        <md-button
          class="md-accent"
          :disabled="canVerifyAll === false"
          @click="accountant.verifySelectedTransactionsAsync()"
        >Verify All
        </md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import { TransactionType } from './_data';
import manager from './_manager';
import accountant, { ITransaction } from './_store';
import EditAmount from './EditAmount.vue';
import EditDate from './EditDate.vue';
import EditNote from './EditNote.vue';
import EditRemove from './EditRemove.vue';
import EditReset from './EditReset.vue';
import EditSave from './EditSave.vue';
import EditVerify from './EditVerify.vue';
import ExpenseCategorySelect from './ExpenseCategorySelect.vue';
import LayoutConstants from '@/layout/_constants';
import layout from '@/layout/_store';
import SharedConstants from '@/shared/_constants';
import sharedManager from '@/shared/_manager';

@Component({
  components: {
    EditAmount,
    EditDate,
    EditNote,
    EditRemove,
    EditReset,
    EditSave,
    EditVerify,
    ExpenseCategorySelect,
  },
})
export default class EditTransactions extends Vue {
  // data
  public readonly accountant = accountant;
  public readonly delay = SharedConstants.Tooltip.Delay;
  public readonly manager = manager;
  public readonly sharedManager = sharedManager;
  public readonly type = TransactionType.Transaction;

  // styles
  get titleStyle(): object {
    return {
      color: LayoutConstants.Layout.Colors[layout.theme].Primary,
    };
  }

  // computed
  get canVerifyAll(): boolean {
    const selectedTransactions: ITransaction[] = accountant.getSelectedFloatingTransactions(this.type);
    for (const key of Object.keys(selectedTransactions)) {
      const transaction: ITransaction = selectedTransactions[key];
      if (accountant.isVerified(transaction.id) === false) {
        return true;
      }
    }

    return false;
  }

  get isChanged(): boolean {
    const selectedTransactions: ITransaction[] = accountant.getSelectedFloatingTransactions(this.type);
    for (const key of Object.keys(selectedTransactions)) {
      const transaction: ITransaction = selectedTransactions[key];
      if (manager.transactionHasChanged(transaction.id) === true) {
        return true;
      }
    }

    return false;
  }

  get selectedTransactions(): ITransaction[] {
    return accountant.getSelectedFloatingTransactions(this.type);
  }

  // methods
  public closeEdit(): void {
    accountant.toggleEdit({
      show: false,
      type: this.type,
    });
  }
}
</script>

<style lang="scss" scoped>
$fixed-width: 2000px;

.edit-user {
  width: 5%;
  max-width: $fixed-width * 0.05;
}

.edit-symbol {
  width: 5%;
  max-width: $fixed-width * 0.05;
}

.edit-date {
  width: 11%;
  max-width: $fixed-width * 0.11;
}

.edit-name {
  width: 25%;
  max-width: $fixed-width * 0.25;
}

.edit-amount {
  width: 6%;
  max-width: $fixed-width * 0.06;
}

.edit-category {
  width: 10%;
  max-width: $fixed-width * 0.10;
}

.edit-note {
  width: 25%;
  max-width: $fixed-width * 0.25;
}

.edit-actions {
  width: 13%;
  max-width: $fixed-width * 0.13;
}
</style>