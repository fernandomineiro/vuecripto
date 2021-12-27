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
      <md-table-cell>
        {{ tableContents.amount }} {{ pair.coin_base }}
      </md-table-cell>
    </md-table-row>
    <md-table-row>
      <md-table-cell>{{ $t("price") }}</md-table-cell>
      <md-table-cell>
        {{ tableContents.price }} {{ pair.coin_quote }}
      </md-table-cell>
    </md-table-row>
    <md-table-row>
      <md-table-cell>{{ $t("total") }}</md-table-cell>
      <md-table-cell>
        {{ total }}
        {{ pair.coin_quote }}
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
      <md-table-cell>{{ $t("createdAt") }}</md-table-cell>
      <md-table-cell>
        {{ tableContents.created_at }}
      </md-table-cell>
    </md-table-row>
    <md-table-row>
      <md-table-cell>{{ $t("expiresAt") }}</md-table-cell>
      <md-table-cell>
        {{ tableContents.expires_at }}
      </md-table-cell>
    </md-table-row>
  </md-table>
</template>

<script>
import { Badge } from "@/components";
import { mapState } from "vuex";
import statusBadgeClass from "@/utils/statusBadgeClass";

export default {
  name: "OtcRequest",
  inject: ["tableContents", "pair"],
  components: {
    Badge
  },
  computed: {
    ...mapState({
      statuses: state => state.Status.statuses
    }),
    side() {
      return this.tableContents.otc_type_id == 1
        ? this.$t("buy")
        : this.$t("sell");
    },
    total() {
      return (
        Number(this.tableContents.amount) * Number(this.tableContents.price)
      ).toFixed(2);
    },
    statusBadgeClass() {
      return statusBadgeClass(this.tableContents.status_id);
    },
    statusBadgeText() {
      return this.statuses[this.tableContents.status_id].description;
    }
  }
};
</script>
