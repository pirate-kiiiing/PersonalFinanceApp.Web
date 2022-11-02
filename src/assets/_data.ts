import { AxiosResponse } from 'axios';
import moment from 'moment';
import { Date } from '@/shared/Date';
import { pirateKingException } from '@/shared/PirateKingException';
import { BaseStatus } from '@/shared/_data';
import { AssetType } from './_store';

// tslint:disable-next-line

export enum Since {
  Custom,
  OneYear,
  SixMonths,
  ThreeMonths,
  OneMonth,
  TwoWeeks,
  OneWeek,
  Yesterday,
  Today,
}
// tslint:disable-next-line
class Sinces {
  // get enum string keys
  public static keys(): string[] {
    return Object.keys(Since).filter((key) => !isNaN(Number(Since[key])));
  }

  // gets the list of changes (from, to]
  public static getChanges(from: string, to: string): string[] {
    const sinces: string[] = [];

    for (let since: Since = Since[from] - 1; since >= Since[to]; since--) {
      sinces.push(Since[since]);
    }

    return sinces;
  }

  public static getDate(since: Since | string): Date {
    const today: Date = Date.Today();

    switch (since) {
      case Since.Today:
      case Since[Since.Today]:
        return today;
      case Since.Yesterday:
      case Since[Since.Yesterday]:
        return today.addDays(-1);
      case Since.OneWeek:
      case Since[Since.OneWeek]:
        return today.addWeeks(-1);
      case Since.TwoWeeks:
      case Since[Since.TwoWeeks]:
        return today.addWeeks(-2);
      case Since.OneMonth:
      case Since[Since.OneMonth]:
        return today.addMonths(-1);
      case Since.ThreeMonths:
      case Since[Since.ThreeMonths]:
        return today.addMonths(-3);
      case Since.SixMonths:
      case Since[Since.SixMonths]:
        return today.addMonths(-6);
      case Since.OneYear:
      case Since[Since.OneYear]:
        return today.addYears(-1);
    }

    throw new pirateKingException(`invalid since type ${since}`);
  }

  public static size(): number {
    // need to use !isNan to filter out string keys
    return Object.keys(Since).filter((key) => !isNaN(Number(Since[key]))).length;
  }

  public static toString(since: Since | string) {
    switch (since) {
      case Since.Custom:
      case Since[Since.Custom]:
        return 'Custom';
      case Since.OneYear:
      case Since[Since.OneYear]:
        return '1 Year';
      case Since.SixMonths:
      case Since[Since.SixMonths]:
        return '6 Months';
      case Since.ThreeMonths:
      case Since[Since.ThreeMonths]:
        return '3 Months';
      case Since.OneMonth:
      case Since[Since.OneMonth]:
        return '1 Month';
      case Since.TwoWeeks:
      case Since[Since.TwoWeeks]:
        return '2 Weeks';
      case Since.OneWeek:
      case Since[Since.OneWeek]:
        return '1 Week';
      case Since.Yesterday:
      case Since[Since.Yesterday]:
        return 'Yesterday';
      case Since.Today:
      case Since[Since.Today]:
        return 'Today';
    }

    throw new pirateKingException(`invalid since ${since}`);
  }

  // get numeric values
  public static values(): Since[] {
    return (this.keys().map((key) => Since[key as any]) as unknown) as Since[];
  }
}

export { Sinces };

export interface ISinceCatalog {
  assetType: AssetType;
  date: string;
  isTotal: boolean;
  pastBalance: number;
  since: string;
  todayBalance: number;
}

export interface ISinceCatalogToday extends ISinceCatalog {
  id: string;
  image?: string;
  name: string;
  showEdit: boolean;
  showUpdateStatus: boolean;
  symbol: string;
  // toggleExpandAccount
  updatedStatus?: BaseStatus;
  updatedStatusMessage?: string;
}
