<template v-if="pairs && wallets">
  <span>
    <p>
      <strong>
        <currency-symbol :currency="pair.coin_base" />
      </strong>
      {{ baseBalance }}
    </p>
    <p>
      <strong>
        <currency-symbol :currency="pair.coin_quote" />
      </strong>
      {{ quoteBalance }}
    </p>
  </span>
</template>

<script>
import { mapActions } from "vuex";
import currencyDecimalFormat from "@/mixins/currencyDecimalFormat";
import walletsMixin from "@/mixins/wallets";
import CurrencySymbol from "@/components/CurrencySymbol";

export default {
  name: "balance-desktop",
  mixins: [currencyDecimalFormat, walletsMixin],
  components: {
    CurrencySymbol
  },
  props: ["pairId"],
  data() {
    return {
      fetchWalletsInterval: null
    };
  },
  methods: {
    ...mapActions({
      fetchWallets: "Wallets/fetchWallets"
    })
  },
  created() {
    this.fetchWallets();
    this.fetchWalletsInterval = setInterval(() => this.fetchWallets(), 30000);
  },
  beforeDestroy() {
    clearInterval(this.fetchWalletsInterval);
  }
};
</script>
