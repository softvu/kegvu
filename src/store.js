import axios from 'axios';
import Vue from 'vue';
import Vuex from 'vuex';
import { UNTAPPD } from './config';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    beers: [],
  },
  mutations: {
    ADD_BEER: (state, beer) => {
      console.log('adding beer', beer);
      state.beers.push(beer);
    },
    REMOVE_BEER: (state, bid) => {
      state.beers = state.beers.filter(b => b.beer.bid !== bid);
    },
  },
  actions: {
    addBeer: ({ commit }, { beer }) => {
      console.log('getting beer info', beer);
      axios.get(`https://api.untappd.com/v4/beer/info/${beer.bid}?client_id=${UNTAPPD.client_id}&client_secret=${UNTAPPD.client_secret}`)
        .then(res => {
          console.log('res', res);
          const beerInfo = res.data && res.data.response && res.data.response.beer;
          if (!beerInfo || !beerInfo.bid) throw new Error(`Beer ${beer.bid} not found`);
          commit('ADD_BEER', beerInfo);
        })
        .catch(err => {
          console.error(err);
        });
    },
  },
})