import { AxiosResponse } from 'axios';
import HttpStatus from 'http-status-codes';
import _ from 'lodash';
import moment from 'moment';
import { Theme } from '@/layout/_data';
import layout from '@/layout/_store';
import { pirateKingException } from '@/shared/PirateKingException';
import SharedConstants from '@/shared/_constants';
import { DATE_FORMAT } from '@/shared/Date';
import tenant from '@/tenant/_store';

class SharedManager {
  public getAmountColor(amount: number, theme: Theme): string {
    const color: string =
      (amount === 0) ? 'Neutral' :
      (amount > 0) ? 'Plus' : 'Minus';

    return SharedConstants.Number.Colors[theme][color];
  }

  public getFormattedAmount(amount: number): string {
    const sign: string = (amount >= 0) ? '+' : '-';
    const formattedAmount: string = this.toCurrencyString(Math.abs(amount));

    return `${sign}$${formattedAmount}`;
  }

  public getFormattedPercent(amount: number): string {
    return amount.toLocaleString('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
    });
  }

  public getMonthAbbr(month: number): string {
    return moment().month(month - 1).format('MMM');
  }

  public getMonthStr(month: number): string {
    return moment().month(month - 1).format('MMMM');
  }

  public getStartDay(year: number, month: number): string {
    return moment([year, month - 1]).format(DATE_FORMAT);
  }

  public getLastDay(year: number, month: number): string {
    return moment().year(year).month(month - 1).endOf('month').format(DATE_FORMAT);
  }

  public getUtcNowDateTime(): Date {
    return moment.utc().toDate();
  }

  public getUtcNowDateTimeStr(): string {
    return moment.utc().toDate().toJSON();
  }

  public handleApiResponse(response: AxiosResponse<any>, path?: string): {
    success: boolean;
    statusCode: number;
  } {
    let success: boolean = true;

    if (response.status === HttpStatus.UNAUTHORIZED) {
      // tslint:disable-next-line
      console.log(response);

      tenant.signOut(path);

      success = false;
    } else if (this.isSuccessfulStatusCode(response.status) === false) {
      // failed to get catalogs
      // tslint:disable-next-line
      console.log(response);

      layout.setSnackBar({
        isSuccess: false,
        message: `${response.status}: ${JSON.stringify(response.data)}`,
        show: true,
      });

      success = false;
    }

    return {
      success,
      statusCode: response.status,
    };
  }

  public handleDeleteApiResponse(response: AxiosResponse<any>, path?: string): {
    success: boolean;
    statusCode: number;
  } {
    let success: boolean = true;

    if (response.status === HttpStatus.UNAUTHORIZED) {
      // tslint:disable-next-line
      console.log(response);

      tenant.signOut(path);

      success = false;
    } else if (this.isSuccessfulStatusCode(response.status) === false
              && response.status !== HttpStatus.NOT_FOUND) {
      // failed to get catalogs
      // tslint:disable-next-line
      console.log(response);

      layout.setSnackBar({
        isSuccess: false,
        message: `${response.status}: ${JSON.stringify(response.data)}`,
        show: true,
      });

      success = false;
    }

    return {
      success,
      statusCode: response.status,
    };
  }

  public handleInitApiResponse(response: AxiosResponse<any>): {
    success: boolean;
    statusCode: number;
  } {
    if (this.isSuccessfulStatusCode(response.status) === false) {
      // tslint:disable-next-line
      console.log(response);

      layout.setSnackBar({
        isSuccess: false,
        message: `${response.status}: ${JSON.stringify(response.data)}`,
        show: true,
      });
    }

    return {
      success: this.isSuccessfulStatusCode(response.status),
      statusCode: response.status,
    };
  }

  public isSuccessfulStatusCode(statusCode: number): boolean {
    return (200 <= statusCode && statusCode < 300) || statusCode === HttpStatus.NOT_MODIFIED;
  }

  public shadeBlendChart(c0: string, c1?: string) {
    return this.shadeBlend(0.5, c0, c1);
  }

  public toCurrencyString(num: number): string {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  private shadeBlend(p: number, c0: string, c1?: string) {
    // tslint:disable-next-line
    const n = p < 0 ? p * -1 : p, u = Math.round, w = parseInt;
    if (c0.length > 7) {
      // tslint:disable-next-line
      const f = c0.split(','), t = (c1 ? c1 : p < 0 ? 'rgb(0,0,0)' : 'rgb(255,255,255)').split(','), R = w(f[0].slice(4)), G = w(f[1]), B = w(f[2]);
      // tslint:disable-next-line
      return 'rgb(' + (u((w(t[0].slice(4)) - R) * n) + R) + ',' + (u((w(t[1]) - G) * n) + G) + ',' + (u((w(t[2]) - B) * n) + B) + ')';
    } else {
      // tslint:disable-next-line
      const f = w(c0.slice(1), 16), t = w((c1 ? c1 : p < 0 ? '#000000' : '#FFFFFF').slice(1), 16), R1 = f >> 16, G1 = f >> 8 & 0x00FF, B1 = f & 0x0000FF; // eslint-disable-line no-mixed-operators
      // tslint:disable-next-line
      return '#' + (0x1000000 + (u(((t >> 16) - R1) * n) + R1) * 0x10000 + (u(((t >> 8 & 0x00FF) - G1) * n) + G1) * 0x100 + (u(((t & 0x0000FF) - B1) * n) + B1)).toString(16).slice(1); // eslint-disable-line no-mixed-operators
    }
  }
}

export default new SharedManager();
