import { mapState, mapActions } from "vuex";
import {
  getAmountFromPriceAndTotal,
  getTotalFromPriceAndAmount
} from "@/utils";

/**
 * @description Provides swap request capabilities
 */
export default {
  data() {
    return {
      requestForm: {
        pair_id: null,
        amount: null,
        total: null,
        side: null
      }
    };
  },
  computed: {
    ...mapState({
      tradePairs: state => state.Pairs.tradePairs,
      currencies: state => state.Currencies.currencies,
      wallets: state => state.Wallets.wallets
    }),

    /**
     * @description Provides trade pair object
     * @returns {Object} Trade pair object
     */
    tradePair() {
      return (
        this.tradePairs.find(x => x.id == this.requestForm.pair_id) || false
      );
    },

    /**
     * @description Provides current buy price
     * @returns {Number} Current buy price
     */
    buyPrice() {
      return this.tradePair.buy;
    },

    /**
     * @description Provides current sell price
     * @returns {Number} Current sell price
     */
    sellPrice() {
      return this.tradePair.sell;
    },

    /**
     * @description Provides base currency object
     * @returns {Object|Boolean} Base currency object
     */
    baseCurrency() {
      return this.currencies[this.tradePair.coin_base_id] || false;
    },

    /**
     * @description Provides quoted currency object
     * @returns {Object|Boolean} Quoted currency object
     */
    quoteCurrency() {
      return this.currencies[this.tradePair.coin_quote_id] || false;
    },

    /**
     * @description Provides minimum sell amount
     * @returns {Number} Minimum sell amount
     */
    minSellAmount() {
      return this.tradePair.min_amount_to_sell;
    },

    /**
     * @description Provides minimum buy total
     * @returns {Number} Minimum buy total
     */
    minBuyValue() {
      return this.tradePair.min_value_to_buy;
    },

    /**
     * @description Provides the wallet with base currency
     * @returns {Object|Boolean} Base currency wallet
     */
    walletBase() {
      return (
        this.wallets.find(x => x.currency_id == this.tradePair.currencyBase.id) ||
        false
      );
    },

    /**
     * @description Provides the wallet with quoted currency
     * @returns {Object|Boolean} Quoted currency wallet
     */
    walletQuote() {
      return (
        this.wallets.find(x => x.currency_id == this.tradePair.currencyQuote.id) ||
        false
      );
    },

    /**
     * @description Computes if page data is loaded
     * @returns {Boolean} Store is loaded
     */
    isStoreLoaded() {
      return (
        !!this.tradePairs &&
        !!this.tradePairs.length &&
        !!this.wallets &&
        !!this.wallets.length
      );
    },

    amount() {
      return this.requestForm.amount
        ? Number(this.requestForm.amount)
        : getAmountFromPriceAndTotal(
            this.requestForm.side == "buy" ? this.buyPrice : this.sellPrice,
            this.requestForm.total
          );
    },

    /**
     * @description Computes trade total value
     * @returns {Number} Trade total
     */
    total() {
      return this.requestForm.total
        ? Number(this.requestForm.total)
        : getTotalFromPriceAndAmount(
            this.requestForm.side == "buy" ? this.buyPrice : this.sellPrice,
            this.requestForm.amount
          );
    },

    /**
     * @description Computes min sell amount warning message
     * @returns {String} Min sell amount warning
     */
    minSellAmountWarning() {
      const amount = `${this.minSellAmount} ${this.tradePair.coin_base}`;
      return this.$t("trade.warnings.minSellAmount", [amount]);
    },

    /**
     * @description Computes min buy total warning message
     * @returns {String} Min buy total warning
     */
    minBuyTotalWarning() {
      const total = `${this.minBuyValue} ${this.tradePair.coin_quote}`;
      return this.$t("trade.warnings.minBuyTotal", [total]);
    },

    maxBuyTotalWarning() {
      return this.$t("trade.warnings.maxBuyTotal", {
        cur: this.quoteCurrency.title
      });
    },

    maxSellAmountWarning() {
      return this.$t("trade.warnings.maxSellAmount", {
        cur: this.baseCurrency.title
      });
    },

    /**
     * @description Computes warnings flags
     * @returns {Object} Map of warnings flags
     */
    warning() {
      return {
        minSellAmount:
          this.requestForm.side == "sell" &&
          this.amount &&
          this.amount < this.minSellAmount,
        minBuyTotal:
          this.requestForm.side == "buy" &&
          this.amount &&
          this.total < this.minBuyValue,
        maxBuyTotal:
          this.requestForm.side == "buy" &&
          this.amount &&
          this.total > this.walletQuote.balance,
        maxSellAmount:
          this.requestForm.side == "sell" &&
          this.amount &&
          this.amount > this.walletBase.balance
      };
    },

    /**
     * @description Computes if form is currently valid
     * @returns {Boolean} Form is valid
     */
    formValid() {
      return Object.values(this.warning).every(x => x === false);
    }
  },
  methods: {
    ...mapActions({
      fetchTradePairs: "Pairs/fetchTradePairs",
      fetchWallets: "Wallets/fetchWallets"
    })
  },
  created() {
    this.fetchTradePairs();
    this.fetchWallets();
  }
};
