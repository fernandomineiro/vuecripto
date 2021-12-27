<template>
  <div>
    <md-table class="details-table" slot="body">
      <md-table-row v-if="invoice.tx_hash">
        <md-table-cell class="details-property">
          {{ $t("invoices.txHash") }}
        </md-table-cell>
        <md-table-cell class="tx-hash">
          <small>{{ invoice.tx_hash }}</small>
        </md-table-cell>
      </md-table-row>
      <md-table-row>
        <md-table-cell class="details-property">
          {{ $t("invoices.invoice") }}
        </md-table-cell>
        <md-table-cell>{{ invoice.invoice }}</md-table-cell>
      </md-table-row>
      <md-table-row>
        <md-table-cell class="details-property">
          {{ $t("invoices.invoiceType") }}
        </md-table-cell>
        <md-table-cell>
          {{ $t(getInvoiceTypeLabel(invoice.invoice_type_id)) }}
        </md-table-cell>
      </md-table-row>
      <md-table-row>
        <md-table-cell class="details-property">
          {{ $t("status") }}
        </md-table-cell>
        <md-table-cell>
          <badge v-if="statusTypes[invoice.status_id]" :type="badgeClass">
            {{ $t(getInvoiceStatusLabel(invoice.status_id)) }}
          </badge>
        </md-table-cell>
      </md-table-row>
      <md-table-row>
        <md-table-cell class="details-property">
          {{ $t("invoices.date") }}
        </md-table-cell>
        <md-table-cell>{{ date }}</md-table-cell>
      </md-table-row>
      <md-table-row>
        <md-table-cell class="details-property">
          {{ $t("amount") }}
        </md-table-cell>
        <md-table-cell>
          <currency-symbol :currency="baseCurrency.title" />
          {{
            formatCurrencyValue(
              this.invoice.amount,
              this.invoice.currency_base_id
            )
          }}

        </md-table-cell>
      </md-table-row>
      <md-table-row v-if="invoice.obs">
        <md-table-cell class="details-property">
          {{ $t("invoices.address", { cur: baseCurrency.title }) }}
        </md-table-cell>
        <md-table-cell>{{ invoice.obs }}</md-table-cell>
      </md-table-row>
      <md-table-row v-if="!isCrypto">
        <md-table-cell class="details-property">
          {{ $t("invoices.depositMethod") }}
        </md-table-cell>
        <md-table-cell>{{ methodName }}</md-table-cell>
      </md-table-row>

      <md-table-row v-if="!isCrypto">
        <md-table-cell class="details-property">
          {{ $t("wallets.withdraw.branch") }}
        </md-table-cell>
        <md-table-cell>{{ accountBranch }}</md-table-cell>
      </md-table-row>

      <md-table-row v-if="!isCrypto">
        <md-table-cell class="details-property">
          {{ $t("wallets.withdraw.accountNo") }}
        </md-table-cell>
        <md-table-cell>{{ accountNumber }}</md-table-cell>
      </md-table-row>

      <md-table-row v-if="!isCrypto">
        <md-table-cell class="details-property">
          {{ $t("wallets.withdraw.accountType") }}
        </md-table-cell>
        <md-table-cell>{{ accountType }}</md-table-cell>
      </md-table-row>

      <md-table-row v-if="!isCrypto">
        <md-table-cell class="details-property">
          {{ $t("wallets.withdraw.accountHolder") }}
        </md-table-cell>
        <md-table-cell>{{ accountHolder }}</md-table-cell>
      </md-table-row>

      <md-table-row v-if="!isCrypto">
        <md-table-cell class="details-property">
          {{ $t("wallets.withdraw.accountCnpj") }}
        </md-table-cell>
        <md-table-cell>{{ accountDocument }}</md-table-cell>
      </md-table-row>

      <md-table-row v-if="invoice.text">
        <md-table-cell class="details-property">
          {{ $t("invoices.text") }}
        </md-table-cell>
        <md-table-cell>{{ invoice.text }}</md-table-cell>
      </md-table-row>
      <md-table-row v-if="invoice.txid">
        <md-table-cell class="details-property">TXID</md-table-cell>
        <md-table-cell>{{ invoice.txid }}</md-table-cell>
      </md-table-row>
    </md-table>
    <qrcode class="qrcode" :value="invoice.obs" v-if="showQrcode" />
  </div>
</template>

<script>
import { Badge } from "@/components";
import VueQrcode from "@chenfengyuan/vue-qrcode";
import { statusBadgeClass, getLocaleDateString } from "@/utils";
import moment from "moment";
import { mapState } from "vuex";
import currencyDecimalFormat from "@/mixins/currencyDecimalFormat";
import formatLabels from "@/mixins/formatLabels";
import CurrencySymbol from "@/components/CurrencySymbol";

export default {
  name: "deposit-invoice",
  components: {
    Badge,
    qrcode: VueQrcode,
    CurrencySymbol
  },
  mixins: [currencyDecimalFormat, formatLabels],
  props: {
    invoice: {
      type: Object
    }
  },
  computed: {
    ...mapState({
      currencies: state => state.Currencies.currencies,
      invoiceTypes: state => state.Types.invoice,
      statusTypes: state => state.Status.statuses,
      methods: state => state.DepositMethods.methods,
      banks: state => state.Banks.banks
    }),
    badgeClass() {
      return statusBadgeClass(this.invoice.status_id);
    },
    baseCurrency() {
      return this.currencies[this.invoice.currency_base_id];
    },
    isCrypto() {
      return this.baseCurrency.currency_type_id != 2;
    },
    showQrcode() {
      return this.invoice.status_id == 1 && this.isCrypto;
    },
    methodName() {
      const bank = this.methods[this.invoice.method_id].bank;
      return `${bank.code} - ${bank.name}`;
    },
    accountBranch() {
      return this.methods[this.invoice.method_id].account.account_branch;
    },
    accountNumber() {
      return this.methods[this.invoice.method_id].account.account_number;
    },
    accountDocument() {
      return "25.300.337/0001-45";
    },
    accountType() {
      return this.methods[this.invoice.method_id].account.account_type == 'checking'
        ? this.$t("wallets.withdraw.checkingAccount")
        : this.$t("wallets.withdraw.savingsAccount");
    },
    accountHolder() {
      return "Capital Digital Aberto LTDA";
    },
    date() {
      return moment(this.invoice.date).format(
        getLocaleDateString() + " HH:mm:ss"
      );
    }
  }
};
</script>
