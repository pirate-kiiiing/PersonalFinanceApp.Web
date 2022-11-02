import colors from 'material-colors';

interface ILayout {
  Colors: {
    Light: ILayoutColor;
    Dark: ILayoutColor;
  };
}

interface ILayoutColor {
  Accent: string;
  Background: string;
  Disabled: string;
  Font: string;
  Gold: string;
  Primary: string;
  SnackBar: string;
  SnackBarText: string;
  Stone: string;
  Text: string;
}

interface IHeader {
  Colors: {
    Light: IHeaderColor;
    Dark: IHeaderColor;
  };
}

interface IHeaderColor {
  Background: string;
  Icon: string;
  Theme: string;
}

interface ISnackBar {
  SuccessDuration: number;
}

export default class LayoutConstants {
  public static Layout: ILayout = {
    Colors: {
      Light: {
        Accent: colors.red.a200,
        Background: '#fafafa',
        Disabled: colors.grey[500],
        Font: '#000',
        Gold: '#907200',
        Primary: colors.cyan[200],
        SnackBar: colors.blueGrey[500],
        SnackBarText: 'white',
        Stone: '#8a898d',
        Text: 'black',
      },
      Dark: {
        Accent: colors.red.a200,
        Background: '#2a2a2a',
        Disabled: colors.grey[400],
        Font: '#fff',
        Gold: '#907200',
        Primary: colors.lightBlue[200],
        SnackBar: colors.blueGrey[600],
        SnackBarText: 'white',
        Stone: '#8a898d',
        Text: 'white',
      },
    },
  };

  public static Header: IHeader = {
    Colors: {
      Light: {
        Background: '#fff',
        Icon: '#000',
        Theme: '#0078d4',
      },
      Dark: {
        Background: colors.grey[900],
        Icon: '#fff',
        Theme: '#98c6ff',
      },
    },
  };

  public static SnackBar: ISnackBar = {
    SuccessDuration: 4000,
  };
}
