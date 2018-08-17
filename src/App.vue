<template>
  <v-app dark>
    <v-toolbar app d-flex align-center>
      <v-spacer/>
      <v-toolbar-title>KegVu</v-toolbar-title>
      <v-spacer/>
      <BeerSearch v-if="beers.length < 2"/>
    </v-toolbar>
    <v-content>
      <BeerDisplay v-if="beers.length < 3"/>
      <h2 v-else>Too many beers selected...</h2>
    </v-content>
    <v-footer fixed app>
      <span>&copy; {{ (new Date()).getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState } from 'vuex';
import BeerDisplay from './components/BeerDisplay';
import BeerSearch from './components/BeerSearch';

export default {
  name: 'App',
  components: {
    BeerDisplay,
    BeerSearch,
  },
  computed: {
    ...mapState(['beers']),
  },
}
</script>
