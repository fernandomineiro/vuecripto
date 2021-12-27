<template>
  <md-card>
    <md-card-content>
      <div class="text-center" v-if="!(pairs && wallets)">
        <clip-loader />
      </div>
      <template v-else>
        <strong>
          {{ $t("exchange.balances") }}
        </strong>
        <p>
          <strong>{{ pair.coin_base }}</strong>
          {{ baseBalance }}
        </p>
        <p>
          <strong>{{ pair.coin_quote }}</strong>
          {{ quoteBalance }}
        </p>
      </template>
    </md-card-content>
  </md-card>
</template>

<script>
import { mapActions } from "vuex";
import currencyDecimalFormat from "@/mixins/currencyDecimalFormat";
import walletsMixin from "@/mixins/wallets";
import ClipLoader from "vue-spinner/src/ClipLoader";

export default {
  name: "balance-mobile",
  mixins: [currencyDecimalFormat, walletsMixin],
  components: {
    ClipLoader
  },
  props: ["pairId"],
  data() {
    return {
      fetchWalletsInterval: null
    };
  },
  methods: {
    ...mapActions({
      fetchWallets: "Wallets/fetchWallets",
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
