<template>
  <form @submit.prevent="submit">
    <md-field>
      <label>{{ $t("wallets.withdraw.bank") }}</label>
      <md-select v-model="requestForm.bank">
        <md-option
          v-for="bank in currencyBanks"
          :key="bank.id"
          :value="bank.id"
        >
          {{ bank.code }} - {{ bank.name }}
        </md-option>
      </md-select>
    </md-field>
    <md-field :class="{ 'md-error': errors.has('branch') }">
      <label>{{ $t("wallets.withdraw.branch") }}</label>
      <md-input
        type="text"
        v-model="requestForm.branch"
        v-validate="'required'"
        name="branch"
        v-mask="masks.brlAccountBranch"
      />
    </md-field>
    <md-field :class="{ 'md-error': errors.has('accountNo') }">
      <label>{{ $t("wallets.withdraw.accountNo") }}</label>
      <md-input
        type="text"
        v-model="requestForm.accountNo"
        v-validate="'required'"
        name="accountNo"
        v-mask="masks.brlAccount"
      />
    </md-field>
    <md-field>
      <label>{{ $t("wallets.withdraw.accountType") }}</label>
      <md-select v-model="requestForm.type">
        <md-option value="1">
          {{ $t("wallets.withdraw.checkingAccount") }}
        </md-option>
        <md-option value="2">
          {{ $t("wallets.withdraw.savingsAccount") }}
        </md-option>
      </md-select>
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

const { brlAccount, brlAccountBranch } = masks;

export default {
  inject: ["currencyBanks", "currencyId"],
  components: {
    SyncLoader
  },
  data() {
    const masks = {};
    Object.defineProperties(masks, {
      brlAccount: {
        get: () => brlAccount
      },
      brlAccountBranch: {
        get: () => brlAccountBranch
      }
    });

    return {
      currency: this.$route.query.currency,
      requestForm: {
        bank: null,
        branch: null,
        accountNo: null,
        type: null
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
      const { bank, branch, accountNo, type } = this.requestForm;

      this.loading = true;
      bankAccounts
        .AddAccount(
          bank,
          branch,
          accountNo,
          type
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
