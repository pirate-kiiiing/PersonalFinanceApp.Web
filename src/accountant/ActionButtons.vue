<template>
  <div>
    <div class="padding-top">
      <md-button
        class="md-primary button verify"
        :disabled="canVerify === false"
        @click="verifyAll()"
      >
        Verify All
      </md-button>
      <md-button
        class="md-accent button merge"
        :disabled="canMerge === false"
        @click="accountant.toggleMerge()"
      >
        Merge
      </md-button>
      <md-button
        class="button unselect"
        :disabled="canUnselect === false"
        @click="unselectAll()"
      >
        Unselect All
      </md-button>
      <md-button
        class="button expand"
        @click="expand()"
      >
        {{ expandLabel }}
      </md-button>
    </div>
    <div class="padding-bottom"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import { TransactionType } from './_data';
import accountant, { ITransaction } from './_store';

@Component
export default class Actions extends Vue {
  // data
  public accountant = accountant;

  // computed
  get canMerge(): boolean {
    return accountant.getSelectedSize(TransactionType.Pending) === 1
      && accountant.getSelectedSize(TransactionType.Transaction) === 1;
  }

  get canUnselect(): boolean {
    return accountant.getSelectedSize(TransactionType.Pending) > 0
      || accountant.getSelectedSize(TransactionType.Transaction) > 0;
  }

  get canVerify(): boolean {
    const transactions: ITransaction[] =
      accountant.getTransactions(TransactionType.Transaction);

    for (const key of Object.keys(transactions)) {
      const transaction: ITransaction = transactions[key];
      if (accountant.isVerified(transaction.id) === false) {
        return true;
      }
    }

    return false;
  }

  get expandLabel(): string {
    return (accountant.showAllTransactions === true)
      ? 'Reduce' : 'Expand';
  }

  // methods
  public expand(): void {
    accountant.toggleShowAllTransactions();
  }

  public unselectAll(): void {
    accountant.unselectAll();
  }

  public verifyAll(): void {
    accountant.verifyAll();
  }
}
</script>

<style lang="scss" scoped>
.padding-top {
  padding-top: 5px;
}

.padding-bottom{
  clear: right;
  padding-bottom: 5px;
}

.button {
  float: right;
}

.merge {
  margin-right: -3px;
}

.unselect {
  margin-right: 0px;
}

.expand {
  margin-right: 5px;
}

.verify {
  margin-right: 25px;
}
</style>
