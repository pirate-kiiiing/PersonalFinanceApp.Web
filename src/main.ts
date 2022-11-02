import Vue from 'vue';
import VueMaterial from 'vue-material';
import App from './App.vue';
import router from './router';
import store from './shared/_store';
import 'vue-material/dist/vue-material.min.css';

Vue.config.productionTip = false;

Vue.use(VueMaterial);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
