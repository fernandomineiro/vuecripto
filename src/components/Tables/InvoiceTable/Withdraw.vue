<template>
  <md-table>
    <md-table-toolbar>
      <h1 class="md-title">
        <strong>{{ $t("invoice") }}</strong>
      </h1>
    </md-table-toolbar>

    <template v-if="loading">
      <sync-loader class="mt-4" color="#999999" />
      <p>{{ $t("wallets.withdraw.loadingInvoice") }}</p>
    </template>
    <template v-else>
      <md-table-row>
        <md-table-cell>{{ $t("amount") }}</md-table-cell>
        <md-table-cell>{{ invoice.amount }} {{ currency.title }}</md-table-cell>
      </md-table-row>
      <md-table-row>
        <md-table-cell>{{ $t("fee") }}</md-table-cell>
        <md-table-cell>{{ invoice.fee }} {{ currency.title }}</md-table-cell>
      </md-table-row>
      <md-table-row>
        <md-table-cell>{{ $t("total") }}</md-table-cell>
        <md-table-cell>
          {{ total }}
          {{ currency.title }}
        </md-table-cell>
      </md-table-row>
      <md-table-row>
        <md-table-cell>{{ $t("status") }}</md-table-cell>
        <md-table-cell>
          <badge :type="statusBadgeClass">
            {{ statusBadgeText }}
          </badge>
        </md-table-cell>
      </md-table-row>
      <md-table-row>
        <md-table-cell>{{ $t("date") }}</md-table-cell>
        <md-table-cell>
          {{ $localeDate(invoice.date) }}
        </md-table-cell>
      </md-table-row>
      <md-table-row v-if="isCrypto">
        <md-table-cell>{{ $t("wallets.withdraw.address") }}</md-table-cell>
        <md-table-cell>
          {{ invoice.obs }}
        </md-table-cell>
      </md-table-row>
      <md-table-row v-if="isCrypto">
        <md-table-cell>TXID</md-table-cell>
        <md-table-cell>
          {{ invoice.txid }}
        </md-table-cell>
      </md-table-row>
    </template>
  </md-table>
</template>

<script>
import { Badge } from "@/components";
import SyncLoader from "vue-spinner/src/SyncLoader";
import { mapState } from "vuex";
import statusBadgeClass from "@/utils/statusBadgeClass";
import invoice from "@/api/invoice";

export default {
  name: "Withdraw",
  inject: ["tableContents", "invoiceType"],
  components: {
    Badge,
    SyncLoader
  },
  data() {
    return {
      invoice: null,
      loading: true
    };
  },
  computed: {
    ...mapState({
      statuses: state => state.Status.statuses,
      currencies: state => state.Currencies.currencies
    }),
    isCrypto() {
      return this.invoiceType.split("/")[1] == "Crypto";
    },
    currency() {
      return this.currencies[this.invoice.currency_base_id];
    },
    side() {
      return this.tableContents.otc_type_id == 1
        ? this.$t("buy")
        : this.$t("sell");
    },
    total() {
      return Number(this.invoice.amount) + Number(this.invoice.fee);
    },
    statusBadgeClass() {
      return statusBadgeClass(this.invoice.status_id);
    },
    statusBadgeText() {
      return this.statuses[this.invoice.status_id].description;
    }
  },
  created() {
    invoice
      .GetById(this.tableContents.id, this.$store.state.ActiveSession.token)
      .then(res => (this.invoice = res))
      .catch(err => console.error(err))
      .finally(() => (this.loading = false));
  }
};
</script>
