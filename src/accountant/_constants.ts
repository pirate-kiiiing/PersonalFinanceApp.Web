import colors from 'material-colors';

interface ICategory {
  Colors: {
    Dark: ICategoryColor;
    Light: ICategoryColor;
  };
}

interface ICategoryColor {
  PirateKing: string;
  Grocery: string;
  Meal: string;
  Others: string;
  Recreation: string;
  Shopping: string;
  Special: string;
  Utility: string;
  Vehicle: string;
}

interface IChart {
  Colors: {
    Dark: IChartColor;
    Light: IChartColor;
  };
  Height: number;
}

interface IChartColor {
  AuraBar: string;
  AuraColumn: string;
  Border: string;
  Text: string;
  Title: string;
}

interface IDateTime {
  StartYear: number;
}

interface ILayout {
  Colors: {
    Dark: ILayoutColor;
    Light: ILayoutColor;
  };
}

interface ILayoutColor {
  Pending: string;
  Selected: string;
  Settled: string;
  Merged: string;
  Verified: string;
}

interface ITransactions {
  TableSize: number;
}

export default class AccountantConstants {
  public static Category: ICategory = {
    Colors: {
      Dark: {
        PirateKing: colors.blueGrey[300],
        Grocery: colors.green[600],
        Meal: colors.cyan[500],
        Others: colors.deepPurple[400],
        Recreation: colors.lightBlue[700],
        Shopping: colors.red[600],
        Special: '',
        Utility: colors.orange[500],
        Vehicle: colors.yellow[500],
      },
      Light: {
        PirateKing: '#6c757d',
        Grocery: '#28a745',
        Meal: '#17a2b8',
        Others: '#7E57C2',
        Recreation: '#007bff',
        Shopping: '#dc3545',
        Special: '#343a40',
        Utility: '#F57C00',
        Vehicle: '#ffc107',
      },
    },
  };

  public static DateTime: IDateTime = {
    StartYear: 2018,
  };

  public static Chart: IChart = {
    Colors: {
      Dark: {
        AuraBar: '#303030',
        AuraColumn: colors.grey[100],
        Border: colors.grey[500],
        Text: colors.grey[400],
        Title: colors.grey[400],
      },
      Light: {
        AuraBar: colors.grey[100],
        AuraColumn: '#fff',
        Border: colors.grey[300],
        Text: colors.grey[600],
        Title: colors.grey[600],
      },
    },
    Height: 450,
  };

  public static Layout: ILayout = {
    Colors: {
      Dark: {
        Pending: colors.yellow[600],
        Selected: '#000',
        Settled: colors.yellow[600],
        Merged: colors.lightBlue[200],
        Verified: '',
      },
      Light: {
        Pending: colors.amber[500],
        Selected: '#fff',
        Settled: colors.amber[500],
        Merged: colors.lightBlue[500],
        Verified: '',
      },
    },
  };

  public static Transactions: ITransactions = {
    TableSize: 15,
  };
}
