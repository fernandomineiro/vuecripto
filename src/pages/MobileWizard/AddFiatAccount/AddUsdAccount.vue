<template>
  <form @submit.prevent="submit">
    <md-field>
      <label for="account_type">{{ $t("wallets.withdraw.accountType") }}</label>
      <md-select
        v-model="requestForm.account_type"
        name="account_type"
        id="account_type"
      >
        <md-option :value="1">{{
          $t("wallets.withdraw.usdDomestic")
        }}</md-option>
        <md-option :value="2">{{
          $t("wallets.withdraw.usdWireTransfer")
        }}</md-option>
      </md-select>
    </md-field>

    <md-field :class="{ 'md-error': errors.has('bank_name') }">
      <label>{{ $t("wallets.withdraw.bankName") }}</label>
      <md-input
        type="text"
        v-model="requestForm.bank_name"
        v-validate="'required'"
        name="bank_name"
      ></md-input>
    </md-field>

    <md-field :class="{ 'md-error': errors.has('account_branch') }">
      <label>{{ $t("wallets.withdraw.wireNo") }}</label>
      <md-input
        type="text"
        v-model="requestForm.wire_number"
        v-validate="'required'"
        name="wire_number"
      ></md-input>
    </md-field>

    <md-field :class="{ 'md-error': errors.has('account_number') }">
      <label>{{ $t("wallets.withdraw.accountNo") }}</label>
      <md-input
        type="text"
        v-model="requestForm.account_number"
        v-validate="'required'"
        name="account_number"
      ></md-input>
    </md-field>

    <md-field
      :class="{ 'md-error': errors.has('swift') }"
      v-if="isWireTransfer"
    >
      <label>{{ $t("wallets.withdraw.bankCode") }} (SWIFT/BIC)</label>
      <md-input
        type="text"
        v-model="requestForm.swift"
        v-validate="'required'"
        name="swift"
      ></md-input>
    </md-field>

    <md-field :class="{ 'md-error': errors.has('bank_address') }">
      <label>{{ $t("wallets.withdraw.bankAddress") }}</label>
      <md-textarea
        v-model="requestForm.bank_address"
        v-validate="'required'"
        name="bank_name"
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
        account_type: 1,
        bank_name: null,
        wire_number: null,
        account_number: null,
        swift: null,
        bank_address: null
      },
      masks,
      loading: false
    };
  },
  computed: {
    clearedData() {
      let data = {};

      if (!this.isWireTransfer) {
        for (const field of Object.keys(this.requestForm)) {
          if (field != "swift") {
            data[field] = this.requestForm[field];
          }
        }
      } else {
        data = this.requestForm;
      }

      return data;
    },
    isFormFilled() {
      return Object.values(this.clearedData).every(x => x !== null);
    },
    isWireTransfer() {
      return this.requestForm.account_type == 2;
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
          this.clearedData,
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
