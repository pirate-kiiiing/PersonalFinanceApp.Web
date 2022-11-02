import moment from 'moment';
import { pirateKingException } from './PirateKingException';

export const DATE_FORMAT = 'YYYY-MM-DD';

export class Date implements IDate {
  public static Today(): Date {
    return new Date(moment().format(DATE_FORMAT));
  }

  public static GetDate(year: number, month: number, day: number): Date {
    return new Date(moment([year, month - 1, day]).format(DATE_FORMAT));
  }

  public static Max(a: Date, b: Date): Date {
    return (a.toString() > b.toString()) ? a : b;
  }

  public static Min(a: Date, b: Date): Date {
    return (a.toString() < b.toString()) ? a : b;
  }

  public static toDate(jsDate): Date {
    return new Date(moment(jsDate).format(DATE_FORMAT));
  }

  private date!: string;

  constructor(date: string) {
    const isValidFormat: boolean = moment(date, DATE_FORMAT, /*strict:*/ true).isValid();

    if (isValidFormat === false) {
      throw new pirateKingException(`invalid date format '${date}'. Must be in '${DATE_FORMAT}' format`);
    }

    this.date = date;
  }

  public addDays(days: number): Date {
    const newDate: string = moment(this.date).add(days, 'days').format(DATE_FORMAT);

    return new Date(newDate);
  }

  public addWeeks(weeks: number): Date {
    const newDate: string = moment(this.date).add(weeks, 'weeks').format(DATE_FORMAT);

    return new Date(newDate);
  }

  public addMonths(months: number): Date {
    const newDate: string = moment(this.date).add(months, 'months').format(DATE_FORMAT);

    return new Date(newDate);
  }

  public addYears(years: number): Date {
    const newDate: string = moment(this.date).add(years, 'years').format(DATE_FORMAT);

    return new Date(newDate);
  }

  public equals(date: Date): boolean {
    return this.date.toString() === date.toString();
  }

  public getMonth(): number {
    return Number(this.date.split('-')[1]);
  }

  public getYear(): number {
    return Number(this.date.split('-')[0]);
  }

  public toJsDate() {
    return moment(this.date).toDate();
  }

  public toString(): string {
    return this.date;
  }
}

export interface IDate {
  addDays(days: number): Date;
  addWeeks(weeks: number): Date;
  addMonths(months: number): Date;
  addYears(years: number): Date;
  equals(date: Date): boolean;
  toJsDate();
  toString(): string;
}
