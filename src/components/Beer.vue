<template>
  <div class="beer">
    <keg :percent="percent"></keg>

    <h2 primary-title class="beer-name" @click="editMode = !editMode">{{ beer.beer_name }}</h2>
    <p>Made by {{ beer.brewery.brewery_name }}</p>
    
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

  img {
    height: 60vh;
  }

  .beer-name {
    cursor: pointer;
  }
}
</style>

<script>
import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';
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
        this.$forceUpdate();
      };
    },

    ...mapMutations(['REMOVE_BEER', 'UPDATE_BEER']),
    ...mapActions(['updatePin']),
  },
};
</script>
