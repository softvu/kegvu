<template>
  <div class="beer mt-5" @click="editMode = !editMode">
    <keg :percent="percent" ></keg>
    <div>
      <img :src="beer.image" class="label"/>
      <h1 class="display-2 text-truncate">{{ beer.beer_name }}</h1>
      <h3 class="display-1 text-no-wrap font-weight-light">{{ beer.brewery.brewery_name }}</h3>
    </div>
    <br/>
    <div class="description">
      <h5 class="headline">
        <v-layout>
          <v-flex xs8>{{ beer.beer_style }}</v-flex>
          <v-flex xs2>{{ beer.beer_abv }}% ABV</v-flex>
          <v-flex xs2>{{ beer.beer_ibu }} IBU</v-flex>
        </v-layout>
      </h5>
      <p class="subheading condensed">{{ beer.beer_description || 'No description'}}</p>
      <h5 class="subheading font-weight-light">Tapped {{ beer.tapped | formatDate }}</h5>
    </div>
    <div>
      <!-- <v-btn v-show="editMode" @click="editBeer" color="primary">Edit</v-btn> -->
      <v-dialog v-model="dialog" persistent max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline"><em>{{ beer.brewery.brewery_name }}</em> : {{ beer.beer_name }}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-select
                    v-model="formBeer.pin"
                    :items="pins"
                    label="Pin"
                    required
                  ></v-select>
                </v-flex>
                <v-flex md12>
                  <v-slider v-model="formBeer.fillPercent" label="Fill Percentage" min="0" max="100" thumb-label="always"></v-slider>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="dialog = false">Close</v-btn>
            <v-btn color="blue darken-1" flat @click.native="updateBeer()">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-btn v-show="editMode" @click.stop="openDialog()" color="primary">Edit</v-btn>
      <v-btn v-show="editMode" @click="REMOVE_BEER(beer.bid)" color="error">Delete</v-btn>
    </div>
  </div>
</template>

<style scoped lang="scss">
.beer {
  display: flex;
  flex-direction: column;
  align-items: center;

  .label {
    height: 9vh;
    display: inline-block;
    border-radius: 50%;
    float: left;
    margin-right: 10px;
    margin-top: 5px;
    min-width: 75px;
  }
  .description {
    max-width: 750px;
    min-width: 650px;
  }
  .beer-name {
    cursor: pointer;
  }
}
</style>

<script>
import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';
import moment from 'moment';
import Keg from './Keg';
import { FULL_KEG_PULSES, pulsesToKegFillRatio } from '../services/beer-math';
import { mapActions, mapMutations, mapState } from 'vuex';

export default {
  name: 'Beer',
  components: { Keg },
  data: () => ({
    percent: 100,
    pin: null,
    pulses: FULL_KEG_PULSES,
    ws: null,

    editMode: false,
    dialog: false,
    formBeer: {},
  }),
  props: {
    beer: Object,
  },
  mounted() {
    this.setPin(this.beer.pin);
  },
  computed: {
    fillPercent() {
      return (FULL_KEG_PULSES - this.pulses) / FULL_KEG_PULSES  * 100;
    },

    ...mapState(['pins']),
  },
  methods: {
    openDialog() {
      this.formBeer = cloneDeep(this.beer);
      this.formBeer.fillPercent = this.fillPercent;
      this.dialog = true;
    },
    updateBeer() {
      const updatedBeer = merge({}, this.beer, this.formBeer);
      this.UPDATE_BEER(updatedBeer);
      this.setPin(updatedBeer.pin);

      if (updatedBeer.fillPercent !== this.fillPercent) {
        this.updatePin({ pin: updatedBeer.pin, pulses: FULL_KEG_PULSES - ((updatedBeer.fillPercent / 100) * FULL_KEG_PULSES) });
      }

      this.dialog = false;
    },
    setPin(pin) {
      this.pin = pin;
      if (this.ws) this.ws.close();

      this.ws = new WebSocket(`ws://localhost:3030/subscribe/${this.pin}`);

      this.ws.onmessage = (msg) => {
        this.pulses = msg.data;
        this.percent = pulsesToKegFillRatio(this.pulses) * 100;
      };
    },

    ...mapMutations(['REMOVE_BEER', 'UPDATE_BEER']),
    ...mapActions(['updatePin']),
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
