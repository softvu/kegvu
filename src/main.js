import '@babel/polyfill'
import Vue from 'vue'
import VueParticles from 'vue-particles';
import './plugins/vuetify'
import App from './App.vue'
import './registerServiceWorker'
import store from './store'

Vue.config.productionTip = false;
Vue.use(VueParticles);

new Vue({
  store,
  render: h => h(App),
}).$mount('#app');
