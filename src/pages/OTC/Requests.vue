<template>
  <div>
    <md-card>
      <md-card-header class="md-card-header-blue">
        <h4>{{ $t("otc.requests.openRequests") }}</h4>
      </md-card-header>
      <md-card-content>
        <md-table v-if="openRequests.length" v-model="openRequests" md-fixed-header>
          <md-table-row slot="md-table-row" slot-scope="{ item }">
            <md-table-cell :md-label="$t('otc.requests.request')">
              {{ type(item.otc_type_id) }} {{ item.amount }}
              {{ pair(item.pair_id).coin_base }} @ {{ item.price }}
              {{ pair(item.pair_id).coin_quote }}
            </md-table-cell>
            <md-table-cell :md-label="$t('otc.requests.status')">
              <badge :type="statusBadgeClass(item.status_id)">
                {{ statusDescription(item.status_id) }}
              </badge>
            </md-table-cell>
            <md-table-cell :md-label="$t('otc.requests.action')">
              <md-button
                class="md-just-icon md-danger md-round"
                @click="showDetailsModal(item)"
              >
                <md-icon>edit</md-icon>
              </md-button>
            </md-table-cell>
          </md-table-row>
        </md-table>
        <em v-else>{{ $t("otc.requests.noOpenRequests") }}</em>
      </md-card-content>
    </md-card>
    <md-card>
      <md-card-header class="md-card-header-blue">
        <h4>{{ $t("otc.requests.completeAndExpiredRequests") }}</h4>
      </md-card-header>
      <md-card-content>
        <md-table v-model="completedRequests" md-fixed-header>
          <md-table-row slot="md-table-row" slot-scope="{ item }">
            <md-table-cell :md-label="$t('otc.requests.request')">
              {{ type(item.otc_type_id) }} {{ item.amount }}
              {{ pair(item.pair_id).coin_base }} @ {{ item.price }}
              {{ pair(item.pair_id).coin_quote }}
            </md-table-cell>
            <md-table-cell :md-label="$t('otc.requests.status')">
              <badge :type="statusBadgeClass(item.status_id)">
                {{ statusDescription(item.status_id) }}
              </badge>
            </md-table-cell>
            <md-table-cell :md-label="$t('otc.requests.action')">
              <md-button
                class="md-just-icon md-danger md-round"
                @click="showDetailsModal(item)"
              >
                <md-icon>add</md-icon>
              </md-button>
            </md-table-cell>
          </md-table-row>
        </md-table>
      </md-card-content>
    </md-card>
    <details-modal
      :otc-id="detailsModal.otcId"
      v-if="detailsModal.show"
      @close="detailsModal.show = false"
    />
  </div>
</template>

<script>
import { Badge } from "@/components";
import DetailsModal from "./DetailsModal.vue";
import { mapState } from "vuex";
import { statusBadgeClass } from "@/utils";

export default {
  name: "requests",
  components: {
    Badge,
    DetailsModal
  },
  data() {
    return {
      detailsModal: {
        otcId: null,
        show: false
      }
    };
  },
  computed: {
    completedRequests() {
      return this.requests
        .filter(request => request.status_id >= 3)
        .slice(0, 5);
    },
    openRequests() {
      return this.requests.filter(request => request.status_id < 3);
    },
    ...mapState({
      requests: state => state.OTC.requests.sort((a, b) => b.id - a.id),
      statuses: state => state.Status.statuses,
      pairs: state => state.Pairs.pairs
    })
  },
  methods: {
    type(OtcTypeId) {
      return OtcTypeId == 1 ? this.$t("buy") : this.$t("sell");
    },
    showDetailsModal(otcRequest) {
      this.detailsModal.otcId = otcRequest.id;
      this.detailsModal.show = true;
    },
    statusBadgeClass,
    statusDescription(id) {
      if (this.statuses[id]) {
        return this.statuses[id].description;
      } else {
        return "?";
      }
    },
    pair(id) {
      return this.pairs.find(x => x.id == id);
    }
  }
};
</script>

<style scoped>
.md-card-header {
  color: #fff;
}

.md-card-header > h4 {
  font-weight: 700;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
