<template>
  <v-app>
    <v-toolbar app d-flex align-center>
      <v-toolbar-title>KegVu</v-toolbar-title>

      <v-autocomplete
        @input="addBeer"
        :items="items"
        :loading="isLoading"
        :search-input.sync="search"
        hide-no-data
        hide-selected
        item-text="Description"
        placeholder="Search Untappd Beers"
        prepend-icon="mdi-database-search"
        return-object
      ></v-autocomplete>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <BeerDisplay :beers="beers"/>
    </v-content>
    <v-footer fixed app>
      <span>&copy; {{ (new Date()).getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import axios from 'axios';
import debounce from 'lodash/debounce';
import { UNTAPPD } from './config';
import BeerDisplay from './components/BeerDisplay';

export default {
  name: 'App',
  components: {
    BeerDisplay,
  },
  data () {
    return {
      beers: [],
      descriptionLimit: 60,
      queryResults: [],
      isLoading: false,
      search: null,
    };
  },
  computed: {
    items () {
      return this.queryResults.map(data => {
        const Description = `${data.beer.beer_name} by ${data.brewery.brewery_name}`;
        // const bid = data.beer.bid; // move beer ID up so v-autcomplete can use it as an item value

        return Object.assign({}, data, { Description });
      })
    }
  },
  watch: {
    search() {
      this.queryUntappd();
    },
  },
  created() {
    // TODO first call works but subsequent calls not working...?
    // we only get 100 untappd API calls per hour ;(
    this.queryUntappd = debounce(this.queryUntappd, 700, { 'maxWait': 3500 });
  },
  methods: {
    queryUntappd() {
      // Items have already been loaded
      if (this.items.length > 0) return;

      this.isLoading = true;

      console.log('querying untappd...');
      // Lazily load input items
      axios.get(`https://api.untappd.com/v4/search/beer?q=${this.search}&client_id=${UNTAPPD.client_id}&client_secret=${UNTAPPD.client_secret}`)
        .then(res => {
          this.queryResults = (res.data && res.data.response && res.data.response.beers && res.data.response.beers.items) || []; // >_>
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => (this.isLoading = false));
    },
    addBeer(data) {
      this.beers.push(data);
    },
  },
}
</script>
