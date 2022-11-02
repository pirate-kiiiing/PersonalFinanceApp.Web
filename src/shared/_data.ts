import { Date } from './Date';
import { pirateKingException } from './PirateKingException';

export enum BaseStatus {
  Success = 'Success',
  Warning = 'Warning',
  Error = 'Error',
}

export class GuidDate {
  public static GetDate(guidDate: string): Date {
    return this.Validate(guidDate).date;
  }

  public static GetGuid(guidDate: string): string {
    return this.Validate(guidDate).guid;
  }

  public static GetId(id: string, date: Date | string): string {
    if (typeof(date) === 'object') {
      return `${id}${this.separator}${date.toString()}`;
    } else {
      return `${id}${this.separator}${date}`;
    }
  }

  private static separator: string = '|';

  private static Validate(guidDate: string): { guid: string, date: Date } {
    const split: string[] = guidDate.split(this.separator);

    if (!split || split.length !== 2) {
      throw new pirateKingException(`Invalid GuidDate ${guidDate}`);
    }

    return {
      guid: split[0],
      date: new Date(split[1]),
    };
  }
}
