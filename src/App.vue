<template>
  <v-app dark>
    <v-toolbar app d-flex align-center>
      <v-toolbar-title>KegVu</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-autocomplete
        @input="addBeer($event); search=''"
        placeholder="Search Untappd Beers"
        :items="items"
        :loading="isLoading"
        :search-input.sync="search"
        item-text="Description"
        return-object
      ></v-autocomplete>

      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <BeerDisplay/>
    </v-content>
    <v-footer fixed app>
      <span>&copy; {{ (new Date()).getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import axios from 'axios';
import debounce from 'lodash/debounce';
import { mapActions } from 'vuex';
import { UNTAPPD } from './config';
import BeerDisplay from './components/BeerDisplay';

export default {
  name: 'App',
  components: {
    BeerDisplay,
  },
  data () {
    return {
      descriptionLimit: 60,
      queryResults: [],
      isLoading: false,
      search: null,
    };
  },
  computed: {
    items() {
      return this.queryResults.map(data => {
        const Description = `${data.beer.beer_name} by ${data.brewery.brewery_name}`;
        // const bid = data.beer.bid; // move beer ID up so v-autcomplete can use it as an item value

        return Object.assign({}, data, { Description });
      });
    },
  },
  watch: {
    search() {
      this.queryUntappd();
    },
  },
  created() {
    // we only get 100 untappd API calls per hour ;(
    this.queryUntappd = debounce(this.queryUntappd, 700, { 'maxWait': 3500 });
  },
  methods: {
    ...mapActions(['addBeer']),
    queryUntappd() {
      // prevent unnecessary queries such as when field becomes empty
      if (this.search.length < 4) return;
      this.isLoading = true;

      console.log('querying untappd...');
      // Lazily load input items
      // TODO DONT USE CLIENT ID AND CLIENT SECRET IF WEB APP IS PUBLICLY ACCESSIBLE
      axios.get(`https://api.untappd.com/v4/search/beer?q=${this.search}&client_id=${UNTAPPD.client_id}&client_secret=${UNTAPPD.client_secret}`)
        .then(res => {
          this.queryResults = (res.data && res.data.response && res.data.response.beers && res.data.response.beers.items) || []; // >_>
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => (this.isLoading = false));
    },
  },
}
</script>
