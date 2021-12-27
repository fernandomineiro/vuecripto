<template>
  <form autocomplete="off" @submit.prevent="depositFiat">
    <modal v-show="!alert">
      <template slot="header">
        <h4 class="modal-title">
          {{ $t("wallets.deposit.deposit") }} {{ currency.name }}
        </h4>
        <md-button
          class="md-simple md-just-icon md-round modal-default-button"
          @click="$emit('close')"
        >
          <md-icon>clear</md-icon>
        </md-button>
      </template>

      <!-- FIAT deposit -->
      <template slot="body" v-if="currency.currency_type_id == 2">
        <md-icon
          v-if="$device != 'mobile'"
          class="md-size-4x"
          md-src="/icon/deposit.svg"
        ></md-icon>
        <!-- Disclaimer -->
        <div class="mt-4 text-danger bg-danger" v-if="displayDisclaimer">
          <i class="fas fa-exclamation mr-4"></i>
          <span v-t="{ path: displayDisclaimer }"></span>
        </div>
        <md-field :class="{ 'md-error': errors.has('amount') }">
          <label>{{ $t("amount") }}</label>
          <md-input
            type="number"
            min="0"
            step="0.01"
            v-model="amount"
            v-validate="{ decimal: 2, required: true, min_value: 0 }"
            name="amount"
          ></md-input>
          <span class="md-suffix">
            <currency-symbol :currency="currency.title" />
          </span>
        </md-field>
        <ul class="methods-list" v-if="methods">
          <li v-for="met in methods" :key="met.id">
            <md-radio
              v-model="method_id"
              :value="met.id"
              v-validate="'required'"
              name="method"
            >
              {{ methodName(met) }}
            </md-radio>
          </li>
        </ul>
        <template v-if="selectedMethod && account && currency.title === 'BRL'">
          {{ banks[selectedMethod.bank.id].code }} -
          {{ banks[selectedMethod.bank.id].name }}
          <br />
          {{ $t("wallets.deposit.branch") }}:
          {{ selectedMethod.account.account_branch }}
          <br />
          {{ $t("wallets.deposit.number") }}:
          {{ selectedMethod.account.account_number }}
          <br />
          {{ selectedMethod.responsible.full_name }}
          <br />
          CNPJ: {{ selectedMethod.responsible.cpf_cnpj }}
        </template>
        <template v-if="selectedMethod && account">
          <template v-if="currency.title === 'EUR'">
            Bank Code (SWIFT / BIC): {{ account.swift }}
            <br />
            IBAN: {{ account.iban }}
            <br />
            TW Account Holder: {{ account.account_holder }}
            <br />
            <template v-if="account.message">
              Message: {{ account.message }}
              <br />
            </template>
            <template v-if="account.reference">
              Reference: {{ account.reference }}
              <br />
            </template>
            Bank Address: {{ account.bank_address }}
          </template>
          <template
            v-if="currency.title === 'USD' && account.account_type === 2"
          >
            Bank Code (SWIFT / BIC): {{ account.swift }}
            <br />
            IBAN: {{ account.iban }}
            <br />
            TW Account Holder: {{ account.account_holder }}
            <br />
            <template v-if="account.message">
              Message: {{ account.message }}
              <br />
            </template>
            <template v-if="account.reference">
              Reference: {{ account.reference }}
              <br />
            </template>
            Address: {{ account.bank_address }}
          </template>
          <template
            v-if="currency.title === 'USD' && account.account_type === 1"
          >
            Bank Name: {{ account.bank_name }}
            <br />
            Routing Number (RTN or ACH): {{ account.account_branch }}
            <br />
            Account Number: {{ account.account_number }}
            <br />
            Account Holder: {{ account.account_holder }}
            <br />
            <template v-if="account.message">
              Message: {{ account.message }}
              <br />
            </template>
            <template v-if="account.reference">
              Reference: {{ account.reference }}
              <br />
            </template>
            <template v-if="account.bank_address">
              Bank Address: {{ account.bank_address }}
            </template>
          </template>
        </template>
      </template>

      <!-- Crypto deposit -->
      <template slot="body" v-else>
        <span class="description">
          {{ $t("wallets.deposit.transferToAddress") }}
        </span>
        <template v-if="address">
          <div>
            <qrcode :value="address"></qrcode>
          </div>
          <div class="address-container">
            <input
              id="addressInput"
              type="text"
              :value="address"
              ref="address"
              @click="$refs.address.select()"
              readonly
            />
            <md-button
              @click="doCopy"
              class="md-icon-button md-dense md-raised square"
              :title="$t('copyToClipboard')"
            >
              <md-icon>file_copy</md-icon>
            </md-button>
          </div>
        </template>
        <div v-else>
          <sync-loader color="#999999"></sync-loader>
        </div>
      </template>
      <md-button
        type="submit"
        class="md-danger md-block"
        slot="footer"
        v-if="methods && !loading"
      >
        {{ $t("wallets.deposit.deposit") }}
      </md-button>
      <sync-loader slot="footer" color="#999999" v-if="loading"></sync-loader>
    </modal>
  </form>
</template>

<script>
import { Modal } from "@/components";
import { mapState, mapActions } from "vuex";
import SyncLoader from "vue-spinner/src/SyncLoader.vue";
import method from "@/api/method";
import VueQrcode from "@chenfengyuan/vue-qrcode";
import CurrencySymbol from "@/components/CurrencySymbol";
import DepositMethods from "../../store/modules/DepositMethods";

const isCrypto = type_id => type_id != 2;

export default {
  name: "deposit-modal",
  components: {
    Modal,
    qrcode: VueQrcode,
    SyncLoader,
    CurrencySymbol
  },
  data() {
    return {
      address: null,
      invoice: null,
      amount: null,
      methods: null,
      method_id: null,
      loading: false,
      alert: false
    };
  },
  props: {
    currencyId: { type: Number, default: 5 }
  },
  computed: {
    ...mapState({
      currencies: state => state.Currencies.currencies,
      banks: state => state.Banks.banks,
      twoFaMethod: state => state.ActiveSession.two_factor_method
    }),
    currency() {
      return this.currencies[this.currencyId];
    },
    selectedMethod() {
      if (!this.method_id) {
        return null;
      }

      return this.methods.find(met => met.id == this.method_id);
    },
    account() {
      return this.selectedMethod;
    },

    /**
     * @description Determines if deposit delay disclaimer should be displayed and the current disclaimer
     * @returns {String|null}
     */
    displayDisclaimer() {
      const ct = this.currency.title;
      let disclaimerText = null;
      if (ct === "USD" || ct === "EUR") {
        disclaimerText = "disclaimer.eurUsdDisclaimer";
      } else if (ct === "BRL") {
        disclaimerText = "disclaimer.brlDeposit";
      }
      return disclaimerText;
    }
  },
  methods: {
    ...mapActions({ twoFaRequest: "TwoFactor/request" }),
    async depositFiat() {
      if (await this.$validator.validate()) {
        this.loading = true;
        if (this.twoFaMethod) {
          this.alert = true;
        }

        this.twoFaRequest({
          resource: "deposit/depositFiat",
          args: [
            this.currencyId,
            this.amount,
            this.method_id,
            this.$store.state.ActiveSession.token
          ],
          onCloseModal: () => (this.alert = false)
        })
          .then(res => {
            this.$store.dispatch("Alerts/alertUser", {
              title: this.$t("success"),
              message: this.$t("wallets.deposit.success")
            });
            this.$emit("receipt", res.id);
            this.$emit("close");
          })
          .catch(err => {
            if (err === "cancelled") {
              return;
            }

            this.alert = true;
            this.$store.dispatch("Alerts/alertUser", {
              title: this.$t("error"),
              message: this.$t(`api.deposit.${err.statusString}`),
              onClose: () => {
                this.alert = false;
                if (err.statusCode === 403) {
                  this.$emit("close");
                }
              }
            });
          })
          .finally(() => (this.loading = false));
      }
    },
    methodName(met) {
      return met.bank.name ? met.bank.name : this.banks[met.bank.id].name;
    },
    doCopy() {
      this.$copyText(this.address).then(() => {
        this.$notify({
          message: this.$t("copied"),
          icon: "file_copy",
          horizontalAlign: "center",
          verticalAlign: "top",
          type: "info"
        });
      });
    }
  },
  mounted() {
    if (isCrypto(this.currency.currency_type_id)) {
      if (this.twoFaMethod) {
        this.alert = true;
      }
      this.twoFaRequest({
        resource: "deposit/depositCrypto",
        args: [this.currencyId, this.$store.state.ActiveSession.token],
        onCloseModal: () => (this.alert = false)
      })
        .then(res => {
          this.address = res.obs;
          this.$store.dispatch("Wallets/fetchWallets");
        })
        .catch(err => {
          if (err === "cancelled") {
            this.$emit("close");
            return;
          }

          this.alert = true;
          this.$store.dispatch("Alerts/alertUser", {
            title: this.$t("error"),
            message: this.$t(`api.deposit.${err.statusString}`),
            onClose: () => {
              this.alert = false;
              this.$emit("close");
            }
          });
        });
    } else {
      method
        .GetAll()
        .then(res => {
          this.methods = res;
        })
        .catch(err => console.error(err));
    }
  }
};
</script>

<style scoped>
#addressInput {
  width: 100%;
  text-align: center;
  border: none;
  background: none;
}
.methods-list {
  list-style-type: none;
  text-align: left;
}
.address-container {
  display: flex;
  flex-flow: row nowrap;
}
.address-container:first-child {
  flex-grow: 1;
}
.address-container:last-child {
  flex-grow: 0;
}
.md-button.square {
  width: 36px !important;
  height: 36px;
  vertical-align: middle;
}
</style>
