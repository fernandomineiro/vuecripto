<template>
  <div>
    <modal v-if="!alert">
      <template slot="header">
        <h4 class="modal-title">{{ $t("wallets.addWallet") }}</h4>
        <md-button
          class="md-simple md-just-icon md-round modal-default-button"
          @click="$emit('close')"
        >
          <md-icon>clear</md-icon>
        </md-button>
      </template>
      <template slot="body">
        <div class="md-layout">
          <div
            class="md-layout-item md-xsmall-size-100 md-size-50"
            v-for="currency in filteredCurrencies"
            :key="currency.id"
          >
            <div class="md-layout no-gutter">
              <div class="md-layout-item md-xsmall-size-20 md-size-33">
                <img
                  :src="iconUrl(currency.icon)"
                  :alt="currency.name"
                  class="currency-icon"
                />
              </div>
              <div
                class="md-layout-item md-xsmall-size-80 md-size-66 md-alignment-center-center"
              >
                <md-button
                  class="md-success md-block"
                  @click="addWallet(currency.id)"
                >
                  {{ $t("add") }} {{ currency.title }}
                </md-button>
                <h6 class="currency-name">
                  {{ currency.name }}
                </h6>
              </div>
            </div>
          </div>
        </div>
      </template>
    </modal>
  </div>
</template>

<script>
import { Modal } from "@/components";
import { createNamespacedHelpers } from "vuex";
import wallet from "@/api/wallet";

const { mapState } = createNamespacedHelpers("Currencies");
const { mapState: mapWalletsState } = createNamespacedHelpers("Wallets");

export default {
  name: "add-wallet-modal",
  components: {
    Modal
  },
  data() {
    return {
      selected: null,
      alert: false
    };
  },
  computed: {
    filteredCurrencies() {
      let currencies = {};

      for (const currency in this.currencies) {
        if (
          this.wallets.every(
            wallet => wallet.currency_id != this.currencies[currency].id
          )
        ) {
          currencies[currency] = this.currencies[currency];
        }
      }

      return currencies;
    },
    ...mapState(["currencies"]),
    ...mapWalletsState(["wallets"])
  },
  methods: {
    addWallet(id) {
      wallet
        .createWallet(id, this.$store.state.ActiveSession.token)
        .then(() => {
          this.$store.dispatch("Alerts/alertUser", {
            title: this.$t("success"),
            message: this.$t("wallets.created", {
              coin: this.currencies[id].name
            })
          });
          this.$store.dispatch("Wallets/fetchWallets");
        })
        .catch(err => {
          this.alert = true;
          this.$store.dispatch("Alerts/alertUser", {
            title: this.$t("error"),
            message: this.$t(`api.wallet.${err.statusString}`),
            onClose: () => (this.alert = false)
          });
        })
        .finally(() => this.$emit("close"));
    },
    iconUrl(icon) {
      return `https://storage.googleapis.com/cda-uploaded-files/public/assets/img/${icon}`;
    }
  }
};
</script>

<style scoped>
.currency-icon {
  min-width: 50px;
}
.md-layout-item {
  padding: 5px;
}
.currency-name {
  margin-top: 1px;
  margin-bottom: 1px;
}
</style>
