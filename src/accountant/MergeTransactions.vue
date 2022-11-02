<template>
  <div v-if="accountant.showMergeTransactions">
    <md-dialog 
      :md-active="accountant.showMergeTransactions"
      style="width: 90%;"
      :style="manager.getScrollStyle()">
      <md-dialog-title :style="titleStyle">Merge Transactions</md-dialog-title>
      <span class="warning-message" :style="warningStyle">
        Warning: This action cannot be undone. Merge the two transactions?
      </span>
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
            md-label="Type" 
            class="type"
            :style="getRowStyle(item.id)"
          >
            <span><i>{{ getTransactionType(item.id) }}</i></span>
          </md-table-cell>
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
            :style="getRowStyle(item.id)"
          >{{ accountant.getAccountSymbol(item.accountId) }}
          </md-table-cell>
          <md-table-cell 
            md-label="Date" 
            md-sort-by="date"
            class="edit-date"
            :style="getRowStyle(item.id)"
          >{{ item.date }}
          </md-table-cell>
          <md-table-cell 
            md-label="Name" 
            md-sort-by="name"
            class="edit-name"
            :style="getRowStyle(item.id)"
          >{{ item.name }}
          </md-table-cell>
          <md-table-cell 
            md-label="Amount" 
            md-sort-by="amount"
            class="edit-amount"
            :style="manager.getAmountStyle(item.amount)"
          >{{ sharedManager.getFormattedAmount(item.amount) }}
          </md-table-cell>
          <md-table-cell 
            md-label="Category" 
            md-sort-by="category"
            class="edit-category"
            :style="getRowStyle(item.id)"
          >{{ item.expenseCategory }}
          </md-table-cell>
          <md-table-cell 
            md-label="Note" 
            md-sort-by="note"
            class="edit-note"
            :style="getRowStyle(item.id)"
          >{{ item.note }}
          </md-table-cell>
        </md-table-row>
      </md-table>

      <md-dialog-actions>
        <md-button @click="accountant.toggleMerge(false)">Close</md-button>
        <md-button
          class="md-accent"
          @click="accountant.mergeTransactionsAsync(false)"
        >Merge
        </md-button>
        <md-button
          class="md-primary"
          @click="accountant.mergeTransactionsAsync(true)"
        >Merge &amp; Verify
        </md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import AccountConstants from './_constants';
import { TransactionState, TransactionType } from './_data';
import manager from './_manager';
import accountant, { ITransaction } from './_store';
import LayoutConstants from '@/layout/_constants';
import layout from '@/layout/_store';
import SharedConstants from '@/shared/_constants';
import sharedManager from '@/shared/_manager';

@Component
export default class MergeTransactions extends Vue {
  // data
  public readonly accountant = accountant;
  public readonly delay = SharedConstants.Tooltip.Delay;
  public readonly manager = manager;
  public readonly sharedManager = sharedManager;

  // styles
  get titleStyle(): object {
    return {
      color: LayoutConstants.Layout.Colors[layout.theme].Primary,
    };
  }

  get warningStyle(): object {
    return {
      color: LayoutConstants.Layout.Colors[layout.theme].Accent,
    };
  }

  // computed
  get selectedTransactions(): ITransaction[] {
    return [
      accountant.getSelectedTransactions(TransactionType.Transaction)[0],
      accountant.getSelectedTransactions(TransactionType.Pending)[0],
    ];
  }

  // methods
  public getTransactionType(id: string): TransactionType {
    return accountant.getTransactionType(id);
  }

  public getRowStyle(id: string): object {
    const transaction: ITransaction = accountant.getTransaction(id);
    const state: TransactionState = accountant.getTransactionState(id);

    return {
      color: AccountConstants.Layout.Colors[layout.theme][state],
    };
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
  width: 10%;
  max-width: $fixed-width * 0.1;
}

.edit-name {
  width: 30%;
  max-width: $fixed-width * 0.30;
}

.edit-amount {
  width: 5%;
  max-width: $fixed-width * 0.05;
}

.edit-category {
  width: 10%;
  max-width: $fixed-width * 0.10;
}

.edit-note {
  width: 30%;
  max-width:$fixed-width * 0.3;
}

.type {
  width: 5%;
  max-width:$fixed-width * 0.05;
}

.warning-message {
  padding-left: 23px;
  font-size: 17px;
}
</style>