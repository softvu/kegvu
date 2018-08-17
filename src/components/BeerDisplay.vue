<template>
  <v-layout class="BeerDisplay" row align-center>
    <div class="ma-4 beer" v-for="beer in beers">
      <!-- TODO there's a better image if you use the beer info API endpoint -->
      <img :src="beer.beer_label_hd" height="300px"></img>

      <h2 primary-title>
        <!-- <h3 class="headline mb-0">{{ beer.beer_name }}</h3> -->
        {{ beer.beer_name }}
      </h2>
      <p>Made by {{ beer.brewery.brewery_name }}</p>

      <v-card-actions>
        <v-btn flat color="orange">Share</v-btn>
        <v-btn flat color="orange">Explore</v-btn>
      </v-card-actions>
    </div>
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
.BeerDisplay {
  display: inline-flex;
}
.beer {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
