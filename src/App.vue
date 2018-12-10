<template>
  <v-app dark>
    <div class="black-bar"></div>
    <v-toolbar app d-flex align-center>
      <v-spacer/>
      <v-toolbar-title><img src="./assets/logo.png" alt="KegVu"/></v-toolbar-title>
      <v-spacer/>
      <!-- <BeerSearch v-if="beers.length < 2"/> -->
      <!-- <div id="particle-js" slot="extension"></div> -->
    </v-toolbar>
    <v-content>
      <BeerDisplay/>
      <!-- <h2 v-else>Too many beers selected...</h2> -->
    </v-content>
    <v-footer fixed app>
      <span>&nbsp;&copy; {{ (new Date()).getFullYear() }} Powered by <a href='https://untappd.com/'>Untappd</a> and <a href='https://www.softvu.com'><img src="./assets/softvu-logo.png"/></a></span>
    </v-footer>
  </v-app>
</template>

<style scoped lang="scss">
.application {
  background-size: cover;
  background-image: url('./assets/chalkboard-bg.jpg'); 
}

.theme--dark .v-toolbar {
  background: none !important;
  box-shadow: none !important;
}

.black-bar {
  top: 19%;
  width:100%;
  height: 280px;
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
}
.beer {
  display: flex;
  flex-direction: column;
  align-items: center;

  .description {
    margin-left: 10px;
    max-width: 750px;
    min-width: 650px;
  }
  .beer-name {
    cursor: pointer;
  }
}

.v-toolbar__title img {
  width: 120px;
}

.v-toolbar__title:not(:first-child) {
  width: 100%;
  opacity: .6;
  margin-right: 88px;
  text-align: center;
}

.v-footer {
  background: none !important;

  span {
    margin: 0 auto;
  }

  img {
    height: 15px;
    margin-bottom: -2px;
  }
}
</style>

<script>
import { mapActions, mapState } from 'vuex';
import BeerDisplay from './components/BeerDisplay';
export default {
  name: 'App',
  components: {
    BeerDisplay,
  },
  mounted() {
    this.fetchPins();
  },
  computed: {
    ...mapState(['beers']),
  },
  methods: {
    ...mapActions(['fetchPins']),
  },
}
</script>
