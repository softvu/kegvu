import axios from 'axios';
import Vue from 'vue';
import Vuex from 'vuex';
import { UNTAPPD } from './config';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // start with fake data for testing purposes
    beers: [{
      bid: 3952,
      beer_name: '60 Minute IPA',
      beer_label: 'https://untappd.akamaized.net/site/beer_logos/beer-3952_24028_sm.jpeg',
      beer_label_hd: 'https://untappd.akamaized.net/site/beer_logos_hd/beer-3952_41596_hd.jpeg',
      beer_abv: 6,
      beer_ibu: 60,
      beer_description: "60 Minute IPA is continuously hopped -- more than 60 hop additions over a 60-minute boil. Getting a vibe of where the name came from? 60 Minute is brewed with a slew of great Northwest hops. A powerful but balanced East Coast IPA with a lot of citrusy hop character, it's the session beer for hardcore enthusiasts!",
      beer_style: 'IPA - American',
      is_in_production: 1,
      beer_slug: 'dogfish-head-craft-brewery-60-minute-ipa',
      is_homebrew: 0,
      created_at: 'Sat, 21 Aug 2010 09:26:35 +0000',
      rating_count: 318765,
      rating_score: 3.8724,
      stats: {
          'total_count': 770872,
          'monthly_count': 5012,
          'total_user_count': 359341,
          'user_count': 0
      },
      brewery: {
          brewery_id: 459,
          brewery_name: 'Dogfish Head Craft Brewery',
          brewery_slug: 'dogfish-head-craft-brewery',
          brewery_type: 'Regional Brewery',
          brewery_page_url: '/dogfishbeer',
          brewery_label: 'https://untappd.akamaized.net/site/brewery_logos/brewery-459_7c86a.jpeg',
          country_name: 'United States',
          contact: {
              twitter: 'dogfishbeer',
              facebook: 'http://www.facebook.com/dogfishheadbeer',
              url: 'http://www.dogfish.com/'
          },
          location: {
              brewery_city: 'Milton',
              brewery_state: 'DE',
              lat: 38.7776,
              lng: -75.3099
          }
      },
    }],
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
