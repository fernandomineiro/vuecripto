import { mapState, mapActions } from "vuex";
import moment from "moment";

export default {
  data() {
    return {
      requestForm: {
        pair_id: null,
        price: null,
        amount: null,
        otc_type_id: null,
        expire_at: null
      }
    };
  },
  computed: {
    ...mapState({
      pairs: state => state.Pairs.pairs,
      tradePairs: state => state.Pairs.tradePairs,
      otcSettings: state => state.Pairs.otcSettings,
      indicators: state => state.Indicators.indicators,
      wallets: state => state.Wallets.wallets
    }),

    /**
     * @description Determines if all needed store data is loaded
     * @returns {Boolean} Data is loaded
     */
    isStoreLoaded() {
      return (
        !!this.pairs &&
        !!this.pairs.length &&
        !!this.tradePairs &&
        !!this.tradePairs.length &&
        !!this.otcSettings &&
        !!this.otcSettings.length &&
        !!this.indicators &&
        !!Object.keys(this.indicators).length
      );
    },

    /**
     * @description Computes request total
     * @returns {Number} Total cost
     */
    total() {
      return (this.requestForm.amount * this.requestForm.price).toFixed(2);
    },

    /**
     * @description Provides selected pair info
     * @returns {Object|Boolean} Pair object
     */
    pair() {
      return this.pairs.find(x => x.id == this.requestForm.pair_id) || false;
    },

    /**
     * @description Provides pair and currencies settings
     * @returns {Object|undefined} Settings object
     */
    settings() {
      return this.otcSettings.find(x => x.id == this.requestForm.pair_id);
    },

    /**
     * @description Computes if expire time is in work hours
     * @returns {Boolean} Time is in work hours
     */
    isTimeInBounds() {
      if (!this.requestForm.expire_at) {
        return true;
      }

      // Time extraction, parsing and casting String -> Number
      const toNum = x => Number(x);
      const [hh, mm] = this.requestForm.expire_at.split(":").map(toNum);
      const [o_hh, o_mm] = this.settings.hours.open.split(":").map(toNum);
      const [c_hh, c_mm] = this.settings.hours.close.split(":").map(toNum);

      // Converting hours and minutes to just minutes for easier comparison
      const openMin = o_hh * 60 + o_mm;
      const closeMin = c_hh * 60 + c_mm;
      const timeMin = hh * 60 + mm;

      return timeMin >= openMin && timeMin <= closeMin;
    },

    /**
     * @description Provides current market price for the pair
     * @returns {Number|String} Pair market price
     */
    market() {
      const key =
        this.pair.coin_base.toLowerCase() +
        "_" +
        this.pair.coin_quote.toLowerCase();

      return this.indicators[key].price;
    },

    /**
     * @description Provides minimum required amount
     * @returns {Number} Minimum required amount
     */
    minAmount() {
      return this.settings.currency_rules[this.pair.coin_base].min_amount;
    },

    /**
     * @description Provides minimum required total
     * @returns {Number} Minimum required total
     */
    minTotal() {
      return this.settings.currency_rules[this.pair.coin_quote].min_total;
    },

    /**
     * @description Provides price index rate
     * @returns {Number} Price index rate
     */
    indexRate() {
      return this.settings.currency_rules[this.pair.coin_quote].index_rate;
    },

    /**
     * @description Computes minimum buy price
     * @returns {Number} Minimum buy price
     */
    minBuyPrice() {
      return this.market * (1 - this.indexRate);
    },

    /**
     * @description Computes maximum sell price
     * @returns {Number} Maximum sell price
     */
    maxSellPrice() {
      return this.market * (1 + this.indexRate);
    },

    /**
     * @description Provides warning text for minimum amount
     * @returns {String} Minimum amount warning
     */
    minAmountWarning() {
      // TODO: i18n
      return `Minimum amount to buy is ${this.minAmount} ${this.pair.coin_base}`;
    },

    /**
     * @description Provides warning text for minimum total
     * @returns {String} Minimum total warning
     */
    minTotalWarning() {
      return this.$t("otc.request.minValueIs", {
        val: this.minTotal + " " + this.pair.coin_quote
      });
    },

    /**
     * @description Provides warning for minimum buy price
     * @returns {String} Minimum buy price warning
     */
    minBuyPriceWarning() {
      return this.$t("otc.request.minBuyValueIs", {
        val: this.minBuyPrice.toFixed(2) + " " + this.pair.coin_quote
      });
    },

    /**
     * @description Provides warning for maximum sell price
     * @returns {String} Maximum sell price warning
     */
    maxSellPriceWarning() {
      return this.$t("otc.request.maxSellValueIs", {
        val: this.maxSellPrice.toFixed(2) + " " + this.pair.coin_quote
      });
    },

    /**
     * @description Computes validity of the form
     * @returns {Boolean} Form is valid
     */
    formValid() {
      return (
        this.requestForm.amount &&
        this.requestForm.amount >= this.minAmount &&
        this.requestForm.price &&
        (this.requestForm.otc_type_id == 1
          ? this.requestForm.price >= this.minBuyPrice
          : this.requestForm.price <= this.maxSellPrice) &&
        this.requestForm.expire_at &&
        this.isTimeInBounds &&
        this.total >= this.minTotal
      );
    },

    /**
     * @description Provides conditions for warnings
     * @returns {Object} Boolean map of warnings flags
     */
    warning() {
      return {
        timeOffBounds: !this.isTimeInBounds,
        minAmount:
          this.requestForm.amount && this.requestForm.amount < this.minAmount,
        minTotal:
          this.requestForm.amount &&
          this.requestForm.price &&
          this.total < this.minTotal,
        minBuyPrice:
          this.requestForm.otc_type_id == 1 &&
          this.requestForm.price &&
          this.requestForm.price < this.minBuyPrice,
        maxSellPrice:
          this.requestForm.otc_type_id == 2 &&
          this.requestForm.price &&
          this.requestForm.price > this.maxSellPrice
      };
    },
    walletBase() {
      return (
        this.wallets.find(x => x.currency_id == this.pair.coin_base_id) || false
      );
    },
    walletQuote() {
      return (
        this.wallets.find(x => x.currency_id == this.pair.coin_quote_id) ||
        false
      );
    },
    expireAtFmt() {
      return (
        moment(new Date()).format("YYYY-MM-DD") +
        ` ${this.requestForm.expire_at}:00`
      );
    }
  },
  methods: {
    ...mapActions({
      fetchOtcSettings: "Pairs/fetchOtcSettings",
      fetchTradePairs: "Pairs/fetchTradePairs",
      fetchIndicators: "Indicators/fetchIndicators",
      fetchWallets: "Wallets/fetchWallets"
    })
  },
  created() {
    this.fetchOtcSettings();
    this.fetchTradePairs();
    this.fetchIndicators();
    this.fetchWallets();
  }
};
