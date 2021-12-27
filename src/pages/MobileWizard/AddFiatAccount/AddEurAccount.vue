<template>
  <form @submit.prevent="submit">
    <md-field :class="{ 'md-error': errors.has('swift') }">
      <label>SWIFT/BIC</label>
      <md-input
        type="text"
        v-model="requestForm.swift"
        v-validate="'required'"
        name="swift"
      ></md-input>
    </md-field>

    <md-field :class="{ 'md-error': errors.has('iban') }">
      <label>IBAN</label>
      <md-input
        type="text"
        v-model="requestForm.iban"
        v-validate="'required'"
        name="iban"
        v-mask="masks.iban"
      ></md-input>
    </md-field>

    <md-field :class="{ 'md-error': errors.has('accountNo') }">
      <label>{{ $t("wallets.withdraw.accountNo") }}</label>
      <md-input
        type="text"
        v-model="requestForm.account_number"
        v-validate="'required'"
        name="accountNo"
      ></md-input>
    </md-field>

    <md-field :class="{ 'md-error': errors.has('bankName') }">
      <label>{{ $t("wallets.withdraw.bankName") }}</label>
      <md-input
        type="text"
        v-model="requestForm.bank_name"
        v-validate="'required'"
        name="bankName"
      ></md-input>
    </md-field>

    <md-field :class="{ 'md-error': errors.has('bankAddress') }">
      <label>{{ $t("wallets.withdraw.bankAddress") }}</label>
      <md-textarea
        v-model="requestForm.bank_address"
        v-validate="'required'"
        name="bankAddress"
      ></md-textarea>
    </md-field>
    <div class="text-center mt-4">
      <sync-loader color="#999999" v-if="loading" />
      <md-button
        type="submit"
        class="md-success md-round"
        :disabled="!isFormFilled"
        v-else
      >
        {{ $t("wallets.withdraw.addAccount") }}
      </md-button>
    </div>
  </form>
</template>

<script>
import SyncLoader from "vue-spinner/src/SyncLoader";
import masks from "@/utils/masks";
import bankAccounts from "@/api/bankAccounts";
import { mapActions } from "vuex";

const { iban } = masks;

export default {
  inject: ["currencyBanks", "currencyId"],
  components: {
    SyncLoader
  },
  data() {
    const masks = {};
    Object.defineProperties(masks, {
      iban: {
        get: () => iban
      }
    });

    return {
      requestForm: {
        swift: null,
        iban: null,
        account_number: null,
        bank_name: null,
        bank_address: null
      },
      masks,
      loading: false
    };
  },
  computed: {
    isFormFilled() {
      return Object.values(this.requestForm).every(x => x !== null);
    }
  },
  methods: {
    ...mapActions({
      alertUser: "Alerts/alertUser"
    }),
    submit() {
      this.loading = true;
      bankAccounts
        .AddEurAccount(
          this.currencyBanks[0].id,
          this.requestForm,
          this.$store.state.ActiveSession.token
        )
        .then(() => this.$emit("success"))
        .catch(err =>
          this.alertUser({
            title: this.$t("error"),
            message: this.$t(`api.bankAccounts.${err.statusString}`)
          })
        )
        .finally(() => (this.loading = false));
    }
  }
};
</script>
