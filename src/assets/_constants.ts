import colors from 'material-colors';

const shadeLightDefault: number = 500;
const shadeLightFont: string = 'a700';
const shadeDarkDefault: number = 700;
const shadeDarkFont: string = '400';

export default class AssetConstants {
  public static Assets: IAssetView = {
    Color: {
      Light: {
        Default: colors.cyan[shadeLightDefault],
        Font: colors.cyan[shadeLightFont],
      },
      Dark: {
        Default: colors.cyan[shadeDarkDefault],
        Font: colors.cyan[shadeDarkFont],
      },
    },
    Icon: 'account_balance',
    Id: 'assets',
    Name: 'Assets',
    Symbol: 'TOTAL',
    Title: 'Assets',
  };

  public static Cash: IAssetView = {
    Color: {
      Light: {
        Default: colors.blue[shadeLightDefault],
        Font: colors.blue[shadeLightFont],
      },
      Dark: {
        Default: colors.blue[shadeDarkDefault],
        Font: colors.blue[shadeDarkFont],
      },
    },
    Icon: 'monetization_on',
    Id: 'cash',
    Name: 'Cash',
    Symbol: 'CASH',
    Title: 'Cash',
  };

  public static Investment: IAssetView = {
    Color: {
      Light: {
        Default: colors.red[shadeLightDefault],
        Font: colors.red[shadeLightFont],
      },
      Dark: {
        Default: colors.red[shadeDarkDefault],
        Font: colors.red[shadeDarkFont],
      },
    },
    Icon: 'insert_chart_outlined',
    Id: 'investment',
    Name: 'Investment',
    Symbol: 'INVEST',
    Title: 'Investment',
  };

  public static Layout: IAssetLayout = {
    Color: {
      Light: {
        Border: '#0000001A',
        Background: '#e9ecef',
        ButtonText: 'white',
        ChartBackground: 'white',
        Error: colors.red[600],
        ListBackground: '#fff',
        Success: colors.grey[600],
        Warning: colors.yellow[700],
        Text: 'black',
      },
      Dark: {
        Border: '#ffffff1A',
        Background: '#373740',
        ButtonText: '#424242',
        ChartBackground: '#424242',
        Error: colors.red[400],
        ListBackground: '#2a2a2a',
        Success: colors.blueGrey[300],
        Warning: colors.yellow[300],
        Text: 'white',
      },
    },
  };

  public static Liquid: IAssetView = {
    Color: {
      Light: {
        Default: colors.grey[shadeLightDefault],
        Font: colors.grey[shadeLightFont],
      },
      Dark: {
        Default: colors.grey[500],
        Font: colors.grey[shadeDarkFont],
      },
    },
    Icon: 'insert_chart_outlined',
    Id: 'liquid',
    Name: 'Liquid',
    Symbol: 'LIQUID',
    Title: 'Liquid',
  };

  public static Retirement: IAssetView = {
    Color: {
      Light: {
        Default: colors.green[shadeLightDefault],
        Font: colors.green[shadeLightFont],
      },
      Dark: {
        Default: colors.green[shadeDarkDefault],
        Font: colors.green[shadeDarkFont],
      },
    },
    Icon: 'cloud',
    Id: 'Retirement',
    Name: 'Retirement',
    Symbol: 'RETIRE',
    Title: 'Retirement',
  };

  public static StartDateOffset: number = -14;

  public static Total = {
    Id: 'total',
    Name: 'Total',
    Symbol: 'TOTAL',
  };

  public static UpdateToleranceMinutes: number = 305;
}

interface IAssetLayout {
  Color: {
    Light: IAssetLayoutColor;
    Dark: IAssetLayoutColor;
  };
}

interface IAssetLayoutColor {
  Border: string;
  Background: string;
  ButtonText: string;
  ChartBackground: string;
  Error: string;
  ListBackground: string;
  Success: string;
  Text: string;
  Warning: string;
}

interface IAssetView {
  Color: {
    Light: {
      Default: string,
      Font: string,
    },
    Dark: {
      Default: string,
      Font: string,
    },
  };
  Icon: string;
  Id: string;
  Name: string;
  Symbol?: string;
  Title: string;
}
