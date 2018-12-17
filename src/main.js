import '@babel/polyfill'
import axios from 'axios';
import Vue from 'vue'
import VueParticles from 'vue-particles';
import './filters';
import './plugins/vuetify'
import App from './App.vue'
import './registerServiceWorker'
import store from './store'

axios.defaults.baseURL = 'http://localhost:3030';

Vue.config.productionTip = false;
Vue.use(VueParticles);

new Vue({
  store,
  render: h => h(App),
  beforeCreate() {
    this.$store.commit('initialiseStore');

    this.$store.subscribe((mutation, state) => {
      // Store the state object as a JSON string
      localStorage.setItem('store', JSON.stringify(state));
    });

	}
}).$mount('#app');
