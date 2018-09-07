<template>
  <v-dialog class="BeerSearch" v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-btn slot="activator" icon><v-icon>add</v-icon></v-btn>

    <v-card>
      <v-toolbar color="primary">
        <v-btn icon @click.native="close">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>Add Beer</v-toolbar-title>
      </v-toolbar>

      <div class="ma-4">
        <v-text-field
          v-model="search"
          class="query-field"
          label="Search Beer"
          prepend-icon="search"
          clearable
          autofocus
        ></v-text-field>

        <v-list three-line>
          <v-list-tile v-for="item in queryResults" :key="item.beer.bid" avatar @click="onBeerSelect(item)">
            <v-list-tile-avatar>
              <img :src="item.beer.beer_label"/>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.beer.beer_name }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ item.brewery.brewery_name }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios';
import debounce from 'lodash/debounce';
import { mapActions } from 'vuex';
import { UNTAPPD } from '../config';

export default {
  name: 'BeerSearch',
  data () {
    return {
      dialog: false,
      queryResults: [],
      // TODO loading icon
      isLoading: false,
      search: '',
    };
  },
  props: ['pin'],
  computed: {
    items() {
      console.log('recalculating items');
      const x = this.queryResults.map(data => {
        const Description = `${data.beer.beer_name} by ${data.brewery.brewery_name}`;
        // const bid = data.beer.bid; // move beer ID up so v-autcomplete can use it as an item value

        return Object.assign({}, data, { Description });
      });
      console.log(x);
      return x;
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
          console.log('returned successfully');
          this.queryResults = (res.data && res.data.response && res.data.response.beers && res.data.response.beers.items) || []; // >_>
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => (this.isLoading = false));
    },
    onBeerSelect(item) {
      item.pin = this.pin;
      this.addBeer(item)
        .then(() => this.close());
    },
    close() {
      this.search = '';
      this.dialog = false;
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.BeerSearch {
  display: inline-flex;
}
.query-field {
  max-width: 40rem;
}
</style>
