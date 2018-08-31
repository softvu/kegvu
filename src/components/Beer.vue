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

                <!-- <v-flex xs12 sm6 md4>
                  <v-text-field
                    label="Legal last name"
                    hint="example of persistent helper text"
                    persistent-hint
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="Email" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="Password" type="password" required></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-select
                    :items="['0-17', '18-29', '30-54', '54+']"
                    label="Age"
                    required
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-autocomplete
                    :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                    label="Interests"
                    multiple
                    chips
                  ></v-autocomplete>
                </v-flex> -->
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
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'BeerDisplay',
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
    ...mapState(['pins']),
  },
  methods: {
    openDialog() {
      this.formBeer = cloneDeep(this.beer);
      this.dialog = true;
    },
    updateBeer() {
      const updatedBeer = merge({}, this.beer, this.formBeer);
      this.UPDATE_BEER(updatedBeer);
      this.setPin(updatedBeer.pin);
      this.dialog = false;
    },
    setPin(pin) {
      this.pin = pin;
      if (this.ws) this.ws.close();

      this.ws = new WebSocket(`ws://localhost:3030/subscribe/${this.pin}`);

      this.ws.onmessage = (msg) => {
        this.pulses = msg.data;
      }
    },

    ...mapMutations(['REMOVE_BEER', 'UPDATE_BEER']),
  },
  watch: {
    pulses: {
      handler(pulses) {
        this.percent = pulsesToKegFillRatio(pulses) * 100;
      },
      immediate: true,
    },
  },
};
</script>
