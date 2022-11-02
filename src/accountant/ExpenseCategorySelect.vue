<template>
  <div>
    <div class="md-layout md-gutter">
      <div class="md-layout-item" style="width: 150px; margin-top: -30px; margin-bottom: -38px;">
        <md-field>
          <md-select
            v-model="accountant.getSelectedFloatingTransaction(transactionId).expenseCategory"
            id="category"
            name="category"
          >
            <md-option
              v-for="category in categories" :key="category"
              :value="category"
            >{{ category }}
            </md-option>
          </md-select>
        </md-field>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import _ from 'lodash';
import { ExpenseCategory } from './_data';
import accountant from './_store';

@Component
export default class ExpenseCategorySelect extends Vue {
  @Prop() public readonly transactionId!: string;
  // data
  public readonly accountant = accountant;
  public readonly categories: ExpenseCategory[] = _.values(ExpenseCategory);
  public selectedCategory: ExpenseCategory = accountant.getTransaction(this.transactionId).expenseCategory;

  // computed
}
</script>

<style lang="scss" scoped>

</style>
