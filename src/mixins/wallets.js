import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      pairs: state => state.Pairs.pairs,
      wallets: state => state.Wallets.wallets
    }),

    pair() {
      return this.pairs.find(x => x.id == this.pairId);
    },

    baseWallet() {
      return this.wallets.find(x => x.currency_id == this.pair.coin_base_id);
    },

    quoteWallet() {
      return this.wallets.find(x => x.currency_id == this.pair.coin_quote_id);
    },

    baseBalance() {
      return this.formatCurrencyValue(
        this.baseWallet.balance,
        this.baseWallet.currency_id
      );
    },

    quoteBalance() {
      return this.formatCurrencyValue(
        this.quoteWallet.balance,
        this.quoteWallet.currency_id
      );
    }
  }
}