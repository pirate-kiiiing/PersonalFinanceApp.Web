export interface IMenu {
  icon: string;
  name: string;
  path: string;
  title: string;
}

export class Menus {
  // empty state for initialization
  public static Empty: IMenu = {
    icon: 'empty',
    name: 'empty',
    path: '/dashboard',
    title: 'PirateKing',
  };

  public static Dashboard: IMenu = {
    icon: 'dashboard',
    name: 'dashboard',
    path: '/dashboard',
    title: 'PirateKing',
  };

  public static Assets: IMenu = {
    icon: 'account_balance',
    name: 'assets',
    path: '/assets',
    title: 'Assets',
  };

  public static Accountant: IMenu = {
    icon: 'credit_card',
    name: 'accountant',
    path: '/accountant',
    title: 'Accountant',
  };

  public static IsValidPath(name: string | null | undefined): boolean {
    if (name === undefined || name === null) {
      return false;
    }

    return Menus.paths.has(name);
  }

  public static GetMenu = (menuName: string): IMenu => {
    switch (menuName) {
      case Menus.Dashboard.name:
        return Menus.Dashboard;

      case Menus.Assets.name:
        return Menus.Assets;

      case Menus.Accountant.name:
        return Menus.Accountant;

      default:
        throw new Error(`invalid menu name ${menuName}`);
    }
  }

  public static GetMenuNameByPath = (path: string): string => {
    switch (path.toLowerCase()) {
      case '':
      case '/':
      case Menus.Dashboard.path:
        return Menus.Dashboard.name;

      case Menus.Assets.path:
        return Menus.Assets.name;

      case Menus.Accountant.path:
        return Menus.Accountant.name;

      default:
        throw new Error(`invalid menu path ${path}`);
    }
  }

  private static paths: Set<string>
    = new Set([
      '',
      '/',
      Menus.Dashboard.path,
      Menus.Assets.path,
      Menus.Accountant.path,
    ]);
}

export enum Page {
  Default = 'Default',
  Home = 'Home',
  NotFound = 'NotFound',
  Redirect = 'Redirect',
  Privacy = 'Privacy',
}

export enum Theme {
  Light = 'Light',
  Dark = 'Dark',
}
