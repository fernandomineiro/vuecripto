<template>
  <modal @close="$emit('close')">
    <template slot="header">
      <h4 class="modal-title">{{ $t("invoices.invoiceDetails") }}</h4>
      <md-button
        class="md-simple md-just-icon md-round modal-default-button"
        @click="$emit('close')"
      >
        <md-icon>clear</md-icon>
      </md-button>
    </template>
    <template slot="body" v-if="invoice.id">
      <deposit-invoice :invoice="invoice" v-if="isDepositType" />
      <withdraw-invoice :invoice="invoice" v-if="isWithdrawType" />
      <gain-invoice :invoice="invoice" v-if="isGainType" />
      <upgrade-invoice :invoice="invoice" v-if="isUpgradeType" />
      <transfer-invoice :invoice="invoice" v-if="isTransferType" />
      <trade-invoice :invoice="invoice" v-if="isBuyType || isSellType" />
    </template>
    <sync-loader slot="body" color="#999999" v-else />
    <div class="w-100" slot="footer">
      <md-button
        class="md-info md-block mb-4"
        v-if="canSubmitReceipt"
        @click="$emit('receipt', invoiceId)"
      >
        {{ $t("invoices.annexReceipt") }}
      </md-button>
      <md-button class="md-default md-block" @click="$emit('close')">
        {{ $t("close") }}
      </md-button>
    </div>
  </modal>
</template>

<script>
import { Modal } from "@/components";
import SyncLoader from "vue-spinner/src/SyncLoader.vue";
import DepositInvoice from "./DepositInvoice";
import WithdrawInvoice from "./WithdrawInvoice";
import GainInvoice from "./GainInvoice";
import UpgradeInvoice from "./UpgradeInvoice";
import TransferInvoice from "./TransferInvoice";
import TradeInvoice from "./TradeInvoice";
import invoice from "@/api/invoice";
import { mapState } from "vuex";

export default {
  name: "details-modal",
  components: {
    Modal,
    SyncLoader,
    DepositInvoice,
    WithdrawInvoice,
    GainInvoice,
    UpgradeInvoice,
    TransferInvoice,
    TradeInvoice
  },
  data() {
    return {
      invoice: {},
      statusTypes: {}
    };
  },
  props: {
    invoiceId: { type: Number, default: 0 }
  },
  computed: {
    // Invoice selectors
    isDepositType() {
      return this.invoice.metadata.invoice_type_id == 1;
    },
    isWithdrawType() {
      return this.invoice.metadata.invoice_type_id == 2;
    },
    isConversionType() {
      return this.invoice.metadata.invoice_type_id == 3;
    },
    isGainType() {
      return this.invoice.metadata.invoice_type_id == 4;
    },
    isUpgradeType() {
      return this.invoice.metadata.invoice_type_id == 5;
    },
    isTransferType() {
      return this.invoice.metadata.invoice_type_id == 6;
    },
    isBuyType() {
      return this.invoice.metadata.invoice_type_id == 7;
    },
    isSellType() {
      return this.invoice.metadata.invoice_type_id == 8;
    },
  canSubmitReceipt() {
      return (
        this.isDepositType &&
        this.invoice.metadata.status_id == 1 &&
        this.currencies[this.invoice.currency_base.id].currency_type_id == 2
      );
    },
    ...mapState({ currencies: state => state.Currencies.currencies })
  },
  mounted() {
    invoice
      .GetById(this.invoiceId, this.$store.state.ActiveSession.token)
      .then(res => (this.invoice = res))
      .catch(err => console.error(err));
    invoice
      .GetStatusTypes()
      .then(res => {
        for (const st of res) {
          this.statusTypes[st.id] = st;
        }
      })
      .catch(err => console.error(err));
  }
};
</script>
<style>
.details-table {
  text-align: left;
  max-height: 75vh;
}
.details-table .md-table-cell {
  padding-top: 4px;
  padding-bottom: 4px;
  height: 26px;
}
.details-property {
  font-weight: bold;
  text-align: right;
}
.tx-hash {
  overflow-wrap: anywhere;
}
small {
  font-size: 60%;
}

/* Avoid horizontal overflow in small screens */
@media (max-width: 530px) {
  .modal-container {
    max-width: calc(100vw - 30px);
  }
}
</style>
