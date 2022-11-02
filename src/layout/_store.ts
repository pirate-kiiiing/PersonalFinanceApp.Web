import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import _ from 'lodash';
import LayoutConstants from './_constants';
import { IMenu, Menus, Page, Theme } from './_data';
import store from '@/shared/_store';
import router from '@/router';
import { storageTools } from '@/shared/_tools';

interface ILayoutState {
  menu: IMenu;
  page: Page;
  showLoader: boolean;
  showMenu: boolean;
  showSetting: boolean;
  showSignInButton: boolean;
  snackBar: ISnackBar;
  theme: Theme;
}

// initial state
const initialState: ILayoutState = {
  menu: Menus.Empty,
  page: Page.Home,
  showLoader: false,
  showMenu: false,
  showSetting: false,
  showSignInButton: false,
  snackBar: {
    isSuccess: undefined,
    message: '',
    show: false,
  },
  theme: Theme.Light,
};

export interface ISnackBar {
  // true = success, false = failure, undefined = dismiss
  isSuccess?: boolean;
  message: string;
  show: boolean;
}

@Module({
  namespaced: true,
  name: 'LayoutStore',
  store,
  dynamic: true,
})
class LayoutStore extends VuexModule {
  // lowercase 'state' is reserved in Vuex
  private State: ILayoutState = _.cloneDeep(initialState);

  get mdTheme(): string {
    return (this.State.theme === Theme.Light) ? 'light' : 'dark';
  }

  get menu(): IMenu {
    return this.State.menu;
  }

  get page(): Page {
    return this.State.page;
  }

  get showLoader(): boolean {
    return this.State.showLoader;
  }

  get showMenu(): boolean {
    return this.State.showMenu;
  }

  get showSetting(): boolean {
    return this.State.showSetting;
  }

  get showSignInButton(): boolean {
    return this.State.showSignInButton;
  }

  get snackBar(): ISnackBar {
    return this.State.snackBar;
  }

  get theme(): Theme {
    return this.State.theme;
  }

  @Action
  public clear(showSignInButton: boolean): void {
    this.context.commit('Clear', showSignInButton);
  }

  @Action
  public dismissSnackBar(): void {
    this.context.commit('DismissSnackBar');
  }

  @Action
  public setMenu(menuName: string): void {
    if (this.menu.name === menuName) {
      return;
    }

    this.context.commit('SetMenu', menuName);
  }

  @Action
  public setPage(page: Page): void {
    if (Menus.IsValidPath(router.currentRoute.path) === true &&
        router.currentRoute.name &&
        this.menu.name !== router.currentRoute.name) {
      this.context.commit('SetMenu', router.currentRoute.name);
    }
    if (this.page === page) {
      return;
    }

    this.context.commit('SetPage', page);
  }

  @Action
  public setTheme(theme: Theme): void {
    if (theme === this.State.theme) {
      return;
    }

    const setting = storageTools.getUserSetting();
    storageTools.setUserSetting({
      ...setting,
      theme,
    });

    this.context.commit('SetTheme', theme);
  }

  @Action
  public setSnackBar(param: ISnackBar): void {
    const duration = (param.isSuccess === undefined)
      ? undefined : (param.isSuccess === true)
        ? LayoutConstants.SnackBar.SuccessDuration : Infinity;
    const payload = {
      ...param,
      duration,
    };

    this.context.commit('SetSnackBar', payload);
  }

  @Action({commit: 'ToggleLoader'})
  public toggleLoader(showLoader: boolean): boolean {
    return showLoader;
  }

  @Action({commit: 'ToggleMenu'})
  public toggleMenu(showMenu: boolean): boolean {
    return showMenu;
  }

  @Action
  public toggleSetting(show: boolean): void {
    if (this.context.getters.showSetting === show) {
      return;
    }

    this.context.commit('ToggleSetting', show);
  }

  @Action
  public toggleSignInButton(show: boolean): void {
    if (this.context.getters.page !== Page.Home ||
        this.context.getters.showSignInButton === show) {
      return;
    }

    this.context.commit('ToggleSignInButton', show);
  }

  @Mutation
  private Clear(showSignInButton: boolean): void {
    const state: ILayoutState = _.cloneDeep(initialState);
    state.showSignInButton = showSignInButton;

    this.State = state;
  }

  @Mutation
  private DismissSnackBar(): void {
    this.State.snackBar = {
      isSuccess: undefined,
      message: '',
      show: false,
    };
  }

  @Mutation
  private SetMenu(menuName: string): void {
    this.State.menu = Menus.GetMenu(menuName);
  }

  @Mutation
  private SetPage(page: Page): void {
    this.State.page = page;
  }

  @Mutation
  private SetSnackBar(payload: {
    duration: number | undefined;
    isSuccess: boolean | undefined;
    message: string;
    show: boolean;
  }): void {
    this.State.snackBar = _.cloneDeep(payload);
  }

  @Mutation
  private SetTheme(theme: Theme): void {
    this.State.theme = theme;
  }

  @Mutation
  private ToggleLoader(showLoader: boolean): void {
    this.State.showLoader = showLoader;
  }

  @Mutation
  private ToggleMenu(showMenu: boolean): void {
    this.State.showMenu = showMenu;
  }

  @Mutation
  private ToggleSetting(show: boolean): void {
    this.State.showSetting = show;
  }

  @Mutation
  private ToggleSignInButton(show: boolean): void {
    this.State.showSignInButton = show;
  }
}

export default getModule(LayoutStore);
