<template>
  <div ref="keg" class="keg">
    <v-layout wrap>
      <v-flex md5>
        <img src="./../assets/keg-back.png" class="back"/>
        <div class="beer-wrapper"><div class="beer" :style="{ height: rounded + '%', background: color }"></div></div>
        <img src="./../assets/keg-front.png" class="front"/>
      </v-flex>
      <v-flex md7>
        <div class="percent" :style="{ color }"><span>BEER LEVEL</span><br>{{ percent }}%</div> 
      </v-flex>
    </v-layout>
  </div>
</template>

<style lang="scss" scoped>
@font-face {
  font-family: "Signboard";
  font-style: normal;
  font-weight: 400;
  src: url(../assets/fonts/signboard.woff2);
}

.keg {
  width: 100%;
  text-align: left;
  padding-left: 148px;
}

.keg .front {
  z-index: 2;
  width: 320px; 
  position: relative;
}

.keg .back{
  z-index: 0;
  width: 320px; 
  position: absolute;
}

svg {
  fill: #ccc;
  height: 50vh;
  width: 50vh;
  margin-top: -20px;
}

svg g {
  background: linear-gradient(to bottom,
        rgba(226,184,43,0)  0%,
        rgba(226,184,43,0)  39%,
        rgba(226,184,43,1)  39%,
        rgba(226,184,43,1)  92%,
        rgba(226,184,43,0)  92%,
        rgba(226,184,43,0)  100%);
    -webkit-animate: background 1s ease-in-out;
}

.beer-wrapper {
  top: 88px;
  left:340px;
  width: 100px;
  height:300px;
  position: absolute;
}
.beer {
  bottom: 0;
  width: 100%;
  height: 100%;
  position: absolute;  
}

.percent {
    top: 50%;
    z-index: 3;
    width: 100%;
    font-size: 72px;
    text-align: left;
    line-height: 52px;
    font-weight: bold;
    position: relative;
    transform: translateY(-65%);
    font-family: 'Signboard' !important;
}

.percent span {
  font-weight: 300 !important;
  color: #ffffff !important;
  font-size: 22px !important;
  letter-spacing: normal !important;
  font-family: Roboto,sans-serif !important;
}

</style>

<script>
import './keg.svg';

const HEIGHT = 69;
const WIDTH = 49;
const X = 25.5;
const Y = 20;

export default {
  data: () => ({
    width: WIDTH,
    height: HEIGHT,
    x: X,
    y: Y,
    // values: ```
    // 1 0 0 0 0
    // 0 1 0 0 0
    // 0 0 1 0 0
    // 0 0 0 1 0
    // ```,
    color: '#00FF00',
  }),
  props: {
    percent: {
      type: Number,
      default: 99.9,
    },
  },
  computed: {
    rounded() {
      return Math.round(this.percent);
    },
  },
  watch: {
    percent: {
      handler: function(p) {
        const height = HEIGHT * (p / 100);
        this.height = height;
        this.y = HEIGHT + Y - this.height;

        this.color = perc2color(p);

        // this.$forceUpdate();
      },
      immediate: true,
    },
  }
}

function perc2color(perc) {
	let r = 0;
	let g = 0;
	const b = 55;
	if(perc < 50) {
		r = 255;
		g = Math.round(5.1 * perc);
	}
	else {
		g = 255;
		r = Math.round(355 - 2.0 * perc);
	}
	const h = r * 0x10000 + g * 0x100 + b * 0x1;
	return '#' + ('000000' + h.toString(16)).slice(-6);
}
</script>
