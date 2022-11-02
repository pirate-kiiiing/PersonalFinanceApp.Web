<template>
  <div v-if="accountant.showDeleteTransactions">
    <md-dialog 
      :md-active="accountant.showDeleteTransactions"
      style="width: 90%;"
      :style="manager.getScrollStyle()">
      <md-dialog-title :style="titleStyle">{{ title }}</md-dialog-title>
      <span class="warning-message" :style="warningStyle">
        Warning: This action cannot be undone. Delete the following?
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
          >{{ item.date }}
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
          >{{ sharedManager.getFormattedAmount(item.amount) }}
          </md-table-cell>
          <md-table-cell 
            md-label="Category" 
            md-sort-by="category"
            class="edit-category"
          >{{ item.expenseCategory }}
          </md-table-cell>
          <md-table-cell 
            md-label="Note" 
            md-sort-by="note"
            class="edit-note"
          >{{ item.note }}
          </md-table-cell>
          <md-table-cell 
            md-label="Delete" 
            class="delete-icon"
          >
            <DeleteIcon :id="item.id" :type="type" />
          </md-table-cell>
        </md-table-row>
      </md-table>

      <md-dialog-actions>
        <md-button @click="closeDelete()">Close</md-button>
        <md-button
          class="md-accent"
          @click="accountant.deleteTransactionsAsync()"
        >Delete All
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
import DeleteIcon from './DeleteIcon.vue';
import LayoutConstants from '@/layout/_constants';
import layout from '@/layout/_store';
import SharedConstants from '@/shared/_constants';
import sharedManager from '@/shared/_manager';

@Component({
  components: {
    DeleteIcon,
  },
})
export default class DeleteTransactions extends Vue {
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
  get title(): string {
    return (this.type === TransactionType.Pending)
      ? 'Delete Pending Transactions'
      : 'Delete Transactions';
  }

  get type(): TransactionType {
    return accountant.selectedDeleteTransactionType!;
  }

  get selectedTransactions(): ITransaction[] {
    return accountant.getSelectedTransactions(this.type);
  }

  // methods
  public closeDelete(): void {
    accountant.toggleDelete({
      show: false,
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
  width: 10%;
  max-width: $fixed-width * 0.1;
}

.edit-name {
  width: 32%;
  max-width: $fixed-width * 0.32;
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
  width: 28%;
  max-width:$fixed-width * 0.28;
}

.delete-icon {
  width: 5%;
  max-width:$fixed-width * 0.05;
}

.warning-message {
  padding-left: 23px;
  font-size: 17px;
}
</style>