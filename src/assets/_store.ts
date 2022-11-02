import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import { AxiosResponse } from 'axios';
import _ from 'lodash';
import { Since, Sinces } from './_data';
import manager from './_manager';
import pirateKingClient from '@/clients/pirateKingClient';
import { IGetAccountResponseContractV1, IGetCatalogResponseContractV1, IGetUserResponseContractV1 } from '@/clients/pirateKingClient';
import { Menus } from '@/layout/_data';
import layout from '@/layout/_store';
import loaderAction from '@/layout/loaderAction';
import { GuidDate } from '@/shared/_data';
import sharedManager from '@/shared/_manager';
import store from '@/shared/_store';
import { Date } from '@/shared/Date';
import { pirateKingException } from '@/shared/PirateKingException';
import tenantManager from '@/tenant/_manager';
import tenant, { IUser } from '@/tenant/_store';

export enum AssetType {
  Assets = 'Assets',
  Cash = 'Cash',
  Investment = 'Investment',
  Liquid = 'Liquid',
  Retirement = 'Retirement',
}

export interface IAccount {
  assetType: AssetType;
  id: string;
  isTracked: boolean;
  name: string;
  symbol: string;
  userId: string;
}

interface IAssetsState {
  accounts: { [ key: string ]: IAccount };
  catalogs: { [ key: string ]: ICatalog };
  editAssetAccount: { [ assetType: string ]: string | undefined; }; // assetType - accountId
  expandedAccounts: string[];
  expandedCharts: string[];
  selectedCharts: { [ key: string ]: { // AssetType
    id: string;     // selectedChartId
    since: string;  // selectedChartSince
  }};
  selectedEditAsset: AssetType | undefined;
  showEditCatalog: boolean;
  sinces: string[];
}

export interface ICatalog {
  accountId: string;
  balance: number;
  date: string;
  lastModified?: number;
}

// initial state
const initialState: IAssetsState = {
  accounts: {},
  catalogs: {},
  editAssetAccount: {
    [ AssetType.Investment ]: undefined,
    [ AssetType.Cash ]: undefined,
    [ AssetType.Retirement ]: undefined,
  },
  expandedAccounts: [],
  expandedCharts: [],
  selectedCharts: {
    [ AssetType.Assets ]: {
      id: manager.getTotalAssetId(AssetType.Assets),
      since: Since[Since.TwoWeeks],
    },
    [ AssetType.Investment ]: {
      id: manager.getTotalAssetId(AssetType.Investment),
      since: Since[Since.TwoWeeks],
    },
    [ AssetType.Cash ]: {
      id: manager.getTotalAssetId(AssetType.Cash),
      since: Since[Since.TwoWeeks],
    },
    [ AssetType.Retirement ]: {
      id: manager.getTotalAssetId(AssetType.Retirement),
      since: Since[Since.TwoWeeks],
    },
  },
  selectedEditAsset: undefined,
  showEditCatalog: false,
  sinces: [
    Since[Since.Today],
    Since[Since.Yesterday],
    Since[Since.OneWeek],
    Since[Since.TwoWeeks],
  ],
};

const path: string = Menus.Assets.path;

@Module({
  namespaced: true,
  name: 'AssetsStore',
  store,
  dynamic: true,
})
class AssetsStore extends VuexModule {
  // lowercase 'state' is reserved in Vuex
  private State: IAssetsState = _.cloneDeep(initialState);

  /* simple property getters */

  get accounts(): IAccount[] {
    return _.values(this.State.accounts);
  }

  get assetTypes(): AssetType[] {
    return [ AssetType.Investment, AssetType.Cash, AssetType.Retirement ];
    // return _.uniqBy(_.values(this.State.accounts), (a) => a.assetType)
    //         .map((a) => a.assetType);
  }

  get catalogs(): ICatalog[] {
    return _.values(this.State.catalogs);
  }

  get displayAssetTypes(): AssetType[] {
    return [
      AssetType.Investment,
      AssetType.Cash,
      AssetType.Liquid,
      AssetType.Retirement,
    ];
  }

  get liquidAssetTypes(): AssetType[] {
    return [ AssetType.Cash, AssetType.Investment ];
  }

  get minSince(): string {
    return this.State.sinces[this.State.sinces.length - 1];
  }

  get pastSinces(): string[] {
    return this.State.sinces.filter((s) => s !== Since[Since.Today]);
  }

  get selectedEditAsset(): AssetType | undefined {
    return this.State.selectedEditAsset;
  }

  get showEditCatalog(): boolean {
    return this.State.showEditCatalog;
  }

  /* getters with parameters */
  get getAccount() {
    return (id: string): IAccount => this.State.accounts[id];
  }

  // only need accounts that have associated catalogs
  get getAccounts() {
    return (assetType: AssetType): IAccount[] =>
      this.accounts.filter((a) => a.assetType === assetType && this.context.getters.hasCatalogs(a.id) === true);
  }

  get getAccountsOrderedByBalance() {
    return (assetType: AssetType): IAccount[] =>
      this.context.getters
        .getAccounts(assetType)
        .sort((a, b) => this.context.getters.getBalance(b.id, Since.Today) -
                        this.context.getters.getBalance(a.id, Since.Today));
  }

  get getBalance() {
    return (param1: string, param2: undefined | Since | string | Date): number => {
      const catalog: ICatalog = this.context.getters.getCatalog(param1, param2);
      return (catalog) ? catalog.balance : 0;
    };
  }

  get getCatalog() {
    return (param1: string, param2: undefined | Since | string | Date): ICatalog | undefined => {
      if (!param2) {
        // param1 === catalogId
        return this.State.catalogs[param1];
      } else if (typeof(param2) === 'number' || typeof(param2) === 'string') {
        // Since - number / string
        const date: Date = Sinces.getDate(param2 as Since);
        const id: string = GuidDate.GetId(param1, date);

        return this.State.catalogs[id];
      } else if (typeof(param2) === 'object') {
        // Date
        const id: string = GuidDate.GetId(param1, param2 as Date);

        return this.State.catalogs[id];
      } else {
        throw new pirateKingException('Invalid getCatalog param param2');
      }
    };
  }

  get getCatalogs() {
    return (accountId: string): ICatalog[] => this.catalogs.filter((c) => c.accountId.startsWith(accountId));
  }

  get getSelectedChartId() {
    return (assetType: AssetType): string => this.State.selectedCharts[assetType].id;
  }

  get getSelectedChartSince() {
    return (assetType: AssetType): string => this.State.selectedCharts[assetType].since;
  }

  get getEditAccount() {
    return (assetType: AssetType): IAccount | undefined =>
      (this.State.editAssetAccount[assetType])
        ? this.context.getters.getAccount(this.State.editAssetAccount[assetType])
        : undefined;
  }

  get getTotal() {
    return (assetType: AssetType, param: Since | string | Date): number => {
      if (assetType === AssetType.Assets) {
        // total assets
        return _.sumBy(this.context.getters.assetTypes, (at) =>
          this.context.getters.getTotal(at, param));
      } else if (assetType === AssetType.Liquid) {
        // liquid asset only
        return _.sumBy(this.context.getters.liquidAssetTypes, (at) =>
          this.context.getters.getTotal(at, param));
      } else {
        const accounts: IAccount[] = this.context.getters.getAccounts(assetType);
        return _.sumBy(accounts, (a) => this.context.getters.getBalance(a.id, param));
      }
    };
  }

  get hasCatalogs() {
    return (accountId: string): boolean => this.context.getters.getCatalogs(accountId).length > 0;
  }

  get isExpandedAccount() {
    return (accountId: string): boolean => this.State.expandedAccounts.includes(accountId);
  }

  get isExpandedChart() {
    return (assetType: AssetType): boolean => this.State.expandedCharts.includes(assetType);
  }

  // @Action({ rawError: true })
  @Action
  public clear(): void {
    this.context.commit('Clear');
  }

  @Action
  public async initAsync(): Promise<void> {
    const startDate: Date = Sinces.getDate(this.context.getters.minSince);
    const endDate: Date = Date.Today();
    const getAccountsPromise = pirateKingClient.getAccountsAsync(true, false);
    const getCatalogsPromise = pirateKingClient.getCatalogsAsync(startDate, endDate);
    const getUsersPromise = pirateKingClient.getUsersAsync();
    // @ts-ignore
    const [ getAccountsResponse, getCatalogsResponse, getUsersResponse ]
      = await loaderAction.sendAsync(() => Promise.all([getAccountsPromise, getCatalogsPromise, getUsersPromise]));

    // failed to get accounts
    let result = sharedManager.handleApiResponse(getAccountsResponse, path);
    if (result.success === false) {
      return;
    }

    // failed to get account catalogs
    result = sharedManager.handleApiResponse(getCatalogsResponse, path);
    if (result.success === false) {
      return;
    }

    // failed to get users
    result = sharedManager.handleApiResponse(getUsersResponse, path);
    if (result.success === false) {
      return;
    }

    const accountResponses = getAccountsResponse.data as IGetAccountResponseContractV1[];
    const catalogResponses = getCatalogsResponse.data as IGetCatalogResponseContractV1[];
    const userResponses = getUsersResponse.data as IGetUserResponseContractV1[];

    if (!accountResponses || !catalogResponses || !userResponses ||
        accountResponses.length <= 0 || catalogResponses.length <= 0 || userResponses.length <= 0) {
      return;
    }

    const accountList: IAccount[] = accountResponses.map((a) => manager.convertToAccount(a));
    const catalogList: ICatalog[] = catalogResponses.map((c) => manager.convertToCatalog(c));
    const userList: IUser[] = userResponses.map((u) => tenantManager.convertToUser(u));
    const accounts: { [ key: string ]: IAccount } = _.keyBy(accountList, (a) => a.id);
    const catalogs: { [ key: string ]: ICatalog } = _.keyBy(catalogList, (c) => GuidDate.GetId(c.accountId, c.date));
    const users: { [ key: string ]: IUser } = _.keyBy(userList, (u) => u.id);

    tenant.setUsers(users);
    this.context.commit('Init', { accounts, catalogs });
  }

  @Action
  public resetEditCatalog(): void {
    this.context.commit('ResetEditCatalog');
  }

  @Action
  public selectChart(params: { assetType: string; id: string; name: string; }): void {
    const { assetType, id, name } = params;

    if (this.State.selectedCharts[assetType].id === id) {
      return;
    }

    this.context.commit('SelectChart', params);
  }

  @Action
  public async selectChartSinceAsync(params: { assetType: string; since: string; }): Promise<void> {
    const { assetType, since } = params;

    if (this.State.selectedCharts[assetType].since === since) {
      return;
    } else if (Since[since] >= Since[this.context.getters.minSince]) {
      this.context.commit('SelectChartSince', params);
      return;
    }

    const result = await this.context.dispatch('selectSinceAsync', since);

    if (result === false) {
      return;
    }

    this.context.commit('SelectChartSince', params);
  }

  @Action
  public selectEditItem(params: { id: AssetType | string; type: string; value: string; }): void {
    const { id, type } = params;

    if (type === 'asset') {
      if (this.State.selectedEditAsset === id) {
        return;
      }
      this.context.commit('SelectEditItem', params);
    } else if (type === 'account') {
      if (!this.State.selectedEditAsset) {
        return;
      }
      const selectedAccountId: string | undefined
        = this.State.editAssetAccount[this.State.selectedEditAsset];
      if (selectedAccountId === id) {
        return;
      }
      this.context.commit('SelectEditItem', params);
    }
  }

  @Action
  public async selectSinceAsync(since: string): Promise<boolean> {
    if (this.State.sinces.includes(since) === true) {
      return false;
    }

    const startDate: Date = Sinces.getDate(since);
    const endDate: Date = Sinces.getDate(this.context.getters.minSince).addDays(-1);
    const response: AxiosResponse<IGetCatalogResponseContractV1 | any>
      = await loaderAction.sendAsync(() => pirateKingClient.getCatalogsAsync(startDate, endDate));

    const result = sharedManager.handleApiResponse(response, path);
    if (result.success === false) {
      return false;
    }

    const catalogResponses = response.data as IGetCatalogResponseContractV1[];
    const catalogList: ICatalog[] = catalogResponses.map((c) => manager.convertToCatalog(c));
    const catalogs: { [ key: string ]: ICatalog } = _.keyBy(catalogList, (c) => GuidDate.GetId(c.accountId, c.date));
    const sinceChanges: string[] = Sinces.getChanges(this.context.getters.minSince, since);

    this.context.commit('SelectSince', { catalogs, sinceChanges });

    return true;
  }

  @Action
  public toggleEditCatalog(params?: { assetType: AssetType; accountId?: string; }): void {
    this.context.commit('ToggleEditCatalog', {
      ...params,
      show: !this.State.showEditCatalog,
    });
  }

  @Action
  public toggleExpandAccount(params: { id: string; name: string; }): void {
    const { id, name } = params;
    const expand: boolean = !this.State.expandedAccounts.includes(id);

    this.context.commit('ToggleExpandAccount', {
      ...params,
      expand,
    });
  }

  @Action
  public toggleExpandChart(assetType: AssetType): void {
    this.context.commit('ToggleExpandChart', {
      assetType,
      expand: !this.State.expandedCharts.includes(assetType),
    });
  }

  @Action
  public async updateCatalogAsync(params: { balance: number; date: Date; }): Promise<void> {
    if (!this.State.selectedEditAsset ||
        !this.State.editAssetAccount[this.State.selectedEditAsset]) {
      return;
    }

    const { balance, date } = params;
    const accountId: string = this.State.editAssetAccount[this.State.selectedEditAsset]!;
    const response = await loaderAction.sendAsync(() =>
      pirateKingClient.putCatalogAsync({
        accountId,
        date: date.toString(),
        value: balance,
      }));

    const result = sharedManager.handleApiResponse(response, path);
    if (result.success === false) {
      return;
    }

    layout.setSnackBar({
      isSuccess: true,
      message: 'Save successful!',
      show: true,
    });

    this.context.commit('UpdateCatalog', {
      ...params,
      accountId,
      lastModified: response.headers['last-modified'],
    });
  }

  @Mutation
  private Clear(): void {
    this.State = _.cloneDeep(initialState);
  }

  @Mutation
  private Init(params: {
    accounts: { [ key: string ]: IAccount },
    catalogs: { [ key: string ]: ICatalog } }): void {
    const { accounts, catalogs } = params;

    this.State = {
      ...this.State,
      accounts: _.cloneDeep(accounts),
      catalogs: _.cloneDeep(catalogs),
    };
  }

  @Mutation
  private ResetEditCatalog(): void {
    _.keys(this.State.editAssetAccount)
      .forEach((key) => this.State.editAssetAccount[key] = undefined);
    this.State.selectedEditAsset = undefined;
  }

  @Mutation
  private SelectChart(params: { assetType: string; id: string; name: string; }): void {
    const { assetType, id, name } = params;

    this.State.selectedCharts[assetType] = {
      ...this.State.selectedCharts[assetType],
      id,
    };
  }

  @Mutation
  private SelectChartSince(params: { assetType: string; since: string; }): void {
    const { assetType, since } = params;

    this.State.selectedCharts[assetType] = {
      ...this.State.selectedCharts[assetType],
      since,
    };
  }

  @Mutation
  private SelectEditItem(params: { id: AssetType | string; type: string; value: string; }): void {
    const { id, type } = params;

    if (type === 'asset') {
      this.State.selectedEditAsset = id as AssetType;
    } else if (type === 'account') {
      this.State.editAssetAccount[this.State.selectedEditAsset!] = id;
    }
  }

  @Mutation
  private SelectSince(params: {
    catalogs: { [ key: string ]: ICatalog },
    sinceChanges: string[] }): void {
    const { catalogs, sinceChanges } = params;

    // update Sinces to have sinces up to the selectedSince
    sinceChanges.forEach((since) => this.State.sinces.push(since));

    this.State = {
      ...this.State,
      catalogs: Object.assign({}, this.State.catalogs, catalogs),
    };
  }

  @Mutation
  private ToggleEditCatalog(params: {
    assetType?: AssetType;
    accountId?: string;
    show: boolean;
  }): void {
    const { assetType, accountId, show } = params;

    this.State.showEditCatalog = show;

    if (assetType) {
      this.State.selectedEditAsset = assetType;
      if (accountId) {
        this.State.editAssetAccount[assetType] = accountId;
      }
    }
  }

  @Mutation
  private ToggleExpandAccount(params: {
    id: string;
    name: string;
    expand: boolean;
  }): void {
    const { id, name, expand } = params;

    if (expand === true) {
      this.State.expandedAccounts.push(id);
    } else {
      this.State.expandedAccounts.splice(this.State.expandedAccounts.indexOf(id), 1);
    }
  }

  @Mutation
  private ToggleExpandChart(params: {
    assetType: AssetType;
    expand: boolean;
  }): void {
    const { assetType, expand } = params;

    if (expand === true) {
      this.State.expandedCharts.push(assetType);
    } else {
      this.State.expandedCharts.splice(
        this.State.expandedCharts.indexOf(assetType), 1);
    }
  }

  @Mutation
  private UpdateCatalog(params: {
    accountId: string;
    balance: number;
    date: Date;
    lastModified: number;
  }): void {
    const { accountId, balance, date, lastModified } = params;
    const catalogId: string = GuidDate.GetId(accountId, date);
    const catalog: ICatalog = {
      ..._.cloneDeep(this.State.catalogs[catalogId]),
      balance,
      lastModified,
    };

    this.State.catalogs[catalogId] = catalog;
  }
}

export default getModule(AssetsStore);
