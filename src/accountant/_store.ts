import { Vue } from 'vue-property-decorator';
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import { AxiosResponse } from 'Axios';
import _ from 'lodash';
import moment from 'moment';
import { ExpenseCategory, ExpenseType, TransactionState, TransactionType } from './_data';
import manager from './_manager';
import pirateKingClient from '@/clients/pirateKingClient';
import {
  IGetAccountResponseContractV1,
  IGetTransactionResponseContractV1,
  IGetUserResponseContractV1,
  IMergeTransactionResponseContractV1,
  IPutTransactionRequestContractV1,
} from '@/clients/pirateKingClient';
import { Menus } from '@/layout/_data';
import layout from '@/layout/_store';
import loaderAction from '@/layout/loaderAction';
import sharedManager from '@/shared/_manager';
import store from '@/shared/_store';
import { Date } from '@/shared/Date';
import tenantManager from '@/tenant/_manager';
import tenant, { IUser } from '@/tenant/_store';

export interface IAccount {
  id: string;
  name: string;
  symbol: string;
  tenantId: string;
  type: ExpenseType;
  userId: string;
}

interface IAccountantState {
  accounts: { [ key: string ]: IAccount };
  floatingTransactions: { [ id: string ]: ITransaction };
  selectedDeleteTransactionType: TransactionType | undefined;
  selectedPendingIds: { [ id: string ]: boolean };
  selectedTransactionIds: { [ id: string ]: boolean };
  selectedMonth: number;
  selectedYear: number;
  showAllTransactions: boolean;
  showDeleteTransactions: boolean;
  showEditPendings: boolean;
  showEditTransactions: boolean;
  showMergeTransactions: boolean;
  transactions: { [ id: string ]: ITransaction };
}

export interface ITransaction {
  accountId: string;
  amount: number;
  date: string;
  expenseCategory: ExpenseCategory;
  id: string;
  isPending: boolean;
  mergedDate?: string;
  name: string;
  note: string;
  tenantId: string;
  verifiedDate?: string;
}

// initial state
const initialState: IAccountantState = {
  accounts: {},
  floatingTransactions: {},
  selectedDeleteTransactionType: undefined,
  selectedPendingIds: {},
  selectedTransactionIds: {},
  selectedMonth: moment().month() + 1,
  selectedYear: moment().year(),
  showAllTransactions: false,
  showDeleteTransactions: false,
  showEditPendings: false,
  showEditTransactions: false,
  showMergeTransactions: false,
  transactions: {},
};

const path: string = Menus.Accountant.path;

@Module({
  namespaced: true,
  name: 'AccountantStore',
  store,
  dynamic: true,
})
class AccountantStore extends VuexModule {
  // lowercase 'state' is reserved in Vuex
  private State: IAccountantState = _.cloneDeep(initialState);

  get chartTransactions(): ITransaction[] {
    return this.transactions.filter((t) => t.expenseCategory !== ExpenseCategory.Special);
  }

  get showAllTransactions(): boolean {
    return this.State.showAllTransactions;
  }

  get selectedDeleteTransactionType(): TransactionType | undefined {
    return this.State.selectedDeleteTransactionType;
  }

  get selectedMonth(): number {
    return this.State.selectedMonth;
  }

  get selectedYear(): number {
    return this.State.selectedYear;
  }

  get showDeleteTransactions(): boolean {
    return this.State.showDeleteTransactions;
  }

  get showEditPendings(): boolean {
    return this.State.showEditPendings;
  }

  get showEditTransactions(): boolean {
    return this.State.showEditTransactions;
  }

  get showMergeTransactions(): boolean {
    return this.State.showMergeTransactions;
  }

  get transactions(): ITransaction[] {
    return _.values(this.State.transactions);
  }

  get transactionMap(): { [ id: string]: ITransaction } {
    return this.State.transactions;
  }

  /* getters with parameters */
  get getAccount() {
    return (id: string): IAccount => this.State.accounts[id];
  }

  get getAccountSymbol() {
    return (accountId: string): string =>
      (this.getAccount(accountId))
        ? this.getAccount(accountId).symbol
        : '';
  }

  get getFloatingTransaction() {
    return (id: string): ITransaction => this.State.floatingTransactions[id];
  }

  get getFloatingTransactions() {
    return (type: TransactionType): ITransaction[] =>
      (type === TransactionType.Pending)
        ? _.values(this.State.floatingTransactions)
          .filter((t) => t.state === TransactionState.Pending)
        : _.values(this.State.floatingTransactions)
          .filter((t) => t.state !== TransactionState.Pending);
  }

  get getSelectedFloatingTransaction() {
    return (id: string): ITransaction =>
      this.context.getters.getSelectedFloatingTransactions().filter((t) => t.id === id)[0];
  }

  get getSelectedFloatingTransactions() {
    return (type?: TransactionType): ITransaction[] => {
      const selectedTransactions: ITransaction[] = [];
      const selectedIds: string[] =
        (type === undefined)
        ? [
          ...this.getSelectedIds(TransactionType.Pending),
          ...this.getSelectedIds(TransactionType.Transaction),
        ] : this.getSelectedIds(type);

      selectedIds.forEach((id) => {
        if (this.State.floatingTransactions[id]) {
          selectedTransactions.push(this.State.floatingTransactions[id]);
        }
      });

      return selectedTransactions.sort((a, b) => b.date.localeCompare(a.date));
    };
  }

  get getSelectedIds() {
    return (type: TransactionType): string[] =>
      (type === TransactionType.Pending)
        ? _.keys(this.State.selectedPendingIds)
        : _.keys(this.State.selectedTransactionIds);
  }

  get getSelectedSize() {
    return (type: TransactionType): number => this.getSelectedIds(type).length;
  }

  get getSelectedTransactions() {
    return (type: TransactionType): ITransaction[] => {
      const transactions: ITransaction[] = [];
      const selectedIds: string[] = this.getSelectedIds(type);

      selectedIds.forEach((id) =>
        transactions.push(this.getTransaction(id)));

      return transactions;
    };
  }

  get getTotal() {
    return (params: {
      category?: ExpenseCategory,
      startDate: string,
      endDate: string,
    }): number => {
      const { category, startDate, endDate } = params;
      let transactions: ITransaction[] = this.chartTransactions.filter((t) => startDate <= t.date && t.date <= endDate);

      if (!category) {
        return _.sumBy(transactions, (t) => t.amount);
      } else {
        transactions = this.chartTransactions
          .filter((t) => t.expenseCategory === category && startDate <= t.date && t.date <= endDate);
        return _.sumBy(transactions, (t) => t.amount);
      }
    };
  }

  get getProportion() {
    return (params: {
      category?: ExpenseCategory,
      startDate: string,
      endDate: string,
    }): number => {
      return this.getTotal(params) / this.getTotal({
        startDate: params.startDate,
        endDate: params.endDate,
      });
    };
  }

  get getTransaction() {
    return (id: string): ITransaction => this.State.transactions[id];
  }

  get getTransactions() {
    return (type: TransactionType): ITransaction[] =>
      this.transactions.filter((t) => this.getTransactionType(t.id) === type);
  }

  get getTransactionState() {
    return (id: string): TransactionState => {
      const transaction: ITransaction = this.State.transactions[id];

      if (transaction.verifiedDate) {
        return TransactionState.Verified;
      } else if (transaction.mergedDate) {
        return TransactionState.Merged;
      } else if (transaction.isPending === false) {
        return TransactionState.Settled;
      } else {
        return TransactionState.Pending;
      }
    };
  }

  get getTransactionType() {
    return (id: string): TransactionType =>
      (this.getTransactionState(id) === TransactionState.Pending)
        ? TransactionType.Pending
        : TransactionType.Transaction;
  }

  get getUserProfileImage() {
    return (accountId: string): string | undefined => {
      const account = this.getAccount(accountId);
      const user = tenant.getUser(account.userId);

      return (user) ? user.profileImageUrl : undefined;
    };
  }

  get isSelected() {
    return (id: string): boolean =>
      (this.State.selectedPendingIds[id] === true) ||
      (this.State.selectedTransactionIds[id] === true);
  }

  get isVerified() {
    return (id: string): boolean => {
      const transaction: ITransaction = this.State.transactions[id];
      return this.getTransactionState(transaction.id) === TransactionState.Verified;
    };
  }

  @Action
  public clear(showSignInButton: boolean): void {
    this.context.commit('Clear', showSignInButton);
  }

  @Action
  public async deleteTransactionAsync(params: {
    id: string,
    type: TransactionType,
  }): Promise<void> {
    const { id, type } = params;

    const response: AxiosResponse<void | any>
      = await loaderAction.sendAsync(() => pirateKingClient.deleteTransactionsAsync([id]));

    const result = sharedManager.handleDeleteApiResponse(response, path);
    if (result.success === false) {
      return;
    }

    layout.setSnackBar({
      isSuccess: true,
      message: `Deleted 1 transaction`,
      show: true,
    });

    this.context.commit('DeleteTransaction', id);

    if (this.getSelectedSize(type) <= 0) {
      this.context.commit('ToggleDelete', { show: false });
    }
  }

  @Action
  public async deleteTransactionsAsync(): Promise<void> {
    const selectedIds: string[] = this.getSelectedIds(this.State.selectedDeleteTransactionType!);
    if (selectedIds.length <= 0) {
      return;
    }

    const response: AxiosResponse<void | any>
      = await loaderAction.sendAsync(() => pirateKingClient.deleteTransactionsAsync(selectedIds));

    const result = sharedManager.handleDeleteApiResponse(response, path);
    if (result.success === false) {
      return;
    }

    const plural: string = (selectedIds.length > 1) ? 's' : '';

    layout.setSnackBar({
      isSuccess: true,
      message: `Deleted ${selectedIds.length} transaction${plural}`,
      show: true,
    });

    this.context.commit('DeleteTransactions', this.State.selectedDeleteTransactionType);
    this.context.commit('ToggleDelete', { show: false });
  }

  @Action
  public toggleShowAllTransactions(): void {
    this.context.commit('ShowAllTransactions', !this.State.showAllTransactions);
  }

  // @Action({ rawError: true })
  @Action
  public async initAsync(): Promise<void> {
    const curMonth: Date = Date.GetDate(this.selectedYear, this.selectedMonth, 1);
    const startDate: Date = curMonth.addMonths(-2);
    const endDate: Date = curMonth.addMonths(1).addDays(-1);
    const getAccountsPromise = pirateKingClient.getAccountsAsync(false, true);
    const getTransactionsPromise = pirateKingClient.getTransactionsAsync(startDate, endDate);
    const getUsersPromise = pirateKingClient.getUsersAsync();
    // @ts-ignore
    const [ getAccountsResponse, getTransactionsResponse, getUsersResponse ]
      = await loaderAction.sendAsync(() => Promise.all([getAccountsPromise, getTransactionsPromise, getUsersPromise]));

    // failed to get accounts
    let result = sharedManager.handleApiResponse(getAccountsResponse, path);
    if (result.success === false) {
      return;
    }

    // failed to get account transactions
    result = sharedManager.handleApiResponse(getTransactionsResponse, path);
    if (result.success === false) {
      return;
    }

    // failed to get users
    result = sharedManager.handleApiResponse(getUsersResponse, path);
    if (result.success === false) {
      return;
    }

    const accountResponses = getAccountsResponse.data as IGetAccountResponseContractV1[];
    const transactionResponses = getTransactionsResponse.data as IGetTransactionResponseContractV1[];
    const userResponses = getUsersResponse.data as IGetUserResponseContractV1[];

    if (!accountResponses || !transactionResponses || !userResponses ||
        accountResponses.length <= 0 || transactionResponses.length <= 0 || userResponses.length <= 0) {
      return;
    }

    const accountList: IAccount[] = accountResponses.map((a) => manager.convertToAccount(a));
    const transactionList: ITransaction[] = transactionResponses.map((c) => manager.convertToTransaction(c));
    const userList: IUser[] = userResponses.map((u) => tenantManager.convertToUser(u));
    const accounts: { [ key: string ]: IAccount } = _.keyBy(accountList, (a) => a.id);
    const transactions: { [ key: string ]: ITransaction } = _.keyBy(transactionList, (c) => c.id);
    const users: { [ key: string ]: IUser } = _.keyBy(userList, (u) => u.id);

    tenant.setUsers(users);
    this.context.commit('Init', { accounts, transactions });
  }

  @Action
  public async mergeTransactionsAsync(verify: boolean): Promise<void> {
    const transactionId: string = this.getSelectedTransactions(TransactionType.Transaction)[0].id;
    const pendingId: string = this.getSelectedTransactions(TransactionType.Pending)[0].id;
    const verifiedDate = (verify === true) ? sharedManager.getUtcNowDateTimeStr() : undefined;

    const response: AxiosResponse<IMergeTransactionResponseContractV1 | any>
      = await loaderAction.sendAsync(() =>
          pirateKingClient.mergeTransactionsAsync(transactionId, pendingId, verifiedDate));

    const result = sharedManager.handleApiResponse(response, path);
    if (result.success === false) {
      return;
    }

    const data = response.data as IMergeTransactionResponseContractV1;
    const transaction: ITransaction = manager.convertMergeResposneToTransaction(data);

    layout.setSnackBar({
      isSuccess: true,
      message: 'Merged 2 transactions',
      show: true,
    });

    this.context.commit('MergeTransactions', {
      transaction,
      pendingId,
    });

    this.context.commit('ToggleMerge', false);
  }

  @Action
  public removeTransaction(id: string): void {
    const type: TransactionType = this.getTransactionType(id);

    this.context.commit('RemoveTransaction', {
      id,
      type,
    });

    if (this.getSelectedSize(type) <= 0) {
      this.context.commit('ToggleEdit', {
        show: false,
        type,
      });
    }
  }

  @Action
  public resetFloatingTransactions(id: string): void {
    this.context.commit('ResetFloatingTransactions', id);
  }

  @Action
  public resetFloatingTransactionss(type: TransactionType): void {
    const selectedTransactionIds: string[] =
      this.context.getters
        .getSelectedFloatingTransactions(type)
        .map((t) => t.id);

    this.context.commit('ResetFloatingTransactionss', selectedTransactionIds);
  }

  @Action
  public async saveSelectedTransactionAsync(id: string): Promise<void> {
    const selectedTransaction: ITransaction =
      this.context.getters.getSelectedFloatingTransaction(id);
    const request = manager.converToPutTransactionRequest(selectedTransaction);

    const response: AxiosResponse<void | any>
      = await loaderAction.sendAsync(() => pirateKingClient.putTransactionAsync(request));

    const result = sharedManager.handleApiResponse(response, path);
    if (result.success === false) {
      return;
    }

    layout.setSnackBar({
      isSuccess: true,
      message: 'Saved 1 transaction',
      show: true,
    });

    this.context.commit('SaveTransaction', id);
  }

  @Action
  public async saveSelectedTransactionsAsync(type: TransactionType): Promise<void> {
    const selectedTransactions: ITransaction[] =
      this.context.getters.getSelectedFloatingTransactions(type);
    const request: IPutTransactionRequestContractV1[] =
      selectedTransactions
      // only save the transactions that are modified
        .filter((t) => manager.transactionHasChanged(t.id) === true)
        .map((t) => manager.converToPutTransactionRequest(t));

    const response: AxiosResponse<void | any>
      = await loaderAction.sendAsync(() => pirateKingClient.putTransactionsAsync(request));

    const result = sharedManager.handleApiResponse(response, path);
    if (result.success === false) {
      return;
    }

    const plural = (request.length > 1) ? 's' : '';

    layout.setSnackBar({
      isSuccess: true,
      message: `Saved ${request.length} transaction${plural}`,
      show: true,
    });

    const ids: string[] = selectedTransactions.map((t) => t.id);

    this.context.commit('SaveTransactions', {
      ids,
      type,
    });
    this.context.commit('ToggleEdit', {
      show: false,
      type,
    });
  }

  @Action
  public selectTransaction(params: {
    id: string,
    type: TransactionType,
  }): void {
    this.context.commit('SelectTransaction', params);
  }

  @Action
  public async selectMonthAsync(month: number): Promise<void> {
    const selectedDate: Date = Date.GetDate(this.selectedYear, month, 1);
    const startDate: Date = selectedDate.addMonths(-2);
    const endDate: Date = selectedDate.addMonths(1).addDays(-1);

    const response: AxiosResponse<void | any>
      = await loaderAction.sendAsync(() => pirateKingClient.getTransactionsAsync(startDate, endDate));

    const result = sharedManager.handleApiResponse(response, path);
    if (result.success === false) {
      return;
    }

    const transactions: ITransaction[] = response.data.map((c) => manager.convertToTransaction(c));

    this.context.commit('SetSelectedMonth', month);
    this.context.commit('SetTransactions', transactions);

    layout.setSnackBar({
      isSuccess: true,
      message: `Fetched ${transactions.length} transactions for ${this.selectedYear}-${this.selectedMonth}`,
      show: true,
    });
  }

  @Action
  public async selectYearAsync(year: number): Promise<void> {
    const selectedDate: Date = Date.GetDate(year, this.selectedMonth, 1);
    const startDate: Date = selectedDate.addMonths(-2);
    const endDate: Date = selectedDate.addMonths(1).addDays(-1);

    const response: AxiosResponse<void | any>
      = await loaderAction.sendAsync(() => pirateKingClient.getTransactionsAsync(startDate, endDate));

    const result = sharedManager.handleApiResponse(response, path);
    if (result.success === false) {
      return;
    }

    const transactions: ITransaction[] = response.data.map((c) => manager.convertToTransaction(c));

    this.context.commit('SetSelectedYear', year);
    this.context.commit('SetTransactions', transactions);

    layout.setSnackBar({
      isSuccess: true,
      message: `Fetched ${transactions.length} transactions for ${this.selectedYear}-${this.selectedMonth}`,
      show: true,
    });
  }

  @Action
  public toggleDelete(params: {
    show: boolean,
    type?: TransactionType,
  }): void {
    const { show, type } = params;
    if (show === true && this.State.showDeleteTransactions === true) {
      return;
    } else if (show === false && this.State.showDeleteTransactions === false) {
      return;
    }

    this.context.commit('ToggleDelete', params);
  }

  @Action
  public toggleEdit(params: {
    show: boolean,
    type: TransactionType,
  }): void {
    const { show, type } = params;
    if (type === TransactionType.Pending && this.State.showEditPendings === show) {
      return;
    } else if (type === TransactionType.Transaction && this.State.showEditTransactions === show) {
      return;
    }
    if (show === true) {
      // add floating transactions if they do not exist
      this.context.commit('SetFloatingTransactions', this.getSelectedIds(type));
    }

    this.context.commit('ToggleEdit', params);
  }

  @Action
  public toggleMerge(): void {
    this.context.commit('ToggleMerge', !this.State.showMergeTransactions);
  }

  @Action
  public unselectAll(type?: TransactionType): void {
    if (this.getSelectedSize(TransactionType.Pending) <= 0 &&
        this.getSelectedSize(TransactionType.Transaction) <= 0) {
      return;
    }

    this.context.commit('UnselectAll', type);
  }

  /**
   * Opens EditTransaction dialog with only the
   * verifiable transactions selected
   */
  @Action
  public verifyAll(): void {
    if (this.State.showEditTransactions === true) {
      return;
    }

    const verifiableIds: string[] =
      this.getTransactions(TransactionType.Transaction)
          .filter((t) => this.isVerified(t.id) === false)
          .map((t) => t.id);

    if (verifiableIds.length <= 0) {
      return;
    }

    this.context.commit('SetFloatingTransactions', verifiableIds);

    this.context.commit('VerifyAll', verifiableIds);
  }

  /**
   * Saves and verifies a transaction
   */
  @Action
  public async verifySelectedTransactionAsync(params: {
    id: string,
    verify: boolean,
  }): Promise<void> {
    const { id, verify } = params;
    const selectedTransaction: ITransaction =
      this.getSelectedFloatingTransaction(id);
    const currentState: TransactionState =
      this.getTransactionState(selectedTransaction.id);

    if (verify === true && currentState === TransactionState.Verified) {
      return;
    } else if (verify === false && currentState !== TransactionState.Verified) {
      return;
    }

    const verifiedDate = (verify === true) ? sharedManager.getUtcNowDateTimeStr() : undefined;
    const verifiedTransaction: ITransaction = {
      ...selectedTransaction,
      verifiedDate,
    };
    const request = manager.converToPutTransactionRequest(verifiedTransaction);

    const response: AxiosResponse<void | any>
      = await loaderAction.sendAsync(() => pirateKingClient.putTransactionAsync(request));

    const result = sharedManager.handleApiResponse(response, path);
    if (result.success === false) {
      return;
    }

    const verifyStr: string = (verify === true) ? 'Verified' : 'Unverified';

    layout.setSnackBar({
      isSuccess: true,
      message: `${verifyStr} and saved 1 transaction`,
      show: true,
    });

    this.context.commit('VerifyTransaction', {
      id,
      verifiedDate,
    });
  }

  /**
   * Saves and verifies selected eligible transactions
   */
  @Action
  public async verifySelectedTransactionsAsync(): Promise<void> {
    const selectedTransactions: ITransaction[] =
      this.getSelectedFloatingTransactions(TransactionType.Transaction);
    const verifiableTransactions: ITransaction[] =
      selectedTransactions.filter((t) =>
        this.getTransactionState(t.id) !== TransactionState.Verified);
    const verifiedDate = sharedManager.getUtcNowDateTimeStr();
    const request = verifiableTransactions.map((t) => {
      return {
        ...manager.converToPutTransactionRequest(t),
        verifiedDate,
      };
    });

    const response: AxiosResponse<void | any>
      = await loaderAction.sendAsync(() => pirateKingClient.putTransactionsAsync(request));

    const result = sharedManager.handleApiResponse(response, path);
    if (result.success === false) {
      return;
    }

    const plural = (request.length > 1) ? 's' : '';

    layout.setSnackBar({
      isSuccess: true,
      message: `Verified and saved ${request.length} transaction${plural}`,
      show: true,
    });

    const ids: string[] = verifiableTransactions.map((t) => t.id);

    this.context.commit('VerifyTransactions', {
      ids,
      verifiedDate,
    });
    this.context.commit('ToggleEdit', {
      show: false,
      type: TransactionType.Transaction,
    });
  }

  @Mutation
  private Clear(): void {
    const state: IAccountantState = _.cloneDeep(initialState);

    this.State = state;
  }

  @Mutation
  private DeleteTransaction(id: string): void {
    Vue.delete(this.State.transactions, id);

    if (this.State.floatingTransactions[id]) {
      Vue.delete(this.State.floatingTransactions, id);
    }

    if (this.State.selectedPendingIds[id]) {
      Vue.delete(this.State.selectedPendingIds, id);
    } else {
      Vue.delete(this.State.selectedTransactionIds, id);
    }
  }

  @Mutation
  private DeleteTransactions(type: TransactionType): void {
    const selectedIds: string[] = (type === TransactionType.Pending)
      ? _.keys(this.State.selectedPendingIds)
      : _.keys(this.State.selectedTransactionIds);

    selectedIds.forEach((id) => {
      Vue.delete(this.State.transactions, id);

      if (this.State.floatingTransactions[id]) {
        Vue.delete(this.State.floatingTransactions, id);
      }
    });

    if (type === TransactionType.Pending) {
      this.State.selectedPendingIds = {};
    } else {
      this.State.selectedTransactionIds = {};
    }
  }

  @Mutation
  private ShowAllTransactions(expand: boolean): void {
    this.State.showAllTransactions = expand;
  }

  @Mutation
  private Init(params: {
    accounts: { [ key: string ]: IAccount },
    transactions: { [ key: string ]: ITransaction } }): void {
    const { accounts, transactions } = params;

    this.State = {
      ...this.State,
      accounts: _.cloneDeep(accounts),
      transactions: _.cloneDeep(transactions),
    };
  }

  @Mutation
  private MergeTransactions(params: {
    transaction: ITransaction,
    pendingId: string,
  }): void {
    const { transaction, pendingId } = params;

    this.State.selectedPendingIds = {};
    this.State.selectedTransactionIds = {};

    Vue.delete(this.State.transactions, pendingId);

    if (this.State.floatingTransactions) {
      Vue.delete(this.State.floatingTransactions, pendingId);
    }

    this.State.transactions[transaction.id] = transaction;
  }

  @Mutation
  private RemoveTransaction(params: {
    id: string,
    type: TransactionType,
  }): void {
    const { id, type } = params;

    if (type === TransactionType.Pending) {
      Vue.delete(this.State.selectedPendingIds, id);
    } else {
      Vue.delete(this.State.selectedTransactionIds, id);
    }
  }

  @Mutation
  private ResetFloatingTransactions(id: string): void {
    this.State.floatingTransactions[id] = _.cloneDeep(this.State.transactions[id]);
  }

  @Mutation
  private ResetFloatingTransactionss(ids: string[]): void {
    ids.forEach((id) => {
      this.State.floatingTransactions[id] = _.cloneDeep(this.State.transactions[id]);
    });
  }

  @Mutation
  private SaveTransaction(id: string): void {
    this.State.transactions[id] = _.cloneDeep(this.State.floatingTransactions[id]);
  }

  /**
   * Saves and closes the edit dialog upon saving
   */
  @Mutation
  private SaveTransactions(params: {
    ids: string[],
    type: TransactionType,
  }): void {
    const { ids, type } = params;

    ids.forEach((id) => {
      this.State.transactions[id] = _.cloneDeep(this.State.floatingTransactions[id]);
    });

    if (type === TransactionType.Pending) {
      this.State.selectedPendingIds = {};
    } else {
      this.State.selectedTransactionIds = {};
    }
  }

  @Mutation
  private SelectTransaction(params: {
    id: string,
    type: TransactionType,
  }): void {
    const { id, type } = params;

    if (type === TransactionType.Pending) {
      if (this.State.selectedPendingIds[id] === true) {
        Vue.delete(this.State.selectedPendingIds, id);
      } else {
        Vue.set(this.State.selectedPendingIds, id, true);
      }
    } else {
      if (this.State.selectedTransactionIds[id] === true) {
        Vue.delete(this.State.selectedTransactionIds, id);
      } else {
        Vue.set(this.State.selectedTransactionIds, id, true);
      }
    }
  }

  @Mutation
  private SetTransactions(transactions: ITransaction[]): void {
    this.State.transactions =  _.keyBy(transactions, (c) => c.id);
  }

  @Mutation
  private SetFloatingTransactions(ids: string[]): void {
    const floatingTransactions = _.cloneDeep(this.State.floatingTransactions);

    ids.forEach((id) => {
      // don't touch already existing floating transactions.
      // copy only the newly added transactions
      if (!floatingTransactions[id]) {
        floatingTransactions[id] = _.cloneDeep(this.State.transactions[id]);
      }
    });

    this.State.floatingTransactions = floatingTransactions;
  }

  @Mutation
  private SetSelectedYear(year: number): void {
    this.State.selectedYear = year;
  }

  @Mutation
  private SetSelectedMonth(month: number): void {
    this.State.selectedMonth = month;
  }

  @Mutation
  private ToggleDelete(params: {
    show: boolean,
    type?: TransactionType,
  }): void {
    const { show, type } = params;

    this.State.showDeleteTransactions = show;
    this.State.selectedDeleteTransactionType =
      (show === true) ? type : undefined;
  }

  @Mutation
  private ToggleEdit(params: {
    show: boolean,
    type: TransactionType,
  }): void {
    const { show, type } = params;

    if (type === TransactionType.Pending) {
      this.State.showEditPendings = show;
    } else if (type === TransactionType.Transaction) {
      this.State.showEditTransactions = show;
    }
  }

  @Mutation
  private ToggleMerge(show: boolean): void {
    this.State.showMergeTransactions = show;
  }

  @Mutation
  private UnselectAll(type?: TransactionType): void {
    if (type === TransactionType.Pending) {
      this.State.selectedPendingIds = {};
    } else if (type === TransactionType.Transaction) {
      this.State.selectedTransactionIds = {};
    } else {
      this.State.selectedPendingIds = {};
      this.State.selectedTransactionIds = {};
    }
  }

  @Mutation
  private VerifyAll(ids: string[]): void {
    this.State.showEditTransactions = true;

    ids.forEach((id) => {
      Vue.set(this.State.selectedTransactionIds, id, true);
    });
  }

  @Mutation
  private VerifyTransaction(params: {
    id: string,
    verifiedDate?: string,
  }): void {
    const { id, verifiedDate } = params;
    const transaction: ITransaction = {
      ..._.cloneDeep(this.State.floatingTransactions[id]),
      verifiedDate,
    };

    this.State.transactions[id] = transaction;
    this.State.floatingTransactions[id] = _.cloneDeep(transaction);
  }

  /**
   * Verifies, saves and closes the edit dialog upon updating
   */
  @Mutation
  private VerifyTransactions(params: {
    ids: string[],
    verifiedDate: string,
  }): void {
    const { ids, verifiedDate } = params;

    ids.forEach((id) => {
      this.State.floatingTransactions[id] = {
        ..._.cloneDeep(this.State.floatingTransactions[id]),
        verifiedDate,
      };
      this.State.transactions[id] = {
        ..._.cloneDeep(this.State.floatingTransactions[id]),
        verifiedDate,
      };
    });

    this.State.selectedTransactionIds = {};
  }
}

export default getModule(AccountantStore);
