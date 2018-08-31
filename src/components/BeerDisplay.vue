<template>
  <v-layout class="BeerDisplay" row>
    <v-flex xs6 v-for="beer in beers" :key="beer.bid">
      <beer :beer="beer"></beer>
    </v-flex>
  </v-layout>
</template>

<script>
import Beer from './Beer';
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'BeerDisplay',
  components: { Beer },
  computed: {
    ...mapState(['beers']),
  },
  methods: {
    ...mapMutations(['REMOVE_BEER']),
  },
};
</script>
