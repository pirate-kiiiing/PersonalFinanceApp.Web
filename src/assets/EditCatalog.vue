<template>
  <div>
    <md-dialog
      class="dialog"
      :md-active="showEditCatalog"
    >
      <md-dialog-title>Edit</md-dialog-title>
      <div class="wrapper">
        <md-datepicker
          md-immediately
          v-model="selectedDate"
          :md-disabled-dates="disabledDates"
        >
          <label>Date</label>
        </md-datepicker>
        <md-field>
          <label :for="assetLabel">{{ assetLabel }}</label>
          <md-select
            :id="assetLabel"
            :name="assetLabel"
            :placeholder="assetLabel"
            :value="assets.selectedEditAsset"
          >
            <div
              v-for="assetType in assets.assetTypes"
              :key="assetType"
              @click.prevent="onSelectAsset(assetType)"
            >
              <md-option :value="assetType">
                {{ assetType }}
              </md-option>
            </div>
          </md-select>
        </md-field>
        <md-field>
          <label :for="accountLabel">{{ accountLabel }}</label>
          <md-select
            :disabled="!assets.selectedEditAsset"
            :id="accountLabel"
            :name="accountLabel"
            :placeholder="accountLabel"
            :value="(selectedAccount) ? selectedAccount.name : undefined"
          >
            <div
              v-for="account in accounts"
              :key="account.id"
              @click.prevent="onSelectAccount(account)"
            >
              <md-option :value="account.name">
                {{ account.name }}
              </md-option>
            </div>
          </md-select>
        </md-field>
        <md-field md-clearable>
          <label>Balance</label>
          <span class="md-prefix">$</span>
          <md-input
            v-model="balance"
            @keypress="isNumber($event)"
          ></md-input>
        </md-field>
      </div>
      <md-dialog-actions>
        <md-button
          class="md-primary"
          :disabled="isResetClickable === false"
          @click="onClickReset()"
        >Reset
        </md-button>
        <md-button
          @click="toggleEditCatalog()"
        >Close
        </md-button>
        <md-button
          class="md-accent"
          :disabled="isSaveDisabled === true"
          @click="saveAsync()"
        >Save
        </md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import AssetConstants from './_constants';
import assets, { AssetType, IAccount } from './_store';
import { Theme } from '@/layout/_data';
import layout from '@/layout/_store';
import { Date } from '@/shared/Date';

@Component
export default class EditCatalog extends Vue {
  // data
  public accountLabel: string = 'Account';
  public assetLabel: string = 'Asset';
  public assets = assets;
  public selectedDate = Date.Today().toJsDate();
  private Balance: string | null = null;

  public disabledDates = (date) => date > Date.Today().toJsDate();

  @Watch('selectedDate')
  public onDateChange(newDate, oldDate) {
    //
  }

  // styles
  get errorMessage() {
    return {
      color: AssetConstants.Layout.Color[layout.theme].Error,
      fontSize: '17px',
      paddingRight: '22px',
    };
  }

  // computed
  get accounts(): IAccount[] {
    if (!assets.selectedEditAsset) {
      return [];
    }

    return assets.getAccountsOrderedByBalance(assets.selectedEditAsset);
  }

  get balance(): string | null {
    return this.Balance;
  }

  set balance(balance: string | null) {
    this.Balance = balance;
  }

  get isResetClickable(): boolean {
    return (this.selectedDate &&
      (Date.toDate(this.selectedDate).toString() !== Date.Today().toString()))
      || (assets.selectedEditAsset !== undefined)
      || (this.selectedAccount !== undefined)
      || (this.balance !== null);
  }

  get isSaveDisabled(): boolean {
    return !this.selectedDate
      || assets.selectedEditAsset === undefined
      || this.selectedAccount === undefined
      || this.balance === null
      || this.balance === '';
  }

  get selectedAccount(): IAccount | undefined {
    if (!assets.selectedEditAsset) {
      return undefined;
    }

    const account: IAccount | undefined
      = assets.getEditAccount(assets.selectedEditAsset);

    return (account) ? account : undefined;
  }

  // needs to be a computed property instead of data property
  get showEditCatalog(): boolean {
    return assets.showEditCatalog;
  }

  @Watch('selectedAccount')
  public onSelectedAccountChange(newAccount: IAccount, oldAccount: IAccount) {
    if (!newAccount || !assets.selectedEditAsset) {
      return;
    }

    const date: Date = Date.toDate(this.selectedDate);
    const balance: number = assets.getBalance(newAccount.id, date);
    this.Balance = `${balance}`;
  }

  // methods
  public isNumber($event: any) {
    // console.log($event.keyCode); //keyCodes value
    const keyCode = ($event.keyCode ? $event.keyCode : $event.which);

    // only allow number and one dot
    if ((keyCode < 48 || keyCode > 57) && (keyCode !== 46 || this.balance!.indexOf('.') !== -1)) { // 46 is dot
      $event.preventDefault();
    }

    // restrict to 2 decimal places
    if (this.balance !== null
      && this.balance.indexOf('.') > -1
      && (this.balance.split('.')[1].length > 1)) {
      $event.preventDefault();
    }
  }

  public onClickReset(): void {
    assets.resetEditCatalog();
    this.selectedDate = Date.Today().toJsDate();
    this.Balance = null;
  }

  public onSelectAccount(account: IAccount): void {
    assets.selectEditItem({
      id: account.id,
      type: 'account',
      value: account.name,
    });
  }

  public onSelectAsset(assetType: AssetType): void {
    assets.selectEditItem({
      id: assetType,
      type: 'asset',
      value: assetType,
    });
  }

  public async saveAsync(): Promise<void> {
    await assets.updateCatalogAsync({
      balance: parseFloat(this.balance!),
      date: Date.toDate(this.selectedDate),
    });
  }

  public toggleEditCatalog(): void {
    assets.toggleEditCatalog();
  }
}
</script>

<style lang="scss" scoped>
.dialog {
  height: 420px;
  width: 300px;
}

.wrapper {
  padding: 0 15px 0 15px;
}
</style>