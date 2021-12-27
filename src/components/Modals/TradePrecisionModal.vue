<template>
  <form autocomplete="off">
    <trade-invoice
      :data="tradeInvoice.data"
      v-if="tradeInvoice.show"
      @close="onTradeInvoiceClose"
      @trade="tradeInvoiceShow"
    />
    <modal v-if="!alert && !tradeInvoice.show" id="boleta">
      <template slot="header">
        <h4 class="modal-title">
          {{ $t("trade.action") }}
          <currency-symbol :currency="data.currency_base" />
          /
          <currency-symbol :currency="data.currency_quote" />
        </h4>
        <md-button
          class="md-simple md-just-icon md-round modal-default-button"
          @click="$emit('close')"
        >
          <md-icon>clear</md-icon>
        </md-button>
      </template>
      <template slot="body">
        <md-content class="md-layout">
          <div class="md-layout-item md-size-50 md-caption">
            {{ $t("balance", { cur: baseSymbol }) }}:
            {{ formatCurrencyValue(baseBalance, data.currencyBase.id) }}
          </div>
          <div class="md-layout-item md-size-50 md-caption">
            {{ $t("balance", { cur: quoteSymbol }) }}:
            {{ formatCurrencyValue(quoteBalance, data.currencyBase.id) }}
          </div>
          <div class="md-layout-item md-size-50">
            <h4 class="card-title">
              {{ $t("sell") }}
              <currency-symbol :currency="data.currency_base" />
            </h4>
            <span class="text-danger">
              <currency-symbol :currency="data.currency_base" />
              {{ sellPrice }}
            </span>
            <md-field>
              <label>
                {{ $t("amount") }}
                <currency-symbol :currency="data.currency_base" />
              </label>
              <md-input
                type="number"
                v-model="sell_amount"
                step="0.00000001"
                v-on:keyup.native.capture="amountSell"
              ></md-input>
            </md-field>
            <md-field>
              <label>
                {{ $t("total") }}
                <currency-symbol :currency="data.currency_quote" />
              </label>
              <md-input
                type="number"
                v-model="sell_total"
                step="0.00000001"
                v-on:keyup.native.capture="totalSell"
              >
              </md-input>
            </md-field>
            <md-field>
              <md-button
                class="md-danger md-block"
                @click="trade('sell')"
                v-if="!loading"
              >
                {{ $t("sell") }} &nbsp;
                <currency-symbol :currency="data.currency_base" />
              </md-button>
            </md-field>
          </div>
          <div class="md-layout-item md-size-50">
            <h4 class="card-title">
              {{ $t("buy") }}
              <currency-symbol :currency="data.currency_base" />
            </h4>
            <span class="text-success">
              <currency-symbol :currency="data.currency_quote" />
              {{ buyPrice }}
            </span>
            <md-field>
              <label>
                {{ $t("amount") }}
                <currency-symbol :currency="data.currency_base" />
              </label>
              <md-input
                type="number"
                v-model="buy_amount"
                step="0.00000001"
                v-on:keyup.native.capture="amountBuy"
              ></md-input>
            </md-field>
            <md-field>
              <label>
                {{ $t("total") }}
                <currency-symbol :currency="data.currency_quote" />
              </label>
              <md-input
                type="number"
                v-model="buy_total"
                step="0.00000001"
                v-on:keyup.native.capture="totalBuy"
              >
              </md-input>
            </md-field>
            <md-field>
              <md-button
                class="md-success md-block"
                @click="trade('buy')"
                v-if="!loading"
              >
                {{ $t("buy") }} &nbsp;
                <currency-symbol :currency="data.currency_base" />
              </md-button>
            </md-field>
          </div>
        </md-content>
        <div class="text-center" slot="footer" v-if="loading">
          <sync-loader color="#999999" />
        </div>
      </template>
    </modal>
  </form>
</template>

<script>
import SwapRequest from "@/mixins/swapRequest";
import CurrencyDecimalFormat from "@/mixins/currencyDecimalFormat";
import { Modal } from "@/components";
import SyncLoader from "vue-spinner/src/SyncLoader";
import TradeInvoice from "@/components/Modals/TradeInvoice.vue";
import { mapState, mapActions } from "vuex";
import CurrencySymbol from "@/components/CurrencySymbol";
import CurrencySymbolMixin from "@/mixins/currencySymbol";

export default {
  name: "trade-precision-modal",
  mixins: [SwapRequest, CurrencyDecimalFormat, CurrencySymbolMixin],
  components: {
    Modal,
    TradeInvoice,
    SyncLoader,
    CurrencySymbol
  },
  data() {
    return {
      requestForm: {
        pair_id: this.data.id
      },
      buy_total: null,
      sell_total: null,
      buy_amount: null,
      sell_amount: null,
      alert: false,
      tradeInvoice: {
        data: null,
        show: false
      },
      loading: false
    };
  },
  props: {
    data: {
      type: Object
    }
  },
  computed: {
    ...mapState({
      wallets: state => state.Wallets.wallets,
      currencies: state => state.Currencies.currencies,
      twoFaMethod: state => state.ActiveSession.two_factor_method
    }),
    baseBalance() {
      return this.walletBase.balance;
    },
    quoteBalance() {
      return this.walletQuote.balance;
    },
    baseSymbol() {
      return this.getCurrencySymbol(this.data.currency_base);
    },
    quoteSymbol() {
      return this.getCurrencySymbol(this.data.currency_quote);
    }
  },
  methods: {
    ...mapActions({ twoFaRequest: "TwoFactor/request" }),
    tradeInvoiceShow(ev) {
      this.tradeInvoice.data = ev;
      this.tradeInvoice.show = true;
    },
    async amountBuy() {
      if (this.buy_amount && this.buyPrice) {
        this.buy_total = (this.buy_amount * this.buyPrice).toFixed(
          this.currencies[this.data.currencyQuote.id].decimals
        );
      } else {
        this.buy_total = null;
      }
    },
    async totalBuy() {
      if (this.buyPrice && this.buy_total) {
        this.buy_amount = (this.buy_total / this.buyPrice).toFixed(
          this.currencies[this.data.currencyBase.id].decimals
        );
      } else {
        this.buy_amount = null;
      }
    },
    async amountSell() {
      if (this.sell_amount && this.sellPrice) {
        this.sell_total = (this.sell_amount * this.sellPrice).toFixed(
          this.currencies[this.data.currencyQuote.id].decimals
        );
      } else {
        this.sell_total = null;
      }
    },
    async totalSell() {
      if (this.sellPrice && this.sell_total) {
        this.sell_amount = (this.sell_total / this.sellPrice).toFixed(
          this.currencies[this.data.currencyBase.id].decimals
        );
      } else {
        this.sell_amount = null;
      }
    },
    trade(side) {
      if (!(side == "buy" || side == "sell")) {
        console.error("Invalid side in trade");
        return;
      }

      let amount;
      if (side == "buy") {
        amount = this.buy_amount;
      } else {
        amount = this.sell_amount;
      }

      this.loading = true;
      if (this.twoFaMethod) {
        this.alert = true;
      }

      this.twoFaRequest({
        resource: "trade/sendRequest",
        args: [
          this.data.id,
          amount,
          side,
          this.$store.state.ActiveSession.token
        ],
        onCloseModal: () => (this.alert = false)
      })
        .then(res => {
          this.tradeInvoiceShow(res);
          this.clearForm();
          this.$store.dispatch("Wallets/fetchWallets");
        })
        .catch(err => {
          if (err === "cancelled") {
            return;
          }

          if (err.statusCode >= 500) {
            this.clearForm();
          }

          this.alert = true;
          this.$store.dispatch("Alerts/alertUser", {
            title: this.$t("error"),
            message: this.$t(`api.trade.${err.statusString}`),
            onClose: () => (this.alert = false)
          });
        })
        .finally(() => (this.loading = false));
    },
    clearForm() {
      this.buy_total = null;
      this.sell_total = null;
      this.buy_amount = null;
      this.sell_amount = null;
    },
    onTradeInvoiceClose() {
      this.tradeInvoice.show = false;
      this.$emit("close");
    }
  },
  watch: {
    sellPrice() {
      this.amountSell();
    },
    buyPrice() {
      this.amountBuy();
    }
  }
};
</script>

<style scoped>
.md-tabs + .md-tabs {
  margin-top: 24px;
}
#boleta {
  z-index: 999999;
}
</style>
