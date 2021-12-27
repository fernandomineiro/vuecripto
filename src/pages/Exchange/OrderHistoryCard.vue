<template>
  <div>
    <!-- open orders -->
    <md-card v-if="openOrders && openOrders.length">
      <md-card-content>
        <md-table class="md-dense">
          <md-table-toolbar>
            <h1 class="md-title">{{ $t("exchange.openOrders") }}</h1>
          </md-table-toolbar>
          <md-table-row>
            <!-- <md-table-head>{{ $t("exchange.market") }}</md-table-head> -->
            <md-table-head>{{ $t("exchange.side.side") }}</md-table-head>
            <md-table-head>{{ $t("dateAndTime") }}</md-table-head>
            <md-table-head>{{ $t("exchange.amountPending") }}</md-table-head>
            <md-table-head>{{ $t("exchange.limit") }}</md-table-head>
            <md-table-head>{{ $t("exchange.amountExecuted") }}</md-table-head>
            <md-table-head>{{ $t("exchange.amountCanceled") }}</md-table-head>
            <md-table-head>{{ $t("exchange.totalPending") }}</md-table-head>
            <md-table-head>{{ $t("status") }}</md-table-head>
          </md-table-row>
          <sync-loader
            class="mt-4"
            color="#999999"
            v-if="loadingOrderHistory && orderHistory && !orderHistory.length"
          />
          <template v-else-if="orderHistory && orderHistory.length">
            <md-table-row v-for="order in openOrders" :key="order.id">
              <!-- <md-table-cell>{{
                getPairName(pairs.find(x => x.id == order.pair_id))
              }}</md-table-cell> -->
              <md-table-cell>
                {{ getTradeSideName(order.side_id) }}
              </md-table-cell>
              <md-table-cell>
                {{ $localeDate(order.created_at) }}
              </md-table-cell>
              <md-table-cell>
                {{
                  formatBaseCurrencyFromPairId(
                    new BigNumber(order.amount),
                    order.pair_id
                  )
                }}
              </md-table-cell>
              <md-table-cell>
                {{
                  formatQuoteCurrencyFromPairId(
                    new BigNumber(order.price),
                    order.pair_id
                  )
                }}
              </md-table-cell>
              <md-table-cell>
                {{
                  formatBaseCurrencyFromPairId(
                    new BigNumber(order.amount_executed),
                    order.pair_id
                  )
                }}
              </md-table-cell>
              <md-table-cell>
                {{
                  formatBaseCurrencyFromPairId(
                    new BigNumber(order.amount_canceled),
                    order.pair_id
                  )
                }}
              </md-table-cell>
              <md-table-cell>
                {{
                  formatQuoteCurrencyFromPairId(
                    new BigNumber(order.price).times(order.amount),
                    order.pair_id
                  )
                }}
              </md-table-cell>
              <md-table-cell>
                <badge :type="statusBadgeClass(order.status_id)">{{
                  status[order.status_id].description
                }}</badge>
              </md-table-cell>
              <md-table-cell>
                <md-button
                  v-if="order.status_id == 1"
                  @click="cancelOrder(order.id)"
                  class="md-danger md-sm"
                >
                  <md-icon>clear</md-icon> {{ $t("cancel") }}
                </md-button>
              </md-table-cell>
            </md-table-row>
          </template>
          <em v-else>{{ $t("exchange.noOrders") }}</em>
        </md-table>
      </md-card-content>
    </md-card>

    <!-- close orders -->
    <md-card v-if="closeOrders && closeOrders.length">
      <md-card-content>
        <md-table class="md-dense">
          <md-table-toolbar>
            <h1 class="md-title">{{ $t("exchange.closedOrders") }}</h1>
          </md-table-toolbar>
          <md-table-row>
            <!-- <md-table-head>{{ $t("exchange.market") }}</md-table-head> -->
            <md-table-head>{{ $t("exchange.side.side") }}</md-table-head>
            <md-table-head>{{ $t("dateAndTime") }}</md-table-head>
            <md-table-head>{{ $t("exchange.limit") }}</md-table-head>
            <md-table-head>{{ $t("exchange.amountExecuted") }}</md-table-head>
            <md-table-head>{{ $t("exchange.amountCanceled") }}</md-table-head>
            <md-table-head>{{ $t("exchange.totalExecuted") }}</md-table-head>
            <md-table-head>{{ $t("status") }}</md-table-head>
          </md-table-row>
          <sync-loader
            class="mt-4"
            color="#999999"
            v-if="loadingOrderHistory && orderHistory && !orderHistory.length"
          />
          <template v-else-if="orderHistory && orderHistory.length">
            <md-table-row v-for="order in closeOrders" :key="order.id">
              <!-- <md-table-cell>{{
                getPairName(pairs.find(x => x.id == order.pair_id))
              }}</md-table-cell> -->
              <md-table-cell>
                {{ getTradeSideName(order.side_id) }}
              </md-table-cell>
              <md-table-cell>
                {{ $localeDate(order.created_at) }}
              </md-table-cell>
              <md-table-cell>
                {{
                  formatQuoteCurrencyFromPairId(
                    new BigNumber(order.price),
                    order.pair_id
                  )
                }}
              </md-table-cell>
              <md-table-cell>
                {{
                  formatBaseCurrencyFromPairId(
                    new BigNumber(order.amount_executed),
                    order.pair_id
                  )
                }}
              </md-table-cell>
              <md-table-cell>
                {{
                  formatBaseCurrencyFromPairId(
                    new BigNumber(order.amount_canceled),
                    order.pair_id
                  )
                }}
              </md-table-cell>
              <md-table-cell>
                {{
                  formatQuoteCurrencyFromPairId(
                    new BigNumber(order.price).times(order.amount_executed),
                    order.pair_id
                  )
                }}
              </md-table-cell>
              <md-table-cell>
                <badge :type="statusBadgeClass(order.status_id)">{{
                  status[order.status_id].description
                }}</badge>
              </md-table-cell>
              <md-table-cell>
                <md-button
                  v-if="order.status_id == 1"
                  @click="cancelOrder(order)"
                  class="md-danger md-sm"
                >
                  <md-icon>clear</md-icon>
                  {{ $t("cancel") }}
                </md-button>
              </md-table-cell>
            </md-table-row>
          </template>
          <em v-else>{{ $t("exchange.noOrders") }}</em>
        </md-table>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import exchange from "@/api/exchange";
import SyncLoader from "vue-spinner/src/SyncLoader";
import currencyDecimalFormat from "@/mixins/currencyDecimalFormat";
import exchangeOrderTypeName from "@/mixins/exchangeOrderTypeName";
import tradeSideName from "@/mixins/tradeSideName";
import { Badge } from "@/components";
import { statusBadgeClass, getPairName } from "@/utils";
import BigNumber from "bignumber.js";

export default {
  mixins: [currencyDecimalFormat, exchangeOrderTypeName, tradeSideName],
  components: {
    SyncLoader,
    Badge
  },
  data() {
    return {
      fetchOrderHistoryInterval: null,
      BigNumber
    };
  },
  computed: {
    ...mapState({
      orderHistory: state => state.Exchange.orderHistory,
      openOrders: state => state.Exchange.openOrders,
      closeOrders: state => state.Exchange.closeOrders,
      loadingOrderHistory: state => state.Exchange.loadingOrderHistory,
      pairs: state => state.Pairs.pairs,
      status: state => state.Status.statuses
    })
  },
  methods: {
    ...mapActions({
      fetchOrderHistory: "Exchange/fetchOrderHistory",
      alert: "Alerts/alertUser"
    }),

    /**
     * @description Cancels a order and triggers update of order history
     * @param {number} orderId
     */
    cancelOrder(orderId) {
      exchange
        .cancelOrder(orderId, this.$store.state.ActiveSession.token)
        .then(() => {
          this.alert({
            title: this.$t("success"),
            message: this.$t("exchange.orderCanceled")
          });
          this.fetchOrderHistory();
        })
        .catch(err =>
          this.alert({
            title: this.$t("error"),
            message: this.$t(`api.exchange.${err.statusString}`)
          })
        );
    },

    /**
     * @description Formats a value as a base currency of a pair
     * @param {BigNumber} amount
     * @param {number} pairId
     * @returns {string | null}
     */
    formatBaseCurrencyFromPairId(amount, pairId) {
      const pair = this.pairs.find(x => x.id == pairId);
      if (!pair) {
        return null;
      }

      return this.formatCurrencyValueBigNumber(amount, pair.coin_base_id);
    },

    /**
     * @description Formats a value as a quote currency of a pair
     * @param {BigNumber} amount
     * @param {number} pairId
     * @returns {string | null}
     */
    formatQuoteCurrencyFromPairId(amount, pairId) {
      const pair = this.pairs.find(x => x.id == pairId);
      if (!pair) {
        return null;
      }

      return this.formatCurrencyValueBigNumber(amount, pair.coin_quote_id);
    },
    statusBadgeClass,
    getPairName
  },
  created() {
    this.fetchOrderHistory();
    this.fetchOrderHistoryInterval = setInterval(
      () => this.fetchOrderHistory(),
      1000
    );
  },
  beforeDestroy() {
    clearInterval(this.fetchOrderHistoryInterval);
  }
};
</script>

<style lang="scss">
.order-history-header-flex {
  display: flex;

  & > * {
    flex-grow: 1;
    flex-basis: auto;
  }

  & > .no-grow {
    flex-grow: 0;
  }
}

.spinner-align-middle {
  display: flex;
  align-content: center;
  align-items: center;
}
</style>
<style scoped>
.md-table-head,
.md-table-cell {
  text-align: center;
}
.md-table-cell-container .md-button {
  margin: 0;
  padding: 0;
  width: fit-content;
  min-width: 0;
  line-height: 0;
}
</style>
