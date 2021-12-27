import { mapState } from "vuex";
import BigNumber from "bignumber.js";

export default {
  computed: {
    ...mapState({
      currencies: state => state.Currencies.currencies
    })
  },
  methods: {
    formatCurrencyValue(amount, currencyId) {
      // TODO: select proper formating
      const decimalPrecision = this.currencies[currencyId].decimals;
      return Number(amount).toFixed(decimalPrecision);
    },
    /**
     * @description Formats a BigNumber as a currency
     * @param {BigNumber} amount
     * @param {number} currencyId
     */
    formatCurrencyValueBigNumber(amount, currencyId) {
      if (!(amount instanceof BigNumber)) {
        throw new TypeError("amount must be an instance of BigNumber");
      }

      const decimalPrecision = this.currencies[currencyId].decimals;
      return amount.toFixed(decimalPrecision);
    }
  }
};
