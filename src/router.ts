import Vue from 'vue';
import Router from 'vue-router';
import { Menus } from '@/layout/_data';

Vue.use(Router);

export default new Router({
  mode: 'history',  // removes # from routes
  routes: [
    {
      path: `${Menus.Dashboard.path}`,
      alias: `/`,
      name: Menus.Dashboard.name,
      component: () => import(/* webpackChunkName: "dashboard" */ `@/dashboard/Dashboard.vue`),
    },
    {
      path: `${Menus.Assets.path}`,
      name: Menus.Assets.name,
      component: () => import(/* webpackChunkName: "assets" */ `@/assets/Assets.vue`),
    },
    {
      path: `${Menus.Accountant.path}`,
      name: Menus.Accountant.name,
      component: () => import(/* webpackChunkName: "accountant" */ `@/accountant/Accountant.vue`),
    },
  ],
});
