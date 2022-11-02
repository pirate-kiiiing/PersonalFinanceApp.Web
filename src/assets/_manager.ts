import _ from 'lodash';
import AssetConstants from './_constants';
import { AssetType, IAccount, ICatalog } from './_store';
import {
  IGetCatalogResponseContractV1,
  IGetAccountResponseContractV1,
  PirateKingAssetType,
} from '@/clients/pirateKingClient';
import { pirateKingException } from '@/shared/PirateKingException';

class AssetManager {
  public convertToAccount(item: IGetAccountResponseContractV1): IAccount {
    return {
      assetType: this.getAssetType(item.assetType!),
      id: item.id,
      isTracked: item.isTracked,
      name: item.name,
      symbol: item.symbol,
      userId: item.userId,
    };
  }

  public convertToCatalog(item: IGetCatalogResponseContractV1): ICatalog {
    return {
      accountId: item.accountId,
      balance: item.value,
      date: item.date.toString(),
      lastModified: item.timestamp,
    };
  }

  public getTotalAssetId(assetType: AssetType): string {
    if (assetType === AssetType.Assets) {
      return AssetType.Assets;
    }

    return `${assetType}-${AssetConstants.Total.Name}`;
  }

  public isTotalAssetId(id: string): boolean {
    return id.includes(AssetConstants.Total.Name);
  }

  private getAssetType(gsAssetType: PirateKingAssetType): AssetType {
    switch (gsAssetType) {
      case PirateKingAssetType.Cash:
        return AssetType.Cash;

      case PirateKingAssetType.Investment:
        return AssetType.Investment;

      case PirateKingAssetType.Retirement:
        return AssetType.Retirement;
    }

    throw new pirateKingException('Unknown PirateKingAssetType');
  }
}

export default new AssetManager();
