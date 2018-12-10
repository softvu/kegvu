<template>
  <div class="beer mt-5" @click="editMode = !editMode">
    <img :src="beer.image" class="label"/>
    <keg :percent="percent" ></keg>
    <div class="content-wrapper">
      <div class="heading-wrapper">
        <h5 class="subheading font-weight-light"><span>{{ beer.brewery.brewery_name }} - </span>Tapped {{ beer.tapped | formatDate }}</h5>
        <h1 class="display-2 text-truncate">{{ beer.beer_name }}</h1>
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
        <p class="subheading condensed">{{ beer.beer_description || 'No description' }}</p>
      </div>
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
      <v-btn v-show="editMode" @click="REMOVE_BEER(beer)" color="error">Delete</v-btn>
    </div>
  </div>
</template>

<style scoped lang="scss">
@font-face {
  font-weight: 400;
  font-style: normal;
  font-family: "Signboard";
  src: url(../assets/fonts/signboard.woff2);
}

.mt-5 {
  margin-top: 64px !important;
}

.subheading {
  margin-top: 16px;
}

.subheading span {
  font-size: 24px;
}

.beer {
  display: flex;
  position:relative;
  align-items: center;
  flex-direction: column;
  
  .content-wrapper {
    padding: 36px 88px 0px 88px;
  }

  .heading-wrapper {
    width: 100%;
  }

  .display-2 {
    opacity: .9;
    color: #ffffff;
    max-width: 25ch;
    text-transform: uppercase;
    font-family: 'Signboard' !important;
    text-shadow: 2px 2px 7px rgba( 0, 0, 0, .6);
  }
  .label {
    left: 12%;
    z-index: 4;
    width: 80px;
    height: 80px;
    min-width: 75px;
    margin-top: -15px;
    border-radius: 50%;
    position: absolute;
    display: inline-block;
    box-shadow: 2px 2px 5px black;
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
