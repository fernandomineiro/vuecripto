<template>
  <div>
    <div class="md-layout">
      <div class="md-layout-item md-size-100">
        <md-card>
          <md-card-header class="md-card-header-blue">
            <h4>{{ $t("dashboard.indicators") }}</h4>
          </md-card-header>
          <md-card-content>
            <div class="md-layout text-primary">
              <div
                class="md-layout-item md-xsmall-size-100 md-small-size-50 md-size-33"
                v-for="indicator in indicators"
                :key="indicator.id"
              >
                <md-card class="text-primary">
                  <md-card-content>
                    <h3 class="card-title text-primary">
                      {{ indicator.name }}
                    </h3>
                    <div>
                      {{ indicator.symbol }}
                      <pulse-loader
                        color="#999999"
                        size="8px"
                        class="field-spinner"
                        v-if="!market"
                      />
                      <span v-else>{{ market[indicator.key].price }}</span>
                    </div>
                    <span>24h vol</span>&nbsp;
                    <pulse-loader
                      color="#999999"
                      size="8px"
                      class="field-spinner"
                      v-if="!market"
                    />
                    <span v-else>
                      <i class="fab fa-btc"></i>
                      {{ market[indicator.key].volume }}
                    </span>
                    <md-button
                      class="md-block md-info md-sm"
                      @click="setSymbol(indicator.key)"
                    >
                      <md-icon>show_chart</md-icon>
                      {{ $t("dashboard.seeChart") }}
                    </md-button>
                  </md-card-content>
                </md-card>
              </div>
              <p>{{ $t("dashboard.source") }}: Capital Digital Aberto</p>
            </div>
            <template v-if="activeSymbol">
              <h3>{{ $t("dashboard.chart") }}</h3>
              <TVChart
                datafeed-url="http://broker-backend.local:8080/api/charts"
                :symbol="activeSymbol"
              />
            </template>
          </md-card-content>
        </md-card>
      </div>
    </div>
    <exchange />
  </div>
</template>

<script>
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import indicators from "@/api/indicators";
import TVChart from "@/components/TVChart";
import Exchange from "@/pages/Exchange";

export default {
  components: {
    PulseLoader,
    TVChart,
    Exchange
  },
  data() {
    return {
      indicators: [
        { id: 0, name: "BTCBRL", symbol: "R$", key: "btc_brl" },
        { id: 1, name: "BTCUSD", symbol: "US$", key: "btc_usd" },
        { id: 2, name: "BTCEUR", symbol: "€", key: "btc_eur" }
      ],
      tradePairs: [],
      tradePairsLoading: false,
      market: null,
      tradeModal: {
        show: false,
        data: null
      },
      activeSymbol: null
    };
  },
  methods: {
    setSymbol(value) {
      this.activeSymbol = value;
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

<style scoped>
.md-card-header > h4 {
  font-weight: 700;
  margin-top: 10px;
  margin-bottom: 10px;
}
.field-spinner {
  display: inline-block;
}
.card-title {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
