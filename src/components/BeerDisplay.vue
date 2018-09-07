<template>
  <v-layout class="BeerDisplay" row>
    <v-flex xs6>
      <beer :beer="beers[14]" v-if='beers[14]'></beer>
      <BeerSearch pin='14' v-if="!beers[14]"/>
    </v-flex>
    <v-flex xs6>
      <beer :beer="beers[15]" v-if='beers[15]'></beer>
      <BeerSearch pin='15' v-if="!beers[15]"/>
    </v-flex>
  </v-layout>
</template>

<script>
import Beer from './Beer';
import { mapMutations, mapState } from 'vuex';
import BeerSearch from './BeerSearch';

export default {
  name: 'BeerDisplay',
  components: {
    Beer,
    BeerSearch,
  },
  computed: {
    ...mapState(['beers']),
  },
  methods: {
    ...mapMutations(['REMOVE_BEER']),
  },
};
</script>
