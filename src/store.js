import axios from 'axios';
import Vue from 'vue';
import Vuex from 'vuex';
import { UNTAPPD } from './config';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // start with fake data for testing purposes
    beers: UNTAPPD.exampleBeer ? [{ ...UNTAPPD.exampleBeer, bid: 1 }, { ...UNTAPPD.exampleBeer, bid: 2 }] : [],
    pins: [],
  },
  mutations: {
    ADD_BEER: (state, beer) => {
      console.log('adding beer', beer);
      beer.tapped = new Date;
      beer.full_visibility = false;
      state.beers.push(beer);
    },
    REMOVE_BEER: (state, bid) => {
      state.beers = state.beers.filter(b => b.bid !== bid);
    },
    UPDATE_VISIBILITY: (state, beer) => {
      beer.full_visibility = !beer.full_visibility;
      const beer_index = state.beers.findIndex((_beer) => _beer.bid == beer.bid);
      state.beers[beer_index] = beer;
    },
    initialiseStore(state) {
			// Check if the ID exists
			if(localStorage.getItem('store')) {
				// Replace the state object with the stored item
				this.replaceState(
					Object.assign(state, JSON.parse(localStorage.getItem('store')))
				);
			}
		}
  },
  actions: {
    addBeer: ({ commit }, { beer }) => {
      console.log('getting beer info', beer);
      return axios.get(`https://api.untappd.com/v4/beer/info/${beer.bid}?client_id=${UNTAPPD.client_id}&client_secret=${UNTAPPD.client_secret}`)
        .then(res => {
          console.log('res', res);
          const beerInfo = res.data && res.data.response && res.data.response.beer;
          if (!beerInfo || !beerInfo.bid) throw new Error(`Beer ${beer.bid} not found`);
          commit('ADD_BEER', beerInfo);
        })
        .catch(err => {
          console.error('Error from Untappd: ', err);
        });
    },
  },
})
