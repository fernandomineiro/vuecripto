<template>
  <md-card>
    <md-card-header class="md-card-header-blue">
      <h4>
        <currency-symbol :currency="data.currency_base" />
        /
        <currency-symbol :currency="data.currency_quote" />
      </h4>
    </md-card-header>
    <md-card-content>
      <div class="md-layout">
        <div class="md-layout-item md-size-50">
          <h4 class="card-title">{{ $t("sell") }}</h4>
          <span class="text-danger">{{ data.sell }}</span>
        </div>
        <div class="md-layout-item md-size-50">
          <h4 class="card-title">{{ $t("buy") }}</h4>
          <span class="text-success">{{ data.buy }}</span>
        </div>
      </div>
    </md-card-content>
    <md-card-actions md-alignment="space-between">
      <md-button class="md-danger md-block" @click="openPrecisionModal()">
        {{ $t("trade.action") }}
        &nbsp;
        <currency-symbol :currency="data.currency_base" />
        /
        <currency-symbol :currency="data.currency_quote" />
      </md-button>
    </md-card-actions>
  </md-card>
</template>

<script>
import CurrencySymbol from "@/components/CurrencySymbol";
export default {
  name: "turbo-swap-precision",
  components: {
    CurrencySymbol
  },
  data() {
    return {
      amount: null,
      loading: false
    };
  },
  props: {
    data: { type: Object, required: true }
  },
  computed: {
    cardHeader() {
      return `${this.data.currency_base}/${this.data.currency_quote}`;
    }
  },
  methods: {
    openPrecisionModal() {
      this.$emit("open", this.data);
    }
  }
};
</script>

<style>
.md-card-header > h4 {
  color: #fff;
  font-weight: 700;
  margin-top: 10px;
  margin-bottom: 10px;
}
.v-spinner {
  display: inline-block;
}
.card-title {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
