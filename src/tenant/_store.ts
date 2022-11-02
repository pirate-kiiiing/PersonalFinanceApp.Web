import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import _ from 'lodash';
import HttpStatus from 'http-status-codes';
import { UserRole, IUserSetting } from './_data';
import assets from '@/assets/_store';
import pirateKingClient from '@/clients/pirateKingClient';
import { ISignInResponseContractV1 } from '@/clients/pirateKingClient';
import { Menus, Page, Theme } from '@/layout/_data';
import layout from '@/layout/_store';
import loaderAction from '@/layout/loaderAction';
import store from '@/shared/_store';
import { storageTools } from '@/shared/_tools';
import router from '@/router';

interface ITenantState {
  accessToken: string;
  currentUserId: string;
  tenantId: string;
  users: { [ key: string]: IUser };
}

export interface IUser {
  id: string;
  profileImageUrl: string;
  role: UserRole;
}

const initialState: ITenantState = {
  accessToken: '',
  currentUserId: '',
  tenantId: '',
  users: {},
};

@Module({
  namespaced: true,
  name: 'TenantStore',
  store,
  dynamic: true,
})
class TenantStore extends VuexModule {
  private State: ITenantState = _.cloneDeep(initialState);

  get accessToken(): string {
    return this.State.accessToken;
  }

  get canEditCatalog(): boolean {
    return (this.currentUser)
      ? this.currentUser.role === UserRole.Admin
      : false;
  }

  get currentUser(): IUser | undefined {
    return this.State.users[this.State.currentUserId];
  }

  get currentUserProfileImage(): string | undefined {
    return (this.currentUser) ? this.currentUser.profileImageUrl : undefined;
  }

  get id(): string {
    return this.State.tenantId;
  }

  /* getters with parameters */
  get getUser() {
    return (userId: string): IUser | undefined =>
      this.State.users[userId];
  }

  @Action
  public clear(): void {
    this.context.commit('Clear');
  }

  @Action
  public setUsers(users: { [ key: string ]: IUser }): void {
    this.context.commit('SetUsers', users);
  }

  @Action
  public async signIn(params: {
    googleToken?: string,
    path: string,
  }): Promise<void> {
    const { googleToken, path } = params;

    layout.toggleSignInButton(false);

    // 404
    if (Menus.IsValidPath(path) === false) {
      layout.setPage(Page.NotFound);
      return;
    }

    const response = await loaderAction.sendAsync(
      () => pirateKingClient.signIn(googleToken));

    if (!response || response.status !== HttpStatus.OK) {
      // tslint:disable-next-line
      console.log(response);

      layout.setPage(Page.Home);
      layout.toggleSignInButton(true);

      return;
    }

    // tslint:disable-next-line
    console.log('successfully signed in');

    const { accessToken, tenantId, userId, userProfileImageUrl, userRole }
      = (response.data as ISignInResponseContractV1);

    const currentUser: IUser = {
      id: userId,
      profileImageUrl: userProfileImageUrl,
      role: userRole,
    };

    if (storageTools.hasUserSetting() === false) {
      storageTools.setUserSetting({
        theme: Theme.Light,
      });
    }

    const userSetting: IUserSetting = storageTools.getUserSetting();
    const { theme } = userSetting;

    layout.setTheme(theme);

    this.context.commit('Init', {
      accessToken,
      currentUser,
      tenantId,
    });

    const menuName: string = Menus.GetMenuNameByPath(path);

    layout.setPage(Page.Default);
    layout.setMenu(menuName);
  }

  /**
   * returnPath:
   *  if provided, returns the user to the provided path
   *  upon successful re-login
   */
  @Action
  public async signOut(returnPath?: string): Promise<void> {
    // @ts-ignore
    const auth2 = gapi.auth2.getAuthInstance();

    try {
      await auth2.signOut();
    } catch (e) {
      // tslint:disable-next-line
      console.log('User failed to sign out', e);

      return;
    }

    const response = await loaderAction.sendAsync(() => pirateKingClient.signOut());
    if (response.status !== HttpStatus.NO_CONTENT) {
      // something's worng??
      // tslint:disable-next-line
      console.log(response);
    }

    assets.clear();
    layout.clear(true);
    this.context.commit('Clear');
    // tslint:disable-next-line
    console.log('Sign out success!');

    if (returnPath) {
      if (router.currentRoute.path !== returnPath) {
        router.push(returnPath);
      }
    } else if (router.currentRoute.path !== '/') {
      router.push('/');
    }

    return;
  }

  @Mutation
  private Clear(): void {
    this.State = _.cloneDeep(initialState);
  }

  @Mutation
  private Init(params: {
    accessToken: string;
    currentUser: IUser;
    tenantId: string;
  }): void {
    const { accessToken, currentUser, tenantId } = params;
    const { id } = currentUser;

    this.State.accessToken = accessToken;
    this.State.currentUserId = id;
    this.State.users = _.keyBy([ currentUser ], (u) => u.id);
    this.State.tenantId = tenantId;
  }

  @Mutation
  private SetUsers(users: { [ key: string ]: IUser }): void {
    this.State = {
      ...this.State,
      users: _.cloneDeep(users),
    };
  }
}

export default getModule(TenantStore);
