<template>
  <div>
    <md-table class="details-table" slot="body">
      <md-table-row v-if="invoice.metadata.tx_hash">
        <md-table-cell class="details-property">
          {{ $t("invoices.txHash") }}
        </md-table-cell>
        <md-table-cell class="tx-hash">
          <small>{{ invoice.metadata.tx_hash }}</small>
        </md-table-cell>
      </md-table-row>
      <md-table-row>
        <md-table-cell class="details-property">
          {{ $t("invoices.invoice") }}
        </md-table-cell>
        <md-table-cell>{{ invoice.metadata.invoice }}</md-table-cell>
      </md-table-row>
      <md-table-row>
        <md-table-cell class="details-property">
          {{ $t("invoices.invoiceType") }}
        </md-table-cell>
        <md-table-cell>
          {{ $t(getInvoiceTypeLabel(invoice.metadata.invoice_type_id)) }}
        </md-table-cell>
      </md-table-row>
      <md-table-row>
        <md-table-cell class="details-property">
          {{ $t("status") }}
        </md-table-cell>
        <md-table-cell>
          <badge v-if="statusTypes[invoice.metadata.status_id]" :type="badgeClass">
            {{ $t(getInvoiceStatusLabel(invoice.metadata.status_id)) }}
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
              this.invoice.metadata.amount,
              this.invoice.metadata.currency_base_id
            )
          }}
        </md-table-cell>
      </md-table-row>
      <md-table-row v-if="invoice.metadata.obs">
        <md-table-cell class="details-property">
          {{ $t("invoices.address", { cur: baseCurrency.title }) }}
        </md-table-cell>
        <md-table-cell>{{ invoice.metadata.obs }}</md-table-cell>
      </md-table-row>
      <md-table-row v-if="invoice.metadata.text">
        <md-table-cell class="details-property">
          {{ $t("invoices.text") }}
        </md-table-cell>
        <md-table-cell>{{ invoice.text }}</md-table-cell>
      </md-table-row>
      <md-table-row v-if="invoice.metadata.txid">
        <md-table-cell class="details-property">TXID</md-table-cell>
        <md-table-cell>{{ invoice.metadata.txid }}</md-table-cell>
      </md-table-row>
    </md-table>
    <qrcode class="qrcode" :value="invoice.metadata.obs" v-if="showQrcode" />
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
  name: "withdraw-invoice",
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
  data() {
    return {
      accounts: []
    };
  },
  computed: {
    ...mapState({
      currencies: state => state.Currencies.currencies,
      invoiceTypes: state => state.Types.invoice,
      statusTypes: state => state.Status.statuses,
      banks: state => state.Banks.banks
    }),
    bankList() {
      return Object.values(this.banks).sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    },
    badgeClass() {
      return statusBadgeClass(this.invoice.metadata.status_id);
    },
    baseCurrency() {
      return this.currencies[this.invoice.metadata.currency_base_id];
    },
    isCrypto() {
      return this.baseCurrency.currency_type_id != 2;
    },
    showQrcode() {
      return this.invoice.metadata.status_id == 1 && this.isCrypto;
    },
    methodName() {
      const bank = this.bankList.find(x => x.id === this.invoice.metadata.method_id);
      return `${bank.code} - ${bank.name}`;
    },
    accountBranch() {
      return JSON.parse(
        this.accounts.find(x => x.id === this.invoice.metadata.method_id).data
      ).account_branch;
    },
    accountNumber() {
      return JSON.parse(this.accounts[this.invoice.metadata.method_id].data)
        .account_number;
    },
    accountDocument() {
      return "25.300.337/0001-45";
    },
    accountType() {
      return JSON.parse(this.accounts[this.invoice.metadata.method_id].data)
        .account_type == 1
        ? this.$t("wallets.withdraw.checkingAccount")
        : this.$t("wallets.withdraw.savingAccounts");
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
