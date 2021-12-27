<template>
  <md-table>
    <md-table-toolbar>
      <h1 class="md-title">
        <strong>{{ $t("invoice") }}</strong>
      </h1>
    </md-table-toolbar>
    <md-table-row>
      <md-table-cell>{{ $t("otc.request.type") }}</md-table-cell>
      <md-table-cell>
        {{ side }}
      </md-table-cell>
    </md-table-row>
    <md-table-row>
      <md-table-cell>{{ $t("amount") }}</md-table-cell>
      <md-table-cell>{{ amount }} {{ pair.coin_base }}</md-table-cell>
    </md-table-row>
    <md-table-row>
      <md-table-cell>{{ $t("price") }}</md-table-cell>
      <md-table-cell>{{ price }} {{ pair.coin_quote }}</md-table-cell>
    </md-table-row>
    <md-table-row>
      <md-table-cell>{{ $t("fee") }}</md-table-cell>
      <md-table-cell>
        {{ fee }}
        {{ pair.coin_quote }}
      </md-table-cell>
    </md-table-row>
    <md-table-row>
      <md-table-cell>{{ $t("total") }}</md-table-cell>
      <md-table-cell>{{ total }} {{ pair.coin_quote }}</md-table-cell>
    </md-table-row>
  </md-table>
</template>

<script>
import currencyDecimalFormat from "@/mixins/currencyDecimalFormat";
import { mapState } from "vuex";

export default {
  name: "OtcRequest",
  mixins: [currencyDecimalFormat],
  inject: ["tableContents", "pair"],
  computed: {
    ...mapState({
      statuses: state => state.Status.statuses
    }),
    side() {
      return this.tableContents.side == 1 ? this.$t("buy") : this.$t("sell");
    },
    amount() {
      return this.formatCurrencyValue(
        this.tableContents.amount,
        this.pair.coin_base_id
      );
    },
    price() {
      return this.formatCurrencyValue(
        this.tableContents.price,
        this.pair.coin_quote_id
      );
    },
    fee() {
      return this.formatCurrencyValue(
        this.tableContents.fee,
        this.pair.coin_quote_id
      );
    },
    total() {
      return this.formatCurrencyValue(
        this.tableContents.total,
        this.pair.coin_quote_id
      );
    }
    // statusBadgeClass() {
    //   return statusBadgeClass(this.tableContents.status_id);
    // },
    // statusBadgeText() {
    //   return this.statuses[this.tableContents.status_id].description;
    // }
  }
};
</script>
