<template>
  <span :title="title">{{ symbol }}</span>
</template>

<script>
import CurrencySymbolMixin from "@/mixins/currencySymbol";

export default {
  name: "currency-symbol",
  mixins: [CurrencySymbolMixin],
  props: {
    currency: {
      type: String,
      required: false
    }
  },
  computed: {
    symbol() {
      return this.getCurrencySymbol(this.currency);
    },
    title() {
      return this.getCurrencyName(this.currency);
    }
  }
};
</script>
