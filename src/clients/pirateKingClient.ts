import axios, { AxiosResponse } from 'axios';
import { ExpenseCategory } from '@/accountant/_data';
import { Date } from '@/shared/Date';
import tenant from '@/tenant/_store';
import { UserRole } from '@/tenant/_data';

const authorizationHeader = 'Authorization';
const baseUrl: string = `http://localhost:8080`;
const bearerToken = (jwt: string) => `Bearer ${jwt}`;
const version: string = `v1.0`;

const accountsPath = (tenantId: string): string => `${basePath(tenantId)}/accounts`;
const basePath = (tenantId: string): string => `/${version}/tenants/${tenantId}`;
const catalogsPath = (tenantId: string, accountId: string): string =>
  `${basePath(tenantId)}/accounts/${accountId}/catalogs`;
const transactionsPath = (tenantId: string): string => `${basePath(tenantId)}/transactions`;
const usersPath = (tenantId: string): string => `${basePath(tenantId)}/users`;

const api = axios.create({
  baseURL: baseUrl,
});

class PirateKingClient {
  public async getAccountsAsync(
    isAsset?: boolean,
    isExpense?: boolean,
    ): Promise<AxiosResponse<IGetAccountResponseContractV1[] | any>> {
    this.setJwtToken();

    let path = accountsPath(tenant.id);

    if (isAsset && isAsset === true) {
      path = `${path}?isAsset=true`;

      if (isExpense && isExpense === true) {
        path = `${path}&isExpense=true`;
      }
    } else if (isExpense && isExpense === true) {
      path = `${path}?isExpense=true`;
    }

    try {
      return await api.get(path);
    } catch (e) {
      return e.response;
    }
  }

  public async getCatalogsAsync(
    startDate: Date,
    endDate: Date): Promise<AxiosResponse<IGetCatalogResponseContractV1[] | any>> {
    this.setJwtToken();

    try {
      return await api.get(
        `${basePath(tenant.id)}/account-catalogs?startDate=${startDate.toString()}&endDate=${endDate.toString()}`);
    } catch (e) {
      return e.response;
    }
  }

  public async getUsersAsync(): Promise<AxiosResponse<IGetUserResponseContractV1[] | any>> {
    this.setJwtToken();

    try {
      return await api.get(usersPath(tenant.id));
    } catch (e) {
      return e.response;
    }
  }

  public async getTransactionsAsync(
    startDate: Date,
    endDate: Date,
  ): Promise<AxiosResponse<IGetTransactionResponseContractV1[] | any>> {
    this.setJwtToken();

    try {
      return await api.get(`${transactionsPath(tenant.id)}?startDate=${startDate.toString()}&endDate=${endDate.toString()}`);
    } catch (e) {
      return e.response;
    }
  }

  public async mergeTransactionsAsync(
    transactionId: string,
    pendingId: string,
    verifiedDate?: string,
  ): Promise<AxiosResponse<IMergeTransactionResponseContractV1 | any>> {
    this.setJwtToken();

    const data: IMergeTransactionsRequestContractV1 = {
      pendingTransactionId: pendingId,
      verifiedDate,
    };

    try {
      return await api.put(`${transactionsPath(tenant.id)}/${transactionId}/merge`, data);
    } catch (e) {
      return e.response;
    }
  }

  public async putCatalogAsync(request: IPutAccountCatalogRequestContractV1)
  : Promise<AxiosResponse<IPutAccountCatalogResponseContractV1 | any>> {
    const { accountId, date } = request;
    this.setJwtToken();

    try {
      return await api.put(`${catalogsPath(tenant.id, accountId)}/${date.toString()}`, request);
    } catch (e) {
      return e.response;
    }
  }

  public async putTransactionAsync(request: IPutTransactionRequestContractV1)
  : Promise<AxiosResponse<void | any>> {
    const { id } = request;
    this.setJwtToken();

    try {
      return await api.put(`${transactionsPath(tenant.id)}/${id}`, request);
    } catch (e) {
      return e.response;
    }
  }

  public async putTransactionsAsync(request: IPutTransactionRequestContractV1[])
  : Promise<AxiosResponse<void | any>> {
    this.setJwtToken();

    try {
      return await api.put(`${transactionsPath(tenant.id)}`, request);
    } catch (e) {
      return e.response;
    }
  }

  public async deleteTransactionsAsync(transactionIds: string[]): Promise<AxiosResponse<void | any>> {
    this.setJwtToken();
    const ids: string = transactionIds.join(',');

    try {
      return await api.delete(`${transactionsPath(tenant.id)}?ids=${ids}`);
    } catch (e) {
      return e.response;
    }
  }

  public async signIn(googleToken?: string): Promise<AxiosResponse<ISignInResponseContractV1 | any>> {
    const headers = {};
    if (googleToken) {
      // sign in using google token
      headers[authorizationHeader] = bearerToken(googleToken);
    }

    try {
      return await axios(`${baseUrl}/${version}/signin`, {
        method: 'post',
        headers,
        withCredentials: true,
      });
    } catch (e) {
      return e.response;
    }
  }

  public async signOut(): Promise<AxiosResponse<ISignInResponseContractV1 | any>> {
    try {
      return await axios(`${baseUrl}/${version}/signout`, {
        method: 'post',
        withCredentials: true,
      });
    } catch (e) {
      return e.response;
    }
  }

  private setJwtToken(): void {
    api.defaults.headers.common[authorizationHeader]
      = bearerToken(tenant.accessToken);
  }
}

export default new PirateKingClient();

export interface IGetAccountResponseContractV1 {
  assetType?: PirateKingAssetType;
  expenseType?: PirateKingExpenseType;
  id: string;
  isTracked: boolean;
  name: string;
  state: PirateKingAccountState;
  symbol: string;
  tenantId: string;
  userId: string;
}

export interface IGetCatalogResponseContractV1 {
  accountId: string;
  date: Date;
  tenant: string;
  timestamp: number;
  value: number;
}

export interface IGetTransactionResponseContractV1 {
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

export interface IGetUserResponseContractV1 {
  id: string;
  tenantId: string;
  profileImageUrl: string;
  role: UserRole;
}

export interface IMergeTransactionsRequestContractV1 {
  pendingTransactionId: string;
  verifiedDate?: string;
}

export interface IMergeTransactionResponseContractV1 {
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

export interface IPutAccountCatalogRequestContractV1 {
  accountId: string;
  date: string;
  value: number;
}

// @ts-ignore
// tslint:disable-next-line
export interface IPutAccountCatalogResponseContractV1
  extends IPutAccountCatalogRequestContractV1 {}

export interface ISignInResponseContractV1 {
  accessToken: string;
  tenantId: string;
  userId: string;
  userProfileImageUrl: string;
  userRole: UserRole;
}

export interface IPutTransactionRequestContractV1 {
  accountId: string;
  amount: number;
  date: string;
  expenseCategory: ExpenseCategory;
  id: string;
  name: string;
  note: string;
  tenantId: string;
  verifiedDate?: string;
}

export enum PirateKingAccountState {
  None = 'None',
  Active = 'Active',
  Inactive = 'Inactive',
}

export enum PirateKingAssetType {
  Cash = 'Cash',
  Investment = 'Investment',
  Retirement = 'Retirement',
}

export enum PirateKingExpenseType {
  Cash = 'Cash',
  Checking = 'Checking',
  Credit = 'Credit',
  Saving = 'Saving',
}
