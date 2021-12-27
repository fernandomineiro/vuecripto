<template>
  <div class="indicators-marquee" @mouseover="pause" @mouseout="unpause">
    <pulse-loader color="#999999" v-if="!market" />
    <marquee-text :paused="paused" :repeat="4" v-else>
      <ul>
        <li v-for="indicator in indicators" :key="indicator.id">
          {{ indicator.name }}
          <badge type="info">
            {{ indicator.symbol }}
            {{ market[indicator.key].price }}
          </badge>
        </li>
      </ul>
    </marquee-text>
  </div>
</template>

<script>
import MarqueeText from "vue-marquee-text-component";
import { Badge } from "@/components";
import indicators from "@/api/indicators";
import PulseLoader from "vue-spinner/src/PulseLoader";

export default {
  name: "indicators-marquee",
  components: {
    MarqueeText,
    Badge,
    PulseLoader
  },
  data() {
    return {
      indicators: [
        { id: 0, name: "BTCBRL", symbol: "R$", key: "btc_brl" },
        { id: 1, name: "BTCUSD", symbol: "US$", key: "btc_usd" },
        { id: 2, name: "BTCEUR", symbol: "€", key: "btc_eur" }
      ],
      market: null,
      paused: false
    };
  },
  methods: {
    pause() {
      this.paused = true;
    },
    unpause() {
      this.paused = false;
    }
  },
  created() {
    indicators
      .getLatest()
      .then(res => (this.market = res.data))
      .catch(err => console.error(err));
  }
};
</script>

<style lang="scss">
.indicators-marquee {
  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      display: inline-block;
      padding: 0 16px;
      border-right: 1px dashed #999999;

      .badge {
        font-size: 0.8rem;
      }
    }
  }
}
</style>
