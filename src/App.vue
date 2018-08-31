<template>
  <v-app dark>
    <v-toolbar app d-flex align-center>
      <v-spacer/>
      <v-toolbar-title>KegVu&nbsp;<img src="./../public/favicon.png" width='30px;' style='margin-bottom: -7px;'/></v-toolbar-title>
      <v-spacer/>
      <BeerSearch v-if="beers.length < 2"/>
      <!-- <div id="particle-js" slot="extension"></div> -->
    </v-toolbar>
    <v-content>
      <BeerDisplay v-if="beers.length < 3"/>
      <h2 v-else>Too many beers selected...</h2>
    </v-content>
    <v-footer fixed app>
      <span>&nbsp;&copy; {{ (new Date()).getFullYear() }} Powered by <a href='https://untappd.com/'>Untappd</a> and <a href='https://www.softvu.com'><img src="./assets/logo.png" height='15px;' style='margin-bottom: -2px;'/></a></span>
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
