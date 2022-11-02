import colors from 'material-colors';

interface ILayout {
  Colors: {
    Light: ILayoutColor;
    Dark: ILayoutColor;
  };
}

interface ILayoutColor {
  Failure: string;
  Success: string;
  Text: string;
}

interface INumber {
  Colors: {
    Light: INumberColor;
    Dark: INumberColor;
  };
}

interface INumberColor {
  Minus: string;
  Neutral: string;
  Plus: string;
}

interface ITooltip {
  Delay: number;
}

export default class SharedConstants {
  public static Layout: ILayout = {
    Colors: {
      Light: {
        Failure: colors.red.a200,
        Success: colors.green.a200,
        Text: 'black',
      },
      Dark: {
        Failure: colors.red.a200,
        Success: colors.green.a200,
        Text: 'white',
      },
    },
  };

  public static Number: INumber = {
    Colors: {
      Light: {
        Minus: colors.red[600],
        Neutral: colors.grey[500],
        Plus: colors.green[600],
      },
      Dark: {
        Minus: colors.red.a200,
        Neutral: colors.blueGrey[300],
        Plus: colors.green.a400,
      },
    },
  };

  public static Tooltip: ITooltip = {
    Delay: 400,
  };
}
