<template>
  <div class="md-layout exchange-orderbook">
    <template v-if="currentPair">
      <div class="md-layout-item md-size-50 md-small-size-100">
        <md-table v-model="bids" md-card>
          <md-table-toolbar>
            <h1 class="md-title">{{ $t("exchange.buyers") }}</h1>
          </md-table-toolbar>

          <md-table-row slot="md-table-row" slot-scope="{ item }">
            <md-table-cell
              :md-label="$t('total')"
            >{{ formatQuoteCurrencyFromPairId(item.amount * item.price) }}</md-table-cell>
            <md-table-cell :md-label="$t('amount')">
              <strong>{{ formatBaseCurrencyFromPairId(item.amount) }}</strong>
            </md-table-cell>
            <md-table-cell :md-label="$t('price')">
              <strong>{{ formatQuoteCurrencyFromPairId(item.price) }}</strong>
            </md-table-cell>
          </md-table-row>

          <div class="text-center footer-exchange" slot="md-table-empty-state">
            <em>{{ $t("exchange.orderbookIsEmpty") }}</em>
          </div>
        </md-table>
      </div>
      <div class="md-layout-item md-size-50 md-small-size-100">
        <md-table v-model="asks" md-card>
          <md-table-toolbar>
            <h1 class="md-title">{{ $t("exchange.sellers") }}</h1>
          </md-table-toolbar>

          <md-table-row slot="md-table-row" slot-scope="{ item }">
            <md-table-cell :md-label="$t('price')">
              <strong>{{ formatQuoteCurrencyFromPairId(item.price) }}</strong>
            </md-table-cell>
            <md-table-cell :md-label="$t('amount')">
              <strong>{{ formatBaseCurrencyFromPairId(item.amount) }}</strong>
            </md-table-cell>
            <md-table-cell
              :md-label="$t('total')"
            >{{ formatQuoteCurrencyFromPairId(item.amount * item.price) }}</md-table-cell>
          </md-table-row>
          <div class="text-center footer-exchange" slot="md-table-empty-state">
            <em>{{ $t("exchange.orderbookIsEmpty") }}</em>
          </div>
        </md-table>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getPairName } from "@/utils";
import currencyDecimalFormat from "@/mixins/currencyDecimalFormat";

export default {
  name: "Orderbook",
  mixins: [currencyDecimalFormat],
  data() {
    return {
      /**
       * @description Handler for orderbook update interval
       * @type {number | null}
       */
      updateOrderbookInterval: null,
    };
  },
  computed: {
    ...mapState({
      orderbook: (state) => state.Exchange.orderbook,
      currentPair: (state) => state.Exchange.currentOrderbookPair,
      pairs: (state) => state.Pairs.pairs,
    }),

    /**
     * @description The currently selected pair object
     * @returns {object}
     */
    pair() {
      return this.pairs.find((x) => x.id == this.currentPair);
    },

    /**
     * @description Name of the currently selected pair without slash
     * @returns {string}
     */
    pairName() {
      if (!this.pair) {
        return "";
      }

      return getPairName(this.pair, false);
    },

    /**
     * @description List of asks from the orderbook
     * @returns {Array<object>}
     */
    asks() {
      const book = this.orderbook[this.pairName];

      if (!book) {
        return [];
      }

      return book.asks;
    },

    /**
     * @description List of bids from the orderbook
     * @returns {Array<object>}
     */
    bids() {
      const book = this.orderbook[this.pairName];

      if (!book) {
        return [];
      }

      return book.bids;
    },
  },
  methods: {
    /**
     * @description Updates orderbook if there is a selected pair
     */
    updateOrderbook() {
      if (this.currentPair) {
        this.$store.dispatch("Exchange/fetchOrderbook");
      }
    },

    /**
     * @description Formats a value as a base currency of the pair
     * @param {number} amount
     * @returns {string | null}
     */
    formatBaseCurrencyFromPairId(amount) {
      if (!this.pair) {
        return null;
      }

      return this.formatCurrencyValue(amount, this.pair.coin_base_id);
    },

    /**
     * @description Formats a value as a quote currency of the pair
     * @param {number} amount
     * @returns {string | null}
     */
    formatQuoteCurrencyFromPairId(amount) {
      if (!this.pair) {
        return null;
      }

      return this.formatCurrencyValue(amount, this.pair.coin_quote_id);
    },
  },
  created() {
    this.updateOrderbook();
    this.updateOrderbookInterval = setInterval(
      () => this.updateOrderbook(),
      1000
    );
  },
  beforeDestroy() {
    clearInterval(this.updateOrderbookInterval);
  },
};
</script>

<style scoped>
.md-table-cell {
  text-align: center;
}
.footer-exchange {
  margin: 1rem 0;
}
</style>

<style>
.exchange-orderbook table th.md-table-head {
  text-align: center;
}
</style>
