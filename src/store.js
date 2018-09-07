import axios from 'axios';
import Vue from 'vue';
import Vuex from 'vuex';
import { UNTAPPD } from './config';
import api from './services/api';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // start with fake data for testing purposes
    beers: UNTAPPD.exampleBeer ? { 14: {...UNTAPPD.exampleBeer, bid: 1, pin: 14}, 15: { ...UNTAPPD.exampleBeer, bid: 2, pin: 15 }} : {},
    pins: [],
  },
  getters: {
    beers: state => state.beers,
  },
  mutations: {
    initialiseStore(state) {
			// Check if the ID exists
			if(localStorage.getItem('store')) {
				// Replace the state object with the stored item
				this.replaceState(
					Object.assign(state, JSON.parse(localStorage.getItem('store')))
				);
			}
    },

    ADD_BEER: (state, { beer, pin }) => {
      console.log('adding beer', beer);
      beer.tapped = new Date;
      beer.pin = pin;
      if (beer.beer_label_hd != null && beer.beer_label_hd.length) {
        beer.image = beer.beer_label_hd
      } else if (beer.brewery.brewery_label != null && beer.brewery.brewery_label.length) {
        beer.image = beer.brewery.brewery_label
      } else {
        // Untappd will set a default beer image if none are available
        beer.image = beer.beer_label
      }
      Vue.set(state.beers, pin, beer);

    },
    REMOVE_BEER: (state, pin) => {
      // delete state.beers[pin];
      Vue.set(state.beers, pin, null);
    },
    UPDATE_BEER: (state, beer) => {
      Vue.set(state.beers, beer.pin, beer);
    },
    SET_PINS: (state, pins) => {
      state.pins = pins;
    }
  },
  actions: {
    addBeer: ({ commit }, { beer, pin }) => {
      console.log('getting beer info', beer);
      return axios.get(`https://api.untappd.com/v4/beer/info/${beer.bid}?client_id=${UNTAPPD.client_id}&client_secret=${UNTAPPD.client_secret}`)
        .then(res => {
          console.log('res', res);
          const beerInfo = res.data && res.data.response && res.data.response.beer;
          if (!beerInfo || !beerInfo.bid) throw new Error(`Beer ${beer.bid} not found`);
          commit('ADD_BEER', { beer: beerInfo, pin: pin });
        })
        .catch(err => {
          console.error('Error from Untappd: ', err);
        });
    },
    fetchPins({ commit }) {
      return api.fetchPins()
      .then(pins => {
        commit('SET_PINS', pins);
      });
    },
    updatePin(store, { pin, pulses }) {
      return api.updatePin(pin, pulses);
    },
  },
})
