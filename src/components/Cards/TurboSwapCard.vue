<template>
  <md-card>
    <md-card-header class="md-card-header-danger">
      <h4>Turbo Swap {{ data.currency_base }}/{{ data.currency_quote }}</h4>
    </md-card-header>
    <md-card-content>
      <div class="md-layout">
        <div class="md-layout-item md-size-50">
          <h4 class="card-title">{{ $t("sell") }}</h4>
          <span class="text-danger">{{ data.sell }}</span>
        </div>
        <div class="md-layout-item md-size-50">
          <h4 class="card-title">{{ $t("buy") }}</h4>
          <span class="text-success">{{ data.buy }}</span>
        </div>
        <div class="md-layout-item md-size-100">
          <md-field>
            <label>{{ $t("amount") }}</label>
            <md-input
              type="number"
              v-model="amount"
              step="0.00000001"
            ></md-input>
          </md-field>
        </div>
      </div>
    </md-card-content>
    <md-card-actions md-alignment="space-between">
      <md-button class="md-danger" @click="trade('sell')">
        {{ $t("sell") }} {{ data.currency_base }}
      </md-button>
      <md-button class="md-success" @click="trade('buy')">
        {{ $t("buy") }} {{ data.currency_quote }}
      </md-button>
    </md-card-actions>
  </md-card>
</template>

<script>
import trade from "@/api/trade";

export default {
  name: "turbo-swap-card",
  data() {
    return {
      amount: null,
      loading: false
    };
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          id: 1,
          buy: 27234.02,
          sell: 26166.02,
          min_value_to_buy: 500,
          min_amount_to_sell: 0.001,
          fee: 3,
          pair: "BTC_BRL",
          currncy_base: "BTC",
          currency_quote: "BRL"
        };
      }
    }
  },
  methods: {
    trade(side) {
      if (!(side == "buy" || side == "sell")) {
        console.error("Invalid side in trade");
        return;
      }
      trade
        .SendRequest(
          this.data.id,
          this.amount,
          side,
          this.$store.state.ActiveSession.token
        )
        .then(res => {
          this.$emit("trade", res);
        })
        .catch(err =>
          this.$store.dispatch("Alerts/alertUser", {
            title: this.$t("error"),
            message: this.$t(`api.trade.${err.statusString}`)
          })
        );
    }
  }
};
</script>

<style>
.md-card-header > h4 {
  color: #fff;
  font-weight: 700;
  margin-top: 10px;
  margin-bottom: 10px;
}
.v-spinner {
  display: inline-block;
}
.card-title {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
