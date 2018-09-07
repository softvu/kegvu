<template>
  <div ref="keg" class="keg">
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 100 100">
        <defs>
          <filter id="h200" x="0" y="0" width="1" height="1">
            <feColorMatrix type="hueRotate" values="250"/>
            <!-- <feColorMatrix type="matrix" :values="values"/> -->
          </filter>
          <linearGradient id="gradient">
            <stop offset="5%" :stop-color="color" />
            <stop offset="95%" :stop-color="color" />
          </linearGradient>
        </defs>
        <g>
          <rect ref="fill" :x="x" :y="y" :width="width" :height="height"></rect>
          <path
            d="M55.977,25.128H43.751c-2.082,0-3.777,1.694-3.777,3.777c0,2.082,1.694,3.776,3.777,3.776h12.226   c2.081,0,3.776-1.694,3.776-3.776C59.753,26.822,58.058,25.128,55.977,25.128z M55.977,30.099H43.751   c-0.659,0-1.195-0.535-1.195-1.194c0-0.659,0.536-1.195,1.195-1.195h12.226c0.659,0,1.194,0.536,1.194,1.195   C57.171,29.563,56.635,30.099,55.977,30.099z"
            id="path6" />
          <path
            class="contents"
            d="M75.86,31.208h-1.291c-1.117,0-2.027-0.909-2.027-2.027s0.91-2.027,2.027-2.027h1.291v-9.496H54.352V9.965h-3.198V7.582   h1.907V5h-6.395v2.582h1.907v2.383h-3.198v7.692H23.867v9.496h1.291c1.118,0,2.027,0.91,2.027,2.027s-0.909,2.027-2.027,2.027   h-1.291v59.699H75.86V31.208z M26.448,42.03h46.831v13.475H26.448V42.03z M47.956,12.547h3.814v5.111h-3.814V12.547z    M26.448,33.605c1.915-0.56,3.318-2.331,3.318-4.424c0-2.094-1.403-3.865-3.318-4.425v-4.517h18.927h8.978h18.926v4.517   c-1.915,0.56-3.318,2.331-3.318,4.425c0,2.093,1.403,3.865,3.318,4.424v5.607H26.448V33.605z M26.448,58.323h46.831v13.711H26.448   V58.323z M73.279,88.325H26.448v-13.71h46.831V88.325z"
            id="path8" />
          <rect
            x="23.867"
            y="92.418"
            width="52.267"
            height="2.582"
            id="rect10" />
        </g>
      </svg>
      <!-- <div class="percent">{{ percent }}%</div> -->
  </div>
</template>

<style lang="scss" scoped>
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

.percent {
    position: absolute;
    width: 100%;
    font-size: 1em;
    font-weight: bold;
    font-family: sans-serif;
    text-align: center;
    top: 57%;
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
      default: 100,
    },
  },
  watch: {
    percent: {
      handler: function(p) {
        const height = HEIGHT * (p / 100);
        this.height = height;
        this.y = HEIGHT + Y - this.height;

        this.color = perc2color(p);

        this.$nextTick(() => {
          this.$refs.fill.setAttribute('fill', `${this.color}`);
        });
        // this.$forceUpdate();
      },
      immediate: true,
    },
  }
}

function perc2color(perc) {
	var r, g, b = 0;
	if(perc < 50) {
		r = 255;
		g = Math.round(5.1 * perc);
	}
	else {
		g = 255;
		r = Math.round(510 - 5.10 * perc);
	}
	var h = r * 0x10000 + g * 0x100 + b * 0x1;
	return '#' + ('000000' + h.toString(16)).slice(-6);
}
</script>
