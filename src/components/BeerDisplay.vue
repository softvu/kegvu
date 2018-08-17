<template>
  <v-layout class="BeerDisplay" row align-center>
    <v-flex xs6 class="ma-4 beer" v-for="beer in beers" :key="beer.bid">
      <img :src="beer.beer_label_hd"/>

      <h2 primary-title>{{ beer.beer_name }}</h2>
      <p>Made by {{ beer.brewery.brewery_name }}</p>

      <v-btn @click="REMOVE_BEER(beer.bid)" color="error">Delete</v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'BeerDisplay',
  computed: {
    ...mapState(['beers']),
  },
  methods: {
    ...mapMutations(['REMOVE_BEER']),
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.beer {
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    height: 60vh;
  }
}
</style>
