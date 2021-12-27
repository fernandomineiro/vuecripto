<template>
  <pricing-card card-class="md-card-raised" icon-color="icon-info">
    <h6 class="category" slot="category">{{ data.currency.name }}</h6>
    <img
      :src="iconUrl"
      :alt="data.currency.name"
      class="currency-icon"
      slot="icon"
    />
    <h4 class="title" slot="title">
      <currency-symbol :currency="data.currency.title" />
      {{ formattedBallance }}
    </h4>
    <template slot="description">
      <md-button
        class="md-info md-round md-block"
        @click="$emit('deposit', data.currency_id)"
      >
        {{ $t("wallets.deposit.deposit") }}
      </md-button>
      <md-button
        class="md-info md-round md-block"
        @click="$emit('withdraw', data.currency_id)"
      >
        {{ $t("wallets.withdraw.withdraw") }}
      </md-button>
      <md-button
        class="md-info md-round md-block"
        @click="
          $emit('transfer', {
            currency_id: data.currency_id,
            wallet_id: data.id
          })
        "
      >
        {{ $t("wallets.transfer.transfer") }}
      </md-button>
    </template>
  </pricing-card>
</template>

<script>
import { PricingCard } from "@/components";
import CurrencySymbol from "@/components/CurrencySymbol";
import { createNamespacedHelpers } from "vuex";

const { mapState } = createNamespacedHelpers("Currencies");

export default {
  name: "wallet",
  components: {
    PricingCard,
    CurrencySymbol
  },
  props: {
    data: {
      type: Object,
      default: () => ({
        id: 0,
        balance: 9999,
        currency_id: 15
      })
    }
  },
  computed: {
    iconUrl() {
      return `/img/${this.data.currency.icon}`;
    },
    formattedBallance() {
      let decimalPrecision = this.data.currency.decimals;
      return Number(this.data.balance).toFixed(decimalPrecision);
    },
    ...mapState(["currencies"])
  }
};
</script>

<style lang="scss" scoped>
.currency-icon {
  max-width: 50%;

  @media (min-width: 1200px) {
    max-width: 128px;
  }
}
</style>
