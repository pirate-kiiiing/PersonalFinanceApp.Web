import _ from 'lodash';
import { ExpenseCategory, ExpenseType } from './_data';
import accountant, { IAccount, ITransaction } from './_store';
import {
  PirateKingExpenseType,
  IGetAccountResponseContractV1,
  IGetTransactionResponseContractV1,
  IMergeTransactionResponseContractV1,
  IPutTransactionRequestContractV1,
} from '@/clients/pirateKingClient';
import layout from '@/layout/_store';
import sharedManager from '@/shared/_manager';
import { device } from '@/shared/_tools';
import { pirateKingException } from '@/shared/PirateKingException';

class AccountantManager {
  public convertToAccount(item: IGetAccountResponseContractV1): IAccount {
    return {
      id: item.id,
      name: item.name,
      symbol: item.symbol,
      tenantId: item.tenantId,
      type: this.getExpenseType(item.expenseType!),
      userId: item.userId,
    };
  }

  public converToPutTransactionRequest(transaction: ITransaction): IPutTransactionRequestContractV1 {
    return {
      accountId: transaction.accountId,
      amount: transaction.amount,
      date: transaction.date,
      expenseCategory: transaction.expenseCategory,
      id: transaction.id,
      name: transaction.name,
      note: transaction.note,
      tenantId: transaction.tenantId,
      verifiedDate: transaction.verifiedDate,
    };
  }

  public convertToTransaction(item: IGetTransactionResponseContractV1): ITransaction {
    return {
      accountId: item.accountId,
      amount: item.amount,
      date: item.date,
      expenseCategory: item.expenseCategory,
      id: item.id,
      isPending: item.isPending,
      mergedDate: item.mergedDate,
      name: item.name,
      note: (item.note) ? item.note : '',
      tenantId: item.tenantId,
      verifiedDate: item.verifiedDate,
    };
  }

  public convertMergeResposneToTransaction(item: IMergeTransactionResponseContractV1): ITransaction {
    return {
      accountId: item.accountId,
      amount: item.amount,
      date: item.date,
      expenseCategory: item.expenseCategory,
      id: item.id,
      isPending: item.isPending,
      mergedDate: item.mergedDate,
      name: item.name,
      note: (item.note) ? item.note : '',
      tenantId: item.tenantId,
      verifiedDate: item.verifiedDate,
    };
  }

  public getAmountStyle(amount: number): object {
    return {
      color: sharedManager.getAmountColor(amount, layout.theme),
    };
  }

  public getChartCategories(): ExpenseCategory[] {
    return _.keys(ExpenseCategory).filter((ec) => ec !== ExpenseCategory.Special);
  }

  public getScrollStyle(): object {
    return (device.isMobile() === true)
      ? { overflowX: 'scroll' }
      : {};
  }

  public transactionHasChanged(id: string): boolean {
    const transaction: ITransaction = accountant.getTransaction(id);
    const floating: ITransaction = accountant.getFloatingTransaction(id);

    return _.isEqual(transaction, floating) === false;
  }

  private getExpenseType(gsExpenseType: PirateKingExpenseType): ExpenseType {
    switch (gsExpenseType) {
      case PirateKingExpenseType.Cash:
        return ExpenseType.Cash;

      case PirateKingExpenseType.Checking:
        return ExpenseType.Checking;

      case PirateKingExpenseType.Credit:
        return ExpenseType.Credit;

      case PirateKingExpenseType.Saving:
        return ExpenseType.Saving;
    }

    throw new pirateKingException('Unknown PirateKingExpenseType');
  }
}

export default new AccountantManager();
