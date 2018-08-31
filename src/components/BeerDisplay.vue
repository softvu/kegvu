<template>
  <v-layout class="BeerDisplay" row align-center>
    <v-flex xs6 class="ma-4 beer" v-for="beer in beers" :key="beer.bid">
      <v-layout>
        <v-flex xs4 class="lil-label">
          <beer :beer="beer"></beer>
          <!-- <keg :percent="beer.beer_ibu" id="keg"></keg> -->
          <!-- <img :src="beer.beer_label_hd" class="label"/> -->
        </v-flex>
        <v-flex xs8>
          <div>
            <img :src="beer.beer_label_hd" class="label"/>
            <h1 class="display-2 text-truncate">{{ beer.beer_name }}</h1>
            <h3 class="display-1 font-weight-light">{{ beer.brewery.brewery_name }}</h3>
          </div>
          <br/>
          <h5 class="headline">{{ beer.beer_style }}</h5>
          <h5 class="subheading">{{ beer.beer_abv }}% ABV</h5>
          <h5 class="subheading">{{ beer.beer_ibu }} IBU</h5>
          <p class="body-1">{{ beer.beer_description }}</p>
          <h5 class="subheading">Tapped {{ beer.tapped | formatDate }}</h5>
          <v-btn @click="REMOVE_BEER(beer.bid)" color="error">Delete</v-btn>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import Beer from './Beer';
import Keg from './Keg';
import moment from 'moment';
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'BeerDisplay',
  components: { Beer },
  computed: {
    ...mapState(['beers']),
  },
  methods: {
    ...mapMutations(['REMOVE_BEER', 'UPDATE_VISIBILITY']),
  },
  filters: {
    formatDate: function(value) {
      if (value) {
        return moment(String(value)).format('MM/DD/YYYY')
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.beer {
  display: flex;
  flex-direction: column;
  // align-items: center;
  .label {
    height: 9vh;
    display: inline-block;
    border-radius: 50%;
    float: left;
    margin-right: 10px;
  }
  .description {
    // display: block;
    a {
      display: inline-block;
    }
  }
  .show-less {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 300px;
  }
}
</style>
