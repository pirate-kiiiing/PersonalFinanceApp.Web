<template>
  <div>
    <md-table
      v-model="transactions"
      md-card
      md-fixed-header
      md-sort="date"
      md-sort-order="desc"
      :style="manager.getScrollStyle()"
    >
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <h1 
            class="md-title"
            :style="titleStyle"
          >{{ `${type}s` }}
          </h1>
        </div>

        <md-field 
          md-clearable
          class="md-toolbar-section-end"
          style="max-width: 300px;"
        >
          <md-input
            placeholder="Search by name"
            v-model="search" 
          />
        </md-field>

        <div style="padding-right: 10px;">
          <ActionIcons :type="type" />
        </div>
      </md-table-toolbar>

      <md-table-empty-state
        md-label="No transactions found"
        :md-description="`No transaction found for this '${search}' query. Try a different search term.`">
      </md-table-empty-state>

      <md-table-row
        md-auto-select
        slot="md-table-row" 
        slot-scope="{ item }"
        style="height: 57px;"
        :class="getRowClass(item.id)"
        :id="item.id"
        @click="selectRow(item)"
      >
        <md-table-cell 
          md-label="Users"
          class="user"
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
          class="symbol"
          :style="getRowStyle(item.id)"
        >{{ accountant.getAccountSymbol(item.accountId) }}
        </md-table-cell>
        <md-table-cell 
          md-label="Date" 
          md-sort-by="date"
          class="date"
          :style="getRowStyle(item.id)"
        >{{ getDate(item.id) }}
        </md-table-cell>
        <md-table-cell 
          md-label="Name" 
          md-sort-by="name"
          class="name"
          :style="getRowStyle(item.id)"
        >{{ getName(item.id) }}
        </md-table-cell>
        <md-table-cell 
          md-label="Amount" 
          md-sort-by="amount"
          class="amount"
          :style="getAmountStyle(item)"
        >{{ getAmount(item.id) }}
        </md-table-cell>
        <md-table-cell 
          md-label="Category" 
          md-sort-by="category"
          class="category"
          :style="getRowStyle(item.id)"
        >{{ getCategory(item.id) }}</md-table-cell>
        <md-table-cell 
          md-label="Note" 
          md-sort-by="note"
          class="note"
          :style="getRowStyle(item.id)"
        >{{ getNote(item.id) }}
        </md-table-cell>
        <md-table-cell 
          class="verified"
          :md-label="(showVerified === true) ? 'Verified' : ''"
        >
          <Verify
            v-if="showVerified === true"
            :iconStyle="getVerifyStyle(item.id)"
            :transactionId="item.id"
          />
        </md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import AccountantConstants from './_constants';
import { ExpenseCategory, TransactionState, TransactionType } from './_data';
import manager from './_manager';
import accountant, { ITransaction } from './_store';
import ActionIcons from './ActionIcons.vue';
import Verify from './Verify.vue';
import LayoutConstants from '@/layout/_constants';
import layout from '@/layout/_store';
import sharedManager from '@/shared/_manager';

@Component({
  components: {
    ActionIcons,
    Verify,
  },
})
export default class TransactionTable extends Vue {
  @Prop() public readonly type!: TransactionType;
  // data
  public readonly accountant = accountant;
  public readonly manager = manager;
  public readonly sharedManager = sharedManager;
  public readonly showVerified = this.type === TransactionType.Transaction;
  public search: string | null = null;
  public transactionMap = accountant.transactionMap;
  public originals: ITransaction[] = this.transactions;
  // this flag is needed to prevent Vue Material from auto-deselecting table rows
  // upon transaction changes.
  private isBlocked: boolean = false;

  // style
  get titleStyle(): object {
    return {
      color: LayoutConstants.Layout.Colors[layout.theme].Accent,
      fontWeight: 'bold',
    };
  }

  // computed
  get transactions(): ITransaction[] {
    if (!this.search || this.search === '') {
      const transactions: ITransaction[] =
        accountant.getTransactions(this.type).sort((a, b) => b.date.localeCompare(a.date));

      return (accountant.showAllTransactions === true)
        ? transactions
        : transactions.splice(0, AccountantConstants.Transactions.TableSize);
    } else {
      const transactions: ITransaction[] = accountant.getTransactions(this.type);
      return this.searchByName(transactions, this.search);
    }
  }

  set transactions(transactions: ITransaction[]) {
    this.originals = transactions;
  }

  // methods
  public getAmount(id: string): string {
    const transaction: ITransaction = accountant.getTransaction(id);
    return sharedManager.getFormattedAmount(transaction.amount);
  }

  public getAmountStyle(transaction: ITransaction): object {
    return accountant.isSelected(transaction.id) === true
      ? this.getSelectedStyle()
      : manager.getAmountStyle(transaction.amount);
  }

  public getAlternateLabel(count): string {
    const prefix: string = (this.type === TransactionType.Pending)
      ? 'pending ' : '';
    const plural: string = (count > 1) ? 's' : '';

    return `${count} ${prefix}transaction${plural} selected`;
  }

  public getCategory(id: string): ExpenseCategory {
    return accountant.getTransaction(id).expenseCategory;
  }

  public getDate(id: string): string {
    const transaction: ITransaction = accountant.getTransaction(id);
    return accountant.getTransaction(id).date;
  }

  public getName(id: string): string {
    const transaction: ITransaction = accountant.getTransaction(id);
    return accountant.getTransaction(id).name;
  }

  public getNote(id: string): string {
    return accountant.getTransaction(id).note;
  }

  public getRowClass(id: string): string {
    return (accountant.isSelected(id) === true) ? 'md-primary md-selected' : 'md-primary';
  }

  public getRowStyle(id: string): object {
    if (accountant.isSelected(id) === true) {
      return this.getSelectedStyle();
    }

    const transaction: ITransaction = accountant.getTransaction(id);
    const state: TransactionState = accountant.getTransactionState(id);
    if (state === TransactionState.Verified) {
      return {};
    }

    return {
      color: AccountantConstants.Layout.Colors[layout.theme][state],
    };
  }

  public getSelectedStyle(): object {
    return {
      fontWeight: 'bold',
    };
  }

  public getVerifyStyle(id: string): object {
    if (accountant.isSelected(id) === false) {
      return this.getRowStyle(id);
    }

    return {
      color: AccountantConstants.Layout.Colors[layout.theme].Selected,
      fontWeight: 'bold',
    };
  }

  public selectRow(transaction: ITransaction) {
    accountant.selectTransaction({
      id: transaction.id,
      type: this.type,
    });
  }

  public searchByName(transactions: ITransaction[], term: string | null): ITransaction[] {
    return (term)
      ?  transactions.filter((t) => this.toLower(t.name).includes(this.toLower(term)))
      : transactions;
  }

  public toLower(text: string): string {
    return text.toString().toLowerCase();
  }
}
</script>

<style lang="scss" scoped>
$fixed-width: 2500px;

.user {
  width: 3%;
  max-width: $fixed-width * 0.03;
}

.symbol {
  width: 5%;
  max-width: $fixed-width * 0.05;
}

.date {
  width: 8%;
  max-width: $fixed-width * 0.08;
}

.name {
  // todo
  width: 500px;
  max-width: $fixed-width * 0.42;
}

.amount {
  width: 5%;
  max-width: $fixed-width * 0.05;
}

.category {
  width: 7%;
  max-width: $fixed-width * 0.07;
}

.note {
  width: 25%;
  max-width:$fixed-width * 0.25;
}

.verified {
  width: 5%;
  max-width: $fixed-width * 0.05;
}
</style>
