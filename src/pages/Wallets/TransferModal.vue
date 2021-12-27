<template>
  <form autocomplete="off" @submit.prevent="transfer">
    <modal v-if="!alert" @close="$emit('close')">
      <template slot="header">
        <h4 class="modal-title">
          {{ $t("wallets.transfer.transfer") }} {{ currency.name }}
        </h4>
        <md-button
          class="md-simple md-just-icon md-round modal-default-button"
          @click="$emit('close')"
        >
          <md-icon>clear</md-icon>
        </md-button>
      </template>
      <template slot="body">
        <md-icon v-if="$device != 'mobile'" class="md-size-4x" md-src="/icon/transfer.svg"></md-icon>
        <md-field :class="{ 'md-error': errors.has('amount') }">
          <label>{{ $t("amount") }}</label>
          <md-input
            type="number"
            v-model="amount"
            v-validate="'required'"
            name="amount"
            step="0.00000001"
            v-if="isCrypto"
          ></md-input>
          <lazy-input
            type="text"
            v-model.lazy="amount"
            v-money="money"
            v-else
          />
          <span class="md-suffix">
            <currency-symbol :currency="currency.title" />
          </span>
        </md-field>
        <md-field :class="{ 'md-error': errors.has('email') }">
          <label>{{ $t("wallets.transfer.recipientEmail") }}</label>
          <md-input
            type="email"
            v-model="email"
            v-validate="'required|email'"
            name="email"
          ></md-input>
        </md-field>
      </template>
      <sync-loader color="#999999" slot="footer" v-if="loading"></sync-loader>
      <md-button class="md-danger md-block" type="submit" slot="footer" v-else>
        {{ $t("wallets.transfer.transfer") }}
      </md-button>
    </modal>
  </form>
</template>

<script>
import { Modal } from "@/components";
import SyncLoader from "vue-spinner/src/SyncLoader.vue";
import LazyInput from "@/components/Inputs/LazyInput.vue";
import { escapeMoney } from "@/utils";
import { mapState, mapActions } from "vuex";
import CurrencySymbol from "@/components/CurrencySymbol";

export default {
  name: "transfer-modal",
  components: {
    Modal,
    SyncLoader,
    LazyInput,
    CurrencySymbol
  },
  data() {
    return {
      email: null,
      amount: 0,
      loading: false,
      alert: false,
      money: {
        decimal: ",",
        thousands: "."
      }
    };
  },
  props: {
    currencyId: { type: Number, default: 5 },
    walletId: { type: Number, default: 0 }
  },
  computed: {
    currency() {
      return this.currencies[this.currencyId];
    },
    isCrypto() {
      return this.currency.currency_type_id != 2;
    },
    ...mapState({
      currencies: state => state.Currencies.currencies,
      twoFaMethod: state => state.ActiveSession.two_factor_method
    })
  },
  methods: {
    ...mapActions({ twoFaRequest: "TwoFactor/request" }),
    async transfer() {
      if (await this.$validator.validate()) {
        this.loading = true;
        if (this.twoFaMethod) {
          this.alert = true;
        }

        this.twoFaRequest({
          resource: "internalTransfer/transfer",
          args: [
            this.walletId,
            this.isCrypto ? this.amount : escapeMoney(this.amount),
            this.email
          ],
          onCloseModal: () => (this.alert = false)
        })
          .then(() => {
            this.$store.dispatch("Wallets/fetchWallets");
            this.$store.dispatch("Alerts/alertUser", {
              title: this.$t("success"),
              message: this.$t("wallets.transfer.success")
            });
            this.$emit("close");
          })
          .catch(err => {
            if (err === "cancelled") {
              return;
            }

            this.alert = true;
            this.$store.dispatch("Alerts/alertUser", {
              title: this.$t("error"),
              message: this.$t(`api.internalTransfer.${err.statusString}`),
              onClose: () => (this.alert = false)
            });
          })
          .finally(() => (this.loading = false));
      }
    }
  }
};
</script>

<style scoped>
.modal-title,
.modal-message {
  color: #3c4858;
}
</style>
