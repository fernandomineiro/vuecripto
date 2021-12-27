<template>
  <md-steppers :md-active-step.sync="step" md-linear md-vertical>
    <md-step
      id="MWWithdraw-info"
      :md-label="$t('wallets.withdraw.receiverAddr')"
      :md-done.sync="stepsDone.info"
    >
      <form autocomplete="off" @submit.prevent="setWithdrawInfo">
        {{
          $t("wallets.withdraw.sendCurTo", { cur: withdrawData.currency.name })
        }}
        <md-field :class="{ 'md-error': errors.has('account') }">
          <label>{{ $t("wallets.withdraw.selectAccount") }}</label>
          <md-select
            v-model="requestForm.account"
            name="account"
            v-validate="'required'"
          >
            <md-option
              v-for="account in accounts"
              :key="account.id"
              :value="account.id"
            >
              {{ accountString(account) }}
            </md-option>
          </md-select>
        </md-field>
        <router-link
          :to="
            `/mobile-wizard/add-fiat-account?currency=${withdrawData.currency.id}`
          "
        >
          <md-button class="md-simple md-sm">
            {{ $t("wallets.withdraw.addAccount") }}
          </md-button>
        </router-link>
        <h4>{{ yourAvailableBalance }}</h4>
        <md-button class="md-primary" @click="fillWithBalance">
          {{ $t("wallets.withdraw.useBalance") }}
        </md-button>
        <md-field :class="{ 'md-error': errors.has('amount') }">
          <label>{{ $t("amount") }}</label>
          <lazy-input
            type="number"
            :step="amountStep"
            v-model="requestForm.amount"
            name="amount"
            v-validate="{
              required: true,
              excluded: ['0,00', '0.00', '0`00'],
              between: { min: this.minToWithdraw, max: this.maxValue }
            }"
          />
          <span class="md-suffix">
            <currency-symbol :currency="currencyTitle" />
          </span>
        </md-field>

        <!-- Form warnings -->
        <div v-if="warning.invalidAddress">
          <md-icon class="text-warning">warning</md-icon>
          {{ $t("wallets.withdraw.invalidCryptoAddr") }}
        </div>
        <div v-if="warning.amountGTBalance">
          <md-icon class="text-warning">warning</md-icon>
          {{ $t("wallets.withdraw.totalGTBalance") }}
        </div>
        <div v-if="warning.amountLTBalance">
          <div
            class="mt-4 text-danger bg-danger"
            v-if="withdrawData.currency.title === 'BRL'"
          >
            <i class="fas fa-exclamation mr-4"></i>
            <span>{{ $t("disclaimer.brlWithdraw") }}</span>
          </div>
        </div>

        <md-button type="submit" class="md-danger" :disabled="!isFormValid">
          {{ $t("next") }}
        </md-button>
      </form>
    </md-step>
    <md-step
      id="MWWithdraw-confirm"
      :md-label="$t('wallets.withdraw.review')"
      :md-done.sync="stepsDone.confirm"
    >
      <h4>{{ $t("wallets.withdraw.requesting") }}</h4>
      <h3>
        {{ requestedAmount }}
        <currency-symbol :currency="currencyTitle" />
      </h3>
      <h6>
        {{ $t("fee") }}: {{ estimatedFee }}
        <currency-symbol :currency="currencyTitle" />
      </h6>
      <h4>{{ $t("wallets.withdraw.toAccount") }}</h4>
      <div class="address">
        <h3>{{ this.selectedAccount }}</h3>
      </div>

      <sync-loader class="mt-4" color="#999999" v-if="loading" />
      <rise-loader class="mt-4" color="#4caf50" v-else-if="confirmDisabled" />
      <md-button class="md-success md-round md-block" @click="submit" v-else>
        {{ $t("confirm") }}
      </md-button>
    </md-step>
  </md-steppers>
</template>

<script>
import RiseLoader from "vue-spinner/src/RiseLoader";
import SyncLoader from "vue-spinner/src/SyncLoader";
import bankAccounts from "@/api/bankAccounts";
import LazyInput from "@/components/Inputs/LazyInput.vue";
import { mapState, mapActions } from "vuex";
import FormatCurrencyMixin from "@/mixins/currencyDecimalFormat";
import CurrencySymbolMixin from "@/mixins/currencySymbol";
import CurrencySymbol from "@/components/CurrencySymbol";

export default {
  name: "fiat-withdraw-wizard",
  mixins: [FormatCurrencyMixin, CurrencySymbolMixin],
  inject: ["withdrawData"],
  components: {
    RiseLoader,
    SyncLoader,
    LazyInput,
    CurrencySymbol
  },
  data() {
    return {
      accounts: null,
      step: "MWWithdraw-info",
      stepsDone: {
        info: false,
        confirm: false
      },
      requestForm: {
        account: null,
        amount: null
      },
      confirmDisabled: true,
      loadingAccounts: true,
      loading: false
    };
  },
  computed: {
    ...mapState({
      banks: state => state.Banks.banks
    }),
    yourAvailableBalance() {
      const symbol = this.getCurrencySymbol(this.withdrawData.currency.title);
      const balance = this.formatCurrencyValue(
        this.maxValue,
        this.withdrawData.currency.id
      );

      return this.$t("wallets.withdraw.currentAvailableBalance", {
        balance: `${balance} ${symbol}`
      });
    },
    total() {
      return (
        Number(this.requestForm.amount) +
        this.withdrawData.currency.fixed_value_to_withdraw
      );
    },
    amountStep() {
      return "0.01";
    },
    currencyTitle() {
      return this.withdrawData.currency.title;
    },

    /**
     * Max value that can be withdrawn
     */
    maxValue() {
      const max =
        Number(this.withdrawData.wallet.balance) -
        this.withdrawData.currency.fixed_value_to_withdraw;

      return max >= 0 ? max : 0;
    },
    requestedAmount() {
      return this.formatCurrencyValue(
        this.requestForm.amount,
        this.withdrawData.currency.id
      );
    },
    estimatedFee() {
      const fee =
        this.withdrawData.currency.fixed_value_to_withdraw +
        Number(this.requestForm.amount) *
          (this.withdrawData.currency.percentual_value_to_withdraw / 100);

      return this.formatCurrencyValue(fee, this.withdrawData.currency.id);
    },
    warning() {
      return {
        amountGTBalance: Number(this.requestForm.amount) > this.maxValue,
        amountLTBalance: Number(this.requestForm.amount) < this.minToWithdraw
      };
    },
    isFormValid() {
      return (
        this.requestForm.account &&
        this.requestForm.amount &&
        !Object.values(this.warning).some(x => x)
      );
    },
    selectedAccount() {
      if (!this.accounts) {
        return "Loading...";
      }

      const account =
        this.accounts.find(x => x.id == this.requestForm.account) || false;

      return account ? this.accountString(account) : "Account Error";
    },
    minToWithdraw() {
      return this.withdrawData.currency.title === "BRL" ? 50 : 0;
    }
  },
  methods: {
    ...mapActions({
      alertUser: "Alerts/alertUser",
      twoFaRequest: "TwoFactor/request"
    }),
    fillWithBalance() {
      this.requestForm.amount = this.maxValue;
    },
    setWithdrawInfo() {
      this.stepsDone.info = true;
      this.step = "MWWithdraw-confirm";
      setTimeout(() => (this.confirmDisabled = false), 3000);
    },
    submit() {
      const { id } = this.withdrawData.currency;
      const { amount, account } = this.requestForm;
      const { token } = this.$store.state.ActiveSession;

      this.loading = true;

      this.twoFaRequest({
        resource: "withdraw/withdrawFiat",
        args: [id, amount, account, token]
      })
        .then(res => this.$emit("invoice", res))
        .catch(err => {
          if (err === "cancelled") {
            return;
          }
          this.alertUser({
            title: this.$t("error"),
            message: this.$t(`api.withdraw.${err.statusString}`)
          });
        })
        .finally(() => (this.loading = false));
    },
    accountString(account) {
      const { account_branch, account_number, swift } = account.data;
      const bankName = this.banks[account.bank_id].name;

      return this.withdrawData.currency.title == "BRL"
        ? `${bankName} ${account_branch} ${account_number}`
        : `${bankName} ${swift}`;
    },
    resetConfirm() {
      this.confirmDisabled = true;
      this.stepsDone.info = false;
    }
  },
  watch: {
    requestForm: {
      handler() {
        this.resetConfirm();
      },
      deep: true
    }
  },
  created() {
    bankAccounts
      .GetByCurrency(
        this.withdrawData.currency.id
      )
      .then(res => (this.accounts = res))
      .catch(err => console.error(err))
      .finally(() => (this.loadingAccounts = false));
  }
};
</script>

<style scoped>
.address {
  overflow-wrap: break-word;
}
</style>
