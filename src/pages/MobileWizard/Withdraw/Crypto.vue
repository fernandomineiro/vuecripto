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
        <md-field :class="{ 'md-error': errors.has('address') }">
          <label>{{ $t("crypto.address") }}</label>
          <md-input
            type="text"
            v-model="requestForm.address"
            name="address"
            v-validate="{
              required: true,
              crypto: [withdrawData.currency.title]
            }"
          />
        </md-field>
        <h4>{{ yourAvailableBalance }}</h4>
        <md-button class="md-primary" @click="fillWithBalance">
          {{ $t("wallets.withdraw.useBalance") }}
        </md-button>
        <md-field :class="{ 'md-error': errors.has('amount') }">
          <label>{{ $t("amount") }}</label>
          <md-input
            type="number"
            :step="amountStep"
            min="0"
            v-model="requestForm.amount"
            name="amount"
            v-validate="'required|decimal|min_value:0'"
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
        {{ requestForm.amount }}
        <currency-symbol :currency="currencyTitle" />
      </h3>
      <h6>
        {{ $t("fee") }}: {{ estimatedFee }}
        <currency-symbol :currency="currencyTitle" />
      </h6>
      <h4>{{ $t("wallets.withdraw.toAddress") }}</h4>
      <div class="address">
        <code>{{ requestForm.address }}</code>
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
import { mapActions } from "vuex";
import CurrencySymbolMixin from "@/mixins/currencySymbol";
import CurrencySymbol from "@/components/CurrencySymbol";

export default {
  name: "crypto-withdraw-wizard",
  mixins: [CurrencySymbolMixin],
  inject: ["withdrawData"],
  components: {
    RiseLoader,
    SyncLoader,
    CurrencySymbol
  },
  data() {
    return {
      step: "MWWithdraw-info",
      stepsDone: {
        info: false,
        confirm: false
      },
      requestForm: {
        address: null,
        amount: null
      },
      confirmDisabled: true,
      loading: false
    };
  },
  computed: {
    yourAvailableBalance() {
      const symbol = this.getCurrencySymbol(this.withdrawData.currency.title);
      return this.$t("wallets.withdraw.currentAvailableBalance", {
        balance: `${this.maxValue} ${symbol}`
      });
    },
    total() {
      return (
        Number(this.requestForm.amount) +
        this.withdrawData.currency.fixed_value_to_withdraw
      );
    },
    amountStep() {
      return "0.00000001";
    },
    currencyTitle() {
      return this.withdrawData.currency.title;
    },
    maxValue() {
      const max =
        Number(this.withdrawData.wallet.balance) -
        this.withdrawData.currency.fixed_value_to_withdraw;

      return max >= 0 ? max : 0;
    },
    estimatedFee() {
      return (
        this.withdrawData.currency.fixed_value_to_withdraw +
        Number(this.requestForm.amount) *
          (this.withdrawData.currency.percentual_value_to_withdraw / 100)
      );
    },
    warning() {
      return {
        invalidAddress: this.errors.has("address"),
        amountGTBalance: Number(this.requestForm.amount) > this.maxValue
      };
    },
    isFormValid() {
      return (
        this.requestForm.address &&
        this.requestForm.amount &&
        !Object.values(this.warning).some(x => x)
      );
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
      const { amount, address } = this.requestForm;
      const { token } = this.$store.state.ActiveSession;

      this.loading = true;
      this.twoFaRequest({
        resource: "withdraw/withdrawCrypto",
        args: [id, amount, address, token]
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
  }
};
</script>

<style scoped>
.address {
  overflow-wrap: break-word;
}
</style>
