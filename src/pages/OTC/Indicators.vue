<template>
  <md-card>
    <md-card-header class="md-card-header-blue">
      <h4>Indicadores</h4>
    </md-card-header>
    <md-card-content>
      <div class="md-layout">
        <div
          class="md-layout-item md-xsmall-size-100 md-small-size-50 md-size-33"
          v-for="indicator in indicators"
          :key="indicator.id"
        >
          <md-card class="text-center">
            <p>
              <strong>{{ indicator.name }}</strong>
            </p>
            <p>
              {{ indicator.symbol }}
              <pulse-loader
                color="#999999"
                size="8px"
                class="field-spinner"
                v-if="!market"
              />
              <span v-else>{{ market[indicator.key].price }}</span>
            </p>
          </md-card>
        </div>
      </div>
    </md-card-content>
  </md-card>
</template>

<script>
import PulseLoader from "vue-spinner/src/PulseLoader";
import { mapState } from "vuex";

export default {
  name: "indicators",
  components: {
    PulseLoader
  },
  data() {
    return {
      indicators: [
        { id: 0, name: "BTCBRL", symbol: "R$", key: "btc_brl" },
        { id: 1, name: "BTCUSD", symbol: "US$", key: "btc_usd" },
        { id: 2, name: "BTCEUR", symbol: "€", key: "btc_eur" }
      ],
      lastUpdate: null
    };
  },
  computed: {
    ...mapState({
      market: state => state.Indicators.indicators
    })
  },
  created() {
    this.$store.dispatch("Indicators/fetchIndicators");
  }
};
</script>

<style scoped>
.md-card-header > h4 {
  font-weight: 700;
  margin-top: 10px;
  margin-bottom: 10px;
}
p {
  margin: 1px 0;
}
</style>
