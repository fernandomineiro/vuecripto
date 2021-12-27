<template>
  <modal>
    <template slot="header">
      <h4 class="modal-title">{{ $t("invoices.invoiceDetails") }}</h4>
      <md-button
        class="md-simple md-just-icon md-round modal-default-button"
        @click="$emit('close')"
      >
        <md-icon>clear</md-icon>
      </md-button>
    </template>
    <md-table class="details-table" slot="body">
      <md-table-row>
        <md-table-cell class="details-property">
          {{ $t("invoices.invoiceType") }}
        </md-table-cell>
        <md-table-cell>
          {{ transactionType }}
        </md-table-cell>
      </md-table-row>
      <md-table-row>
        <md-table-cell class="details-property">
          {{ $t("amount") }}
        </md-table-cell>
        <md-table-cell>
          <currency-symbol :currency="data.coin_base" />
          {{ formatCurrencyValue(data.amount, data.coin_base_id) }}
        </md-table-cell>
      </md-table-row>
      <md-table-row>
        <md-table-cell class="details-property">
          {{ $t("price") }}
        </md-table-cell>
        <md-table-cell>
          <currency-symbol :currency="data.coin_quote" />
          {{ formatCurrencyValue(data.price, data.coin_quote_id) }}
        </md-table-cell>
      </md-table-row>
      <md-table-row>
        <md-table-cell class="details-property">
          {{ $t("total") }}
        </md-table-cell>
        <md-table-cell>
          <currency-symbol :currency="data.coin_quote" />
          {{ formatCurrencyValue(data.total, data.coin_quote_id) }}
        </md-table-cell>
      </md-table-row>
      <md-table-row>
        <md-table-cell class="details-property">{{ $t("fee") }}</md-table-cell>
        <md-table-cell>
          <currency-symbol :currency="data.coin_quote" />
          {{ formatCurrencyValue(data.fee, data.coin_quote_id) }}
        </md-table-cell>
      </md-table-row>
    </md-table>
  </modal>
</template>

<script>
import currencyDecimalFormat from "@/mixins/currencyDecimalFormat";
import { Modal } from "@/components";
import { mapState } from "vuex";
import CurrencySymbol from "@/components/CurrencySymbol";
import CurrencySymbolMixin from "@/mixins/currencySymbol";

export default {
  name: "trade-invoice",
  mixins: [currencyDecimalFormat, CurrencySymbolMixin],
  components: {
    Modal,
    CurrencySymbol
  },
  props: {
    data: Object
  },
  computed: {
    ...mapState({
      currencies: state => state.Currencies.currencies
    }),
    transactionType() {
      if (this.data.side == 1) {
        return this.$t("buy");
      } else {
        return this.$t("sell");
      }
    },
    quoteCoinType() {
      let typeId;
      for (const currency in this.currencies) {
        if (this.currencies[currency].title == this.data.coin_quote) {
          typeId = this.currencies[currency].currency_type_id;
        }
      }

      return typeId;
    }
  }
};
</script>

<style scoped>
.details-table {
  text-align: left;
  max-height: 75vh;
  table-layout: fixed;
}
.details-table .md-table-cell {
  padding-top: 4px;
  padding-bottom: 4px;
  height: 26px;
}
.details-property {
  font-weight: bold;
  text-align: right;
}
</style>
