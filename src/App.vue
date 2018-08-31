<template>
  <v-app dark>
    <v-toolbar app d-flex align-center>
      <v-spacer/>
      <v-toolbar-title>KegVu</v-toolbar-title>
      <v-spacer/>
      <BeerSearch v-if="beers.length < 2"/>
      <!-- <div id="particle-js" slot="extension"></div> -->
    </v-toolbar>
    <v-content>
      <BeerDisplay v-if="beers.length < 3"/>
      <h2 v-else>Too many beers selected...</h2>
    </v-content>
    <v-footer fixed app>
      <span>&copy; {{ (new Date()).getFullYear() }} Powered by Untappd</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import BeerDisplay from './components/BeerDisplay';
import BeerSearch from './components/BeerSearch';

export default {
  name: 'App',
  components: {
    BeerDisplay,
    BeerSearch,
  },
  mounted() {
    this.fetchPins();
  },
  computed: {
    ...mapState(['beers']),
  },
  methods: {
    ...mapActions(['fetchPins']),
  },
}
</script>
