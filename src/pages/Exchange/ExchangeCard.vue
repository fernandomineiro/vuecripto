<!-- TO BE REFACTORED -->
<template>
  <div class="md-layout">
    <div class="md-layout-item md-size-100 mobile-balance">
      <balance-mobile pair-id="1" />
    </div>

    <div class="md-layout-item md-size-25 md-small-size-100 card-exchange">
      <div class="md-layout">
        <div class="md-layout-item md-size-60">
          <h5>
            {{
              tradeSide == TRADE_SIDE_BUY
                ? $t("exchange.iAmBuying")
                : $t("exchange.iAmSelling")
            }}
          </h5>
        </div>
        <div class="md-layout-item md-size-40 text-right">
          <h5 v-if="selectedPair">
            {{ getCurrencyNameFromId(this.pair.coin_base_id) }}
          </h5>
          <em v-else class="pull-right">{{ $t("exchange.selectAPair") }}</em>
        </div>
        <div class="md-layout-item md-size-100">
          <md-field>
            <label>{{ $t("amount") }}</label>
            <md-input
              type="number"
              v-model="amount"
              @focus="checkin('amount')"
              @blur="checkout"
              @input="updateFormFields"
              :disabled="!selectedPair"
              :step="baseStep"
              min="0"
            ></md-input>
            <span class="md-suffix" v-if="pair">
              <currency-symbol :currency="pair.coin_base" />
            </span>
          </md-field>
        </div>
      </div>
    </div>

    <div
      class="md-layout-item md-size-15 text-center exchange-button md-small-size-100"
    >
      <button
        class="change"
        @click="swapSides"
        :title="swapButtonTitle"
        :disabled="!selectedPair"
      >
        <i class="md-icon md-icon-font md-theme-default swaap_h_icon">
          swap_horiz
        </i>
        <i class="md-icon md-icon-font md-theme-default swaap_v_icon">
          swap_vert
        </i>
      </button>
    </div>

    <div
      class="md-layout-item md-large-size-25 md-small-size-100 card-exchange"
    >
      <div class="md-layout">
        <div class="md-layout-item md-size-60">
          <h5>
            {{
              tradeSide == TRADE_SIDE_BUY
                ? $t("exchange.iWantToPay")
                : $t("exchange.iWantToReceive")
            }}
          </h5>
        </div>
        <div class="md-layout-item md-size-40 text-right">
          <h5 v-if="selectedPair">
            {{ getCurrencyNameFromId(this.pair.coin_quote_id) }}
          </h5>
          <em v-else class="pull-right">{{ $t("exchange.selectAPair") }}</em>
        </div>
        <div class="md-layout-item md-size-100">
          <md-field>
            <label>{{ $t("exchange.limit") }}</label>
            <md-input
              type="number"
              v-model="price"
              @focus="checkin('price')"
              @blur="checkout"
              @input="updateFormFields"
              :disabled="!selectedPair"
              :step="quoteStep"
              min="0"
            ></md-input>
            <span class="md-suffix" v-if="pair">
              <currency-symbol :currency="pair.coin_quote" />
            </span>
          </md-field>
        </div>
      </div>
    </div>

    <div class="md-layout-item md-size-25 md-small-size-100 card-exchange">
      <div class="md-layout">
        <div class="md-layout-item md-size-100">
          <h5>{{ $t("total") }}</h5>
        </div>
        <div class="md-layout-item md-size-100">
          <md-field>
            <label>{{ $t("total") }}</label>
            <md-input
              type="number"
              v-model="total"
              @focus="checkin('total')"
              @blur="checkout"
              @input="updateFormFields"
              :disabled="!selectedPair"
              :step="quoteStep"
              min="0"
            ></md-input>
            <span class="md-suffix" v-if="pair">
              <currency-symbol :currency="pair.coin_quote" />
            </span>
          </md-field>
        </div>
        <div class="md-layout-item md-size-100">
          <sync-loader class="mt-4" color="#999999" v-if="loading" />
          <md-button
            class="md-info"
            @click="submit"
            :disabled="!canSubmitOrder"
            v-else
            >{{ submitText }}</md-button
          >
        </div>
      </div>
    </div>
    <div class="md-layout-item md-size-100 md-small-size-100">
      <orderbook />
    </div>
  </div>
</template>

<script>
import currencyDecimalFormat from "@/mixins/currencyDecimalFormat";
import exchange from "@/api/exchange";
import { mapState, mapActions } from "vuex";
import types from "@/utils/types";
import { getStepFromDecimals, getPairName } from "@/utils";
import SyncLoader from "vue-spinner/src/SyncLoader";
import ApiError from "@/api/ApiError";
import Orderbook from "./Orderbook";
import BigNumber from "bignumber.js";
import BalanceMobile from "./BalanceMobile";
import CurrencySymbol from "@/components/CurrencySymbol";
import CurrencySymbolMixin from "@/mixins/currencySymbol";

const { TRADE_SIDE_BUY, TRADE_SIDE_SELL, ORDER_LIMIT } = types;

export default {
  mixins: [currencyDecimalFormat, CurrencySymbolMixin],
  components: {
    SyncLoader,
    Orderbook,
    BalanceMobile,
    CurrencySymbol
  },
  data() {
    return {
      /**
       * @description Amount to be requested
       * @type {number | null}
       */
      amount: null,

      /**
       * @description Price to be requested
       * @type {number | null}
       */
      price: null,

      /**
       * @description Total for user conference
       * @type {number | null}
       */
      total: null,

      /**
       * @description Name of field currently in focus
       * @type {string | null}
       */
      focused: null,

      /**
       * @description Id of the pair chosen by the user
       * @type {number | null}
       */
      selectedPair: null,

      /**
       * @description Side of the operation
       * @type {1 | 2}
       */
      tradeSide: TRADE_SIDE_BUY,

      /**
       * @description Status of request. Usefull to control the display of
       * loading animation
       * @type {boolean}
       */
      loading: false,

      TRADE_SIDE_BUY,
      TRADE_SIDE_SELL
    };
  },
  methods: {
    ...mapActions({
      alert: "Alerts/alertUser"
    }),

    /**
     * @description Registers current input in focus
     * @param {string} fieldName Name of field in focus
     */
    checkin(fieldName) {
      this.focused = fieldName;
    },

    /**
     * @description Clears input in focus
     */
    checkout() {
      this.focused = null;
    },

    /**
     * @description Computes the amount with total and price
     * @returns {number} Amount
     */
    getAmount() {
      if (
        !(this.price && Number(this.price) && this.total && Number(this.total))
      ) {
        return null;
      }

      return this.formatCurrencyValueBigNumber(
        new BigNumber(this.total).div(this.price),
        this.pair.coin_base_id
      );
    },

    /**
     * @description Computes the total with amount and price
     * @returns {number} Total
     */
    getTotal() {
      if (
        !(
          this.price &&
          Number(this.price) &&
          this.amount &&
          Number(this.amount)
        )
      ) {
        return null;
      }

      return this.formatCurrencyValueBigNumber(
        new BigNumber(this.amount).times(this.price),
        this.pair.coin_quote_id
      );
    },

    /**
     * @description Updates form fields according to the field in focus
     */
    updateFormFields() {
      switch (this.focused) {
        case "price":
        case "amount":
          this.total = this.getTotal();
          break;

        case "total":
          this.amount = this.getAmount();
          break;

        default:
          break;
      }
    },

    /**
     * @description Swaps the trade side
     * @returns {1 | 2} Side after swap
     */
    swapSides() {
      this.tradeSide =
        this.tradeSide == TRADE_SIDE_BUY ? TRADE_SIDE_SELL : TRADE_SIDE_BUY;

      this.clearForm();

      return this.tradeSide;
    },

    /**
     * @description Gets the name of a currency with its ID
     * @param {number} currencyId
     * @returns {string} Currency name
     */
    getCurrencyNameFromId(currencyId) {
      const currency = this.currencies[currencyId];
      if (!currency) {
        return "";
      }

      return this.currencies[currencyId].name;
    },

    /**
     * @description Submits the request to the API
     */
    submit() {
      this.loading = true;
      exchange
        .createOrder(
          ORDER_LIMIT,
          {
            pair_id: this.selectedPair,
            amount: Number(this.amount),
            price: Number(this.price),
            side_id: this.tradeSide
          },
          this.$store.state.ActiveSession.token
        )
        .then(res => {
          this.alert({
            title: this.$t("success"),
            message: this.$t(
              res.status == 201
                ? "exchange.orderCreated"
                : Number(res.data.order.amount) > 0
                ? "exchange.orderExecutedPartial"
                : "exchange.orderExecuted"
            )
          });
          this.clearForm();
        })
        .catch(err => {
          if (err instanceof TypeError) {
            this.alert({
              title: this.$t("error"),
              message: err.message
            });
          } else if (err instanceof ApiError) {
            this.alert({
              title: this.$t("error"),
              message: this.$t(`api.exchange.${err.statusString}`)
            });
          }
        })
        .finally(() => (this.loading = false));
    },

    /**
     * @description Clears form data
     */
    clearForm() {
      this.amount = this.price = this.total = null;
    },

    getPairName
  },
  computed: {
    ...mapState({
      pairs: state => state.Pairs.pairs,
      currencies: state => state.Currencies.currencies
    }),

    /**
     * @description Currently selected pair
     * @returns {object | null}
     */
    pair() {
      return this.selectedPair !== null
        ? this.pairs.find(x => x.id == this.selectedPair)
        : null;
    },

    /**
     * @description ID of currency being sold
     * @returns {number | null}
     */
    iHave() {
      if (this.pair === null) {
        return null;
      }

      return this.tradeSide == TRADE_SIDE_BUY
        ? this.pair.coin_quote_id
        : this.pair.coin_base_id;
    },

    /**
     * @description ID of currency being bought
     * @returns {number | null}
     */
    iWant() {
      if (this.pair === null) {
        return null;
      }

      return this.tradeSide == TRADE_SIDE_BUY
        ? this.pair.coin_base_id
        : this.pair.coin_quote_id;
    },

    /**
     * @description Whether the submit button is enabled or not
     * @return {boolean}
     */
    canSubmitOrder() {
      return (
        this.selectedPair &&
        this.amount &&
        Number(this.amount) &&
        this.price &&
        Number(this.price)
      );
    },

    /**
     * @description Decimal places of base currency
     * @returns {number}
     */
    baseStep() {
      if (!(this.pair && this.currencies[this.pair.coin_base_id])) {
        return "0.01";
      }

      return getStepFromDecimals(
        this.currencies[this.pair.coin_base_id].decimals
      );
    },

    /**
     * @description Decimal places of quote currency
     * @returns {number}
     */
    quoteStep() {
      if (!(this.pair && this.currencies[this.pair.coin_quote_id])) {
        return "0.01";
      }

      return getStepFromDecimals(
        this.currencies[this.pair.coin_quote_id].decimals
      );
    },

    /**
     * @description Title of swap button according to the current trade side
     */
    swapButtonTitle() {
      return this.tradeSide == TRADE_SIDE_BUY
        ? this.$t("exchange.changeToSell")
        : this.$t("exchange.changeToBuy");
    },

    /**
     * @description Text of submit button
     * @returns {string}
     */
    submitText() {
      if (!this.pair) {
        return this.$t("exchange.selectAPair");
      }

      return this.$t(
        this.tradeSide == TRADE_SIDE_BUY
          ? "exchange.buyCur"
          : "exchange.sellCur",
        { cur: this.getCurrencySymbol(this.pair.coin_base) }
      );
    }
  },

  watch: {
    selectedPair(value) {
      this.clearForm();
      this.$store.dispatch("Exchange/fetchOrderbook", value);
    }
  },

  created() {
    this.selectedPair = this.pairs && this.pairs.length ? this.pairs[0].id : 1;
  }
};
</script>
<style scoped>
.pull-right {
  float: right;
}
.text-right {
  text-align: right;
}
</style>

<style>
.exchange-button {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.change {
  background: #f5cd47;
  border: none;
  width: 60%;
  height: 50%;
  max-width: 150px;
  max-height: 150px;
  cursor: pointer;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
  border-radius: 6px;
}
.change:disabled {
  cursor: not-allowed;
}
.change .md-icon {
  font-size: 20px !important;
}
.swaap_v_icon {
  display: none;
}
.mg-top {
  margin-top: 0 !important;
}
.card-exchange {
  padding: 0.3rem !important;
  margin: 0.5rem 0.5rem 0rem 0.5rem;
  border-radius: 0.3rem;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
}
.align-right {
  margin-left: auto;
}

.select-container {
  display: flex;
  align-items: center;
}
.mobile-balance {
  display: none;
}
@media (max-width: 1550px) {
  .change {
    width: 80%;
  }
}

@media (max-width: 1480px) {
  .change .md-icon {
    font-size: 50px !important;
  }
}

@media (min-width: 1380px) {
  .change .md-icon {
    font-size: 60px !important;
  }
}

@media (max-width: 1220px) {
  .change {
    width: 95%;
    height: 40%;
  }
  .change .md-icon {
    font-size: 45px !important;
  }
}

@media (max-width: 1180px) {
  .card-exchange {
    padding: 0.5rem !important;
    margin: 1rem 0.5rem !important;
  }
}

@media (max-width: 960px) {
  .swaap_v_icon {
    display: inline;
  }
  .swaap_h_icon {
    display: none;
  }
  .change {
    width: 100px;
    height: 100px;
  }
  .mobile-balance {
    display: block;
  }
}
</style>
