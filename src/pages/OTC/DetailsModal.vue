<template>
  <form @submit.prevent="updateOtc" autocomplete="off">
    <modal v-if="!alert">
      <template slot="header">
        <h4 class="modal-title">{{ $t("otc.requests.otcDetails") }}</h4>
        <md-button
          class="md-simple md-just-icon md-round modal-default-button"
          @click="$emit('close')"
          v-if="!changing"
        >
          <md-icon>clear</md-icon>
        </md-button>
        <md-button
          class="md-simple md-just-icon md-round modal-default-button"
          @click="changing = false"
          v-else
        >
          <md-icon>navigate_before</md-icon>
        </md-button>
      </template>

      <template v-if="otcRequest">
        <!-- Details -->
        <md-table class="details-table" slot="body" v-if="!changing">
          <md-table-row>
            <md-table-cell class="details-property">
              {{ $t("otc.requests.otcType") }}
            </md-table-cell>
            <md-table-cell>{{ otcType }}</md-table-cell>
          </md-table-row>
          <md-table-row>
            <md-table-cell class="details-property">
              {{ $t("amount") }}
            </md-table-cell>
            <md-table-cell>{{ otcRequest.amount }}</md-table-cell>
          </md-table-row>
          <md-table-row>
            <md-table-cell class="details-property">
              {{ $t("price") }}
            </md-table-cell>
            <md-table-cell>{{ otcRequest.price }}</md-table-cell>
          </md-table-row>
          <md-table-row>
            <md-table-cell class="details-property">
              {{ $t("total") }}
            </md-table-cell>
            <md-table-cell>
              {{ Number(otcRequest.price) * Number(otcRequest.amount) }}
            </md-table-cell>
          </md-table-row>
          <md-table-row>
            <md-table-cell class="details-property">
              {{ $t("status") }}
            </md-table-cell>
            <md-table-cell>
              <badge :type="statusTypeClass">
                {{ statusDescription(otcRequest.status_id) }}
              </badge>
            </md-table-cell>
          </md-table-row>
          <md-table-row>
            <md-table-cell class="details-property">
              {{ $t("otc.requests.createdAt") }}
            </md-table-cell>
            <md-table-cell>{{ createdAt }}</md-table-cell>
          </md-table-row>
          <md-table-row>
            <md-table-cell class="details-property">
              {{ $t("otc.requests.expiresAt") }}
            </md-table-cell>
            <md-table-cell>{{ expiresAt }}</md-table-cell>
          </md-table-row>
          <md-table-row v-if="otcRequest.message">
            <md-table-cell class="details-property">
              {{ $t("otc.requests.message") }}
            </md-table-cell>
            <md-table-cell>{{ otcRequest.message }}</md-table-cell>
          </md-table-row>
        </md-table>

        <!-- Modify offer -->
        <template slot="body" v-else>
          <md-field :class="{ 'md-error': errors.has('amount') }">
            <label>
              {{ $t("otc.requests.amountTo") }} {{ otcType.toLowerCase() }}
            </label>
            <md-input
              v-model="amount"
              @keyup="calcTotal"
              v-validate="'required|decimal'"
              name="amount"
            ></md-input>
            <span class="md-suffix">{{ pair.coin_base }}</span>
          </md-field>
          <md-field :class="{ 'md-error': errors.has('price') }">
            <label>{{ $t("otc.requests.priceForEach") }}</label>
            <md-input v-model="price" @keyup="calcTotal"></md-input>
            <span class="md-suffix">{{ pair.coin_quote }}</span>
          </md-field>
          <md-field>
            <label>{{ $t("otc.requests.totalTo") }} {{ actionType }}</label>
            <md-input v-model="total" @keyup="calcAmount"></md-input>
            <span class="md-suffix">{{ pair.coin_quote }}</span>
          </md-field>
        </template>

        <sync-loader color="#999999" slot="footer" v-if="loading" />
        <div class="footer" slot="footer" v-else-if="!(isExpired || changing)">
          <md-button
            class="md-success"
            @click="acceptOtc"
            v-if="otcRequest.status_id == 1"
          >
            {{ $t("otc.requests.acceptOffer") }}
          </md-button>
          <!-- <md-button
            class="md-warning"
            @click="changing = true"
            v-if="otcRequest.status_id == 1"
          >
            {{ $t("otc.requests.modifyOffer") }}
          </md-button> -->
          <md-button class="md-danger md-block" @click="cancelOtc">
            {{ $t("otc.requests.cancelRequest") }}
          </md-button>
        </div>

        <div class="footer" slot="footer" v-if="changing">
          <md-button @click="changing = false">
            {{ $t("otc.requests.cancel") }}
          </md-button>
          <md-button type="submit" class="md-danger">
            {{ $t("otc.requests.submit") }}
          </md-button>
        </div>
      </template>
      <sync-loader color="#999999" slot="body" v-else />
    </modal>
  </form>
</template>

<script>
import { Modal, Badge } from "@/components";
import SyncLoader from "vue-spinner/src/SyncLoader";
import { dateFromString, getLocaleDateString, statusBadgeClass } from "@/utils";
import moment from "moment";
import otc from "@/api/otc";
import { mapState, mapActions } from "vuex";

export default {
  name: "details-modal",
  components: {
    Modal,
    Badge,
    SyncLoader
  },
  data() {
    return {
      changing: false,
      amount: null,
      price: null,
      total: null,
      alert: false,
      dataPollInterval: null,
      loading: false
    };
  },
  props: {
    otcId: Number
  },
  computed: {
    createdAt() {
      const date = dateFromString(this.otcRequest.created_at);
      return moment(date).format(getLocaleDateString() + " HH:mm:ss");
    },
    expiresAt() {
      const date = dateFromString(this.otcRequest.expires_at);
      return moment(date).format(getLocaleDateString() + " HH:mm:ss");
    },
    statusTypeClass() {
      return statusBadgeClass(this.otcRequest.status_id);
    },
    otcType() {
      return this.otcRequest.otc_type_id == 1
        ? this.$t("buy")
        : this.$t("sell");
    },
    actionType() {
      return (this.otcRequest.otc_type_id == 1
        ? this.$t("spend")
        : this.$t("receive")
      ).toLowerCase();
    },
    isExpired() {
      return this.otcRequest.status_id >= 3;
    },
    pair() {
      return this.pairs.find(x => x.id == this.requestId);
    },
    ...mapState({
      currencies: state => state.Currencies.currencies,
      statuses: state => state.Status.statuses,
      otcRequest: state => state.OTC.request
    })
  },
  methods: {
    ...mapActions("OTC", ["fetchRequest"]),
    statusDescription(id) {
      if (this.statuses[id]) {
        return this.statuses[id].description;
      } else {
        return "?";
      }
    },
    calcTotal() {
      if (this.amount && this.price) {
        this.total = (this.side == 1
          ? this.amount * this.price
          : this.amount * this.price
        ).toFixed(2);
      } else {
        this.total = null;
      }
    },
    calcAmount() {
      if (this.total && this.price) {
        this.amount = (this.side == 1
          ? this.total / this.price
          : this.total / this.price
        ).toFixed(8);
      } else {
        this.amount = null;
      }
    },
    async updateOtc() {
      if (await this.$validator.validate()) {
        otc
          .UpdateOtc(
            this.otcRequest.id,
            2,
            this.amount,
            this.price,
            this.$store.state.ActiveSession.token
          )
          .then(() => {
            this.alert = true;
            this.$store.dispatch("Alerts/alertUser", {
              title: this.$t("success"),
              message: this.$t("otc.updateModal.success"),
              onClose: () => (this.alert = false)
            });
            this.$store.dispatch("OTC/fetchRequests");
          })
          .catch(err => {
            this.alert = true;
            this.$store.dispatch("Alerts/alertUser", {
              title: this.$t("error"),
              message: this.$t(`api.otc.${err.statusString}`),
              onClose: () => (this.alert = false)
            });
          });
      }
    },
    acceptOtc() {
      otc
        .UpdateOtc(
          this.otcRequest.id,
          4,
          null,
          null,
          this.$store.state.ActiveSession.token
        )
        .then(() => {
          this.$store.dispatch("Alerts/alertUser", {
            title: this.$t("success"),
            message: this.$t("otc.updateModal.success")
          });
          this.$emit("close");
          this.$store.dispatch("OTC/fetchRequests");
        })
        .catch(err => {
          this.alert = true;
          this.$store.dispatch("Alerts/alertUser", {
            title: this.$t("error"),
            message: this.$t(`api.otc.${err.statusString}`),
            onClose: () => (this.alert = false)
          });
        });
    },
    cancelOtc() {
      this.loading = true;
      otc
        .DeleteOtc(this.otcRequest.id, this.$store.state.ActiveSession.token)
        .then(() => {
          this.$store.dispatch("Alerts/alertUser", {
            title: this.$t("success"),
            message: this.$t("otc.updateModal.success")
          });
          this.$emit("close");
          this.$store.dispatch("OTC/fetchRequests");
        })
        .catch(err => {
          this.alert = true;
          this.$store.dispatch("Alerts/alertUser", {
            title: this.$t("error"),
            message: this.$t(`api.otc.${err.statusString}`),
            onClose: () => (this.alert = false)
          });
        })
        .finally(() => (this.loading = false));
    },
    fetchAndUpdate() {
      this.fetchRequest(this.otcId).then(() => {
        this.amount = this.otcRequest.amount;
        this.price = this.otcRequest.price;
        this.calcTotal();
      });
    }
  },
  created() {
    this.$store.commit("OTC/clearRequest");
    this.fetchAndUpdate();

    this.dataPollInterval = setInterval(this.fetchAndUpdate, 10000);
  },
  beforeDestroy() {
    clearInterval(this.dataPollInterval);
  }
};
</script>

<style scoped>
.details-table {
  text-align: left;
  max-height: 75vh;
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
.footer {
  display: flex;
  justify-content: space-between;
  width: 100%;
  flex-wrap: wrap;
  line-height: 50px;
}
</style>
