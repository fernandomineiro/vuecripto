<template>
  <div>
    <form autocomplete="off" @submit.prevent="withdraw" v-if="!alert">
      <!-- Withdraw page -->
      <modal v-if="!addingAccount" @close="$emit('close')">
        <template slot="header">
          <h4 class="modal-title">
            {{ $t("wallets.withdraw.withdraw") }} {{ currency.name }}
          </h4>
          <md-button
            class="md-simple md-just-icon md-round modal-default-button"
            @click="$emit('close')"
          >
            <md-icon>clear</md-icon>
          </md-button>
        </template>

        <!-- Crypto withdraw -->
        <template v-if="isCrypto(currency.currency_type_id)" slot="body">
          <md-field
            :class="{ 'md-error': errors.has('amount') || !hasEnoughBalance }"
          >
            <label>{{ $t("amount") }}</label>
            <md-input
              type="number"
              step="0.00000001"
              min="0"
              v-model="amount"
              @keyup="calcTotal"
              v-validate="'required|excluded:0'"
              name="amount"
            ></md-input>
            <span class="md-suffix">{{ currency.title }}</span>
          </md-field>
          <md-field :class="{ 'md-error': errors.has('address') }">
            <label>{{ $t("crypto.address") }}</label>
            <md-input
              type="text"
              v-model="address"
              v-validate="{ required: true, crypto: [currency.title] }"
              name="address"
            ></md-input>
          </md-field>
          <md-field>
            <label>{{ $t("crypto.fee") }}</label>
            <md-input
              type="number"
              v-model="fee"
              disabled
              :value="currency.fixed_value_to_withdraw"
              name="fee"
            ></md-input>
          </md-field>
          <md-field :class="{ 'md-error': !hasEnoughBalance }">
            <label>{{ $t("crypto.total") }}</label>
            <md-input type="number" v-model="total" disabled name="fee">
            </md-input>
          </md-field>
          <div v-if="!hasEnoughBalance">
            <md-icon class="text-warning">warning</md-icon>
            {{ $t("wallets.withdraw.totalGTBalance") }}
          </div>
          <div v-if="errors.has('address')">
            <md-icon class="text-warning">warning</md-icon>
            {{ $t("wallets.withdraw.invalidCryptoAddr") }}
          </div>
        </template>

        <!-- FIAT withdraw -->
        <template v-else-if="!loading" slot="body">
          <md-icon class="md-size-4x" md-src="/icon/withdraw.svg"></md-icon>
          <!-- Disclaimer -->
          <div
            class="mt-4 text-danger bg-danger"
            v-if="currency.title === 'BRL'"
          >
            <i class="fas fa-exclamation mr-4"></i>
            <span>{{ $t("disclaimer.brlWithdraw") }}</span>
          </div>
          <md-field :class="{ 'md-error': errors.has('amount') }">
            <label>{{ $t("amount") }}</label>
            <md-input
              type="number"
              v-model.lazy="amount"
              step="0.01"
              v-validate="{
                required: true,
                between: { min: this.minToWithdraw, max: this.balance }
              }"
              name="amount"
            ></md-input>
            <span class="md-suffix">
              <currency-symbol :currency="currency.title" />
            </span>
          </md-field>
          <md-field
            v-if="accounts && accounts.length"
            :class="{ 'md-error': errors.has('bank_account_id') }"
          >
            <label>{{ $t("wallets.withdraw.selectAccount") }}</label>
            <md-select v-model="bank_account_id" v-validate="'required'">
              <md-option
                v-for="account in accounts"
                :key="account.id"
                :value="account.id"
              >
                {{ fmtAccountName(account) }}
              </md-option>
            </md-select>
          </md-field>

          <em v-else>{{ $t("wallets.withdraw.noAccounts") }}</em>
          <div>
            <md-button
              class="md-simple md-danger"
              @click="addingAccount = true"
            >
              {{ $t("wallets.withdraw.addAccount") }}
            </md-button>
          </div>
        </template>
        <sync-loader color="#999999" slot="footer" v-if="loading"></sync-loader>
        <md-button
          type="submit"
          class="md-danger md-block"
          slot="footer"
          v-else
        >
          {{ $t("wallets.withdraw.withdraw") }}
        </md-button>
      </modal>

      <!-- Add Account page -->
      <modal @close="addingAccount = false" v-else>
        <template slot="header">
          <h4 class="modal-title">
            {{
              $t("wallets.withdraw.addCurrencyAccount", { cur: currency.name })
            }}
          </h4>
          <md-button
            class="md-simple md-just-icon md-round modal-default-button"
            @click="addingAccount = false"
          >
            <md-icon>navigate_before</md-icon>
          </md-button>
        </template>

        <!-- Create Real account -->
        <template slot="body" v-if="currency.title === 'BRL'">
          <md-field>
            <label>
              {{ $t("wallets.withdraw.bank") }}
            </label>
            <md-select v-model="bank_id">
              <md-option
                v-for="bank in bankList"
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
              v-model="account_branch"
              v-validate="'required'"
              name="branch"
              v-mask="['####-#']"
            ></md-input>
          </md-field>
          <md-field :class="{ 'md-error': errors.has('account_number') }">
            <label>{{ $t("wallets.withdraw.accountNo") }}</label>
            <md-input
              type="text"
              v-model="account_number"
              v-validate="'required'"
              name="account_number"
              v-mask="[
                '###-#',
                '####-#',
                '#####-#',
                '######-#',
                '#######-#',
                '########-#',
                '#########-#',
                '##########-#',
                '###########-#'
              ]"
            ></md-input>
          </md-field>
          <md-radio v-model="account_type" value="1">
            {{ $t("wallets.withdraw.checkingAccount") }}
          </md-radio>
          <md-radio v-model="account_type" value="2">
            {{ $t("wallets.withdraw.savingsAccount") }}
          </md-radio>
        </template>
        <sync-loader color="#999999" slot="footer" v-if="loading"></sync-loader>
        <md-button
          type="submit"
          class="md-danger md-block"
          slot="footer"
          v-else
        >
          {{ $t("wallets.withdraw.addAccount") }}
        </md-button>
      </modal>
    </form>
  </div>
</template>

<script>
import { Modal } from "@/components";
import SyncLoader from "vue-spinner/src/SyncLoader.vue";
import bankAccounts from "@/api/bankAccounts";
import { mapState, mapActions } from "vuex";
import CurrencySymbol from "@/components/CurrencySymbol";

const isCrypto = type_id => type_id != 2;

export default {
  name: "withdraw-modal",
  components: {
    Modal,
    SyncLoader,
    CurrencySymbol
  },
  data() {
    return {
      amount: null,
      address: null,
      total: null,
      bank_account_id: "placeholder",
      loading: false,
      accounts: [],
      // Add account data
      addingAccount: false,
      bank_id: null,
      account_branch: null,
      account_number: null,
      account_type: null,
      swift: null,
      wire_number: null,
      iban: null,
      bank_name: null,
      bank_address: null,
      data: null,
      alert: false,
      money: {
        decimal: ",",
        thousands: "."
      }
    };
  },
  props: {
    currencyId: { type: Number, default: 5 }
  },
  computed: {
    ...mapState({
      currencies: state => state.Currencies.currencies,
      banks: state => state.Banks.banks,
      wallets: state => state.Wallets.wallets,
      twoFaMethod: state => state.ActiveSession.two_factor_method
    }),
    currency() {
      return this.currencies[this.currencyId];
    },
    fee() {
      return this.currencies[this.currencyId].fixed_value_to_withdraw;
    },
    bankList() {
      return Object.values(this.banks);
    },
    balance() {
      return Number(
        this.wallets.find(x => x.currency_id == this.currencyId).balance
      );
    },
    hasEnoughBalance() {
      return this.total <= this.balance;
    },
    minToWithdraw() {
      return this.currency.title === "BRL" ? 50 : 0;
    }
  },
  methods: {
    ...mapActions({ twoFaRequest: "TwoFactor/request" }),
    calcTotal() {
      let precision;
      switch (this.currencies[this.currencyId].currency_type_id) {
        case 1:
          precision = 8;
          break;
        case 2:
          precision = 2;
          break;
        case 3:
          precision = 8;
          break;
        default:
          precision = 2;
          break;
      }

      if (this.amount && this.fee) {
        this.total = Number(Number(this.amount) + this.fee).toFixed(precision);
      }
    },
    isCrypto,
    fetchAccounts() {
      this.loading = true;
      bankAccounts
        .GetByCurrency(this.currency.id)
        .then(res => (this.accounts = res))
        .catch(err => console.error(err))
        .finally(() => (this.loading = false));
    },
    fmtAccountName(account) {
      const details = account.data;
      if (!details.bank_name) {
        return (
          this.banks[account.bank_id].name +
          " " +
          (details.account_branch
            ? `${details.account_branch} ${details.account_number}`
            : details.swift)
        );
      } else {
        return `${details.bank_name} - ${details.account_number}`;
      }
    },
    async withdraw() {
      if (this.addingAccount) {
        // When adding account
        if (await this.$validator.validate()) {
          this.loading = true;
          // BRL account
          if (this.currency.title === "BRL") {
            bankAccounts
              .AddAccount(
                this.bank_id,
                this.account_branch,
                this.account_number,
                this.account_type
              )
              .then(() => {
                this.addingAccount = false;
                this.fetchAccounts();
              })
              .catch(err => {
                this.alert = true;
                this.$store.dispatch("Alerts/alertUser", {
                  title: this.$t("error"),
                  message: this.$t(`api.bankAccounts.${err.statusString}`),
                  onClose: () => (this.alert = false)
                });
              })
              .finally(() => (this.loading = false));
          }
        }
      } else {
        // When withdrawing
        if (await this.$validator.validate()) {
          this.loading = true;
          if (isCrypto(this.currency.currency_type_id)) {
            if (!this.hasEnoughBalance) {
              this.alert = true;
              this.$store.dispatch("Alerts/alertUser", {
                title: this.$t("error"),
                message: this.$t("wallets.withdraw.totalGTBalance"),
                onClose: () => (this.alert = false)
              });

              this.loading = false;

              return;
            }

            if (this.twoFaMethod) {
              this.alert = true;
            }
            this.twoFaRequest({
              resource: "withdraw/withdrawCrypto",
              args: [
                this.currency.id,
                this.amount,
                this.address,
                this.$store.state.ActiveSession.token
              ],
              onCloseModal: () => (this.alert = false)
            })
              .then(() => {
                this.$store.dispatch("Wallets/fetchWallets");
                this.$store.dispatch("Alerts/alertUser", {
                  title: this.$t("success"),
                  message: this.$t("wallets.withdraw.success")
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
                  message: this.$t(`api.withdraw.${err.statusString}`),
                  onClose: () => (this.alert = false)
                });
              })
              .finally(() => (this.loading = false));
          } else {
            if (this.twoFaMethod) {
              this.alert = true;
            }

            this.twoFaRequest({
              resource: "withdraw/withdrawFiat",
              args: [
                this.currencyId,
                this.amount,
                this.bank_account_id,
                this.$store.state.ActiveSession.token
              ],
              onCloseModal: () => (this.alert = false)
            })
              .then(() => {
                this.$store.dispatch("Wallets/fetchWallets");
                this.$store.dispatch("Alerts/alertUser", {
                  title: this.$t("success"),
                  message: this.$t("wallets.withdraw.success")
                });
                this.$emit("close");
              })
              .catch(err => {
                this.alert = true;
                this.$store.dispatch("Alerts/alertUser", {
                  title: this.$t("error"),
                  message: this.$t(`api.withdraw.${err.statusString}`),
                  onClose: () => (this.alert = false)
                });
              })
              .finally(() => (this.loading = false));
          }
        }
      }
    }
  },
  mounted() {
    // Fetch bank accounts
    if (!isCrypto(this.currency.currency_type_id)) {
      this.fetchAccounts();
    }
  }
};
</script>

<style scoped>
.modal-title,
.modal-message {
  color: #3c4858;
}
.accounts-list {
  list-style: none;
  text-align: left;
}
.account-select {
  width: 100%;
}
.account-select option[default] {
  display: none;
}
</style>
<style>
.md-menu-content.md-select-menu {
  z-index: 9999 !important;
}
</style>
