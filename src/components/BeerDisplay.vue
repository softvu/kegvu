<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout row align-center>
        <v-card class="ma-4" v-for="data in beers">
          <!-- TODO there's a better image if you use the beer info API endpoint -->
          <v-card-media :src="data.beer.beer_label" height="200px"></v-card-media>

          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">{{ data.beer.beer_name }}</h3>
              <div>Made by {{ data.brewery.brewery_name }}</div>
            </div>
          </v-card-title>

          <v-card-actions>
            <v-btn flat color="orange">Share</v-btn>
            <v-btn flat color="orange">Explore</v-btn>
          </v-card-actions>
        </v-card>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
export default {
  name: 'BeerDisplay',
  props: {
    beers: Array,
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
