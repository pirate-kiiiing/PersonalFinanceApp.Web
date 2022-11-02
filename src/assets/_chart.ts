import AssetConstants from './_constants';
import { Since, Sinces } from './_data';
import manager from './_manager';
import assets, { AssetType } from './_store';
import layout from '@/layout/_store';
import { Date as GSDate } from '@/shared/Date';

class Chart {
  private static options = {
    annotations: {
      textStyle: {
        fontSize: 18,
        bold: true,
      },
    },
    backgroundColor: '',
    chartArea: {
      width: '85%',
      height: '85%',
    },
    hAxis: {
      gridlines: {
        count: 7,
      },
    },
    height: 500,
    legend: 'none',
    series: {
      0: { color: '' },
    },
    title: '',
    titleTextStyle: {
      color: '',
    },
    tooltip: {
      trigger: 'focus',
    },
    vAxis: {
      format: '$#,###',
      textStyle: {
        color: '',
      },
    },
  };

  public drawChart(assetType: AssetType, gchart, google): void {
    const selectedId: string = assets.getSelectedChartId(assetType);
    const selectedSince: string = assets.getSelectedChartSince(assetType);
    const data = new google.visualization.DataTable();
    const minDate: string = (new GSDate(Sinces.getDate(selectedSince).toString())).toString();
    const maxDate: string = (new GSDate(Sinces.getDate(Since.Today).toString())).toString();
    const id: string = assets.getSelectedChartId(assetType);
    let chartName: string;

    data.addColumn('date', 'Date');
    data.addColumn('number', 'Balance');
    data.addColumn({ type: 'number', role: 'annotation' });

    if (assetType === AssetType.Assets) {
      chartName = selectedId; // assetType;
      this.addAssetTotalData(data, selectedId as AssetType, minDate, maxDate);
    } else if (manager.isTotalAssetId(selectedId) === true) {
      chartName = id.replace('-', ' ');
      this.addAssetTotalData(data, assetType, minDate, maxDate);
    } else {
      chartName = assets.getAccount(id).name;
      this.addAccountData(data, selectedId, minDate, maxDate);
    }

    const numDataPoints = 7;

    this.setAnnotations(data, numDataPoints);

    const formatter = new google.visualization.NumberFormat({
        prefix: '$',
    });
    formatter.format(data, 1);
    formatter.format(data, 2);

    this.setOptions(assetType, selectedId, chartName);

    gchart.draw(data, Chart.options);
  }

  private addAccountData(
    data,
    selectedId: string,
    minDate: string,
    maxDate: string): void {
    for (
      let curDate: GSDate = new GSDate(minDate);
      curDate.toString() <= maxDate;
      curDate = curDate.addDays(1)
    ) {
      const balance: number = assets.getBalance(selectedId, curDate);
      const date = curDate.toJsDate();
      const row = [date, balance, null];
      data.addRows([row]);
    }
  }

  private addAssetTotalData(
    data,
    assetType: AssetType,
    minDate: string,
    maxDate: string): void {
    for (
      let curDate: GSDate = new GSDate(minDate);
      curDate.toString() <= maxDate;
      curDate = curDate.addDays(1)
    ) {
      const balance: number = assets.getTotal(assetType, curDate);
      const date = curDate.toJsDate();
      const row = [date, balance, null];
      data.addRows([row]);
    }
  }

  private setAnnotations(data, numDataPoints): void {
    const numRows = data.getNumberOfRows();
    const valIndex = 1;
    const annotIndex = 2;

    for (let i = 0; i < numDataPoints - 1; i++) {
      const rowIndex = Math.floor(numRows * (i / (numDataPoints - 1)));
      const val = data.getValue(rowIndex, valIndex);

      data.setValue(rowIndex, annotIndex, val);
    }
    // last row
    const lastIndex = numRows - 1;
    const lastVal = data.getValue(lastIndex, valIndex);
    data.setValue(lastIndex, annotIndex, lastVal);
  }

  private setOptions(assetType: AssetType, selectedId: string, name: string) {
    const since: string = assets.getSelectedChartSince(assetType);

    Chart.options.backgroundColor = AssetConstants.Layout.Color[layout.theme].ChartBackground;
    Chart.options.series[0].color = (assetType === AssetType.Assets)
      ? AssetConstants[selectedId].Color[layout.theme].Default
      : AssetConstants[assetType].Color[layout.theme].Default;
    Chart.options.title = `${name} - ${since}`;
    Chart.options.titleTextStyle.color = AssetConstants.Layout.Color[layout.theme].Text;
    Chart.options.vAxis.textStyle.color = AssetConstants.Layout.Color[layout.theme].Text;
  }
}

export default new Chart();
