<template>
  <div class="md-content">
    <WalletTable
      :data="wallets"
      @deposit="depositModalShow"
      @transfer="transferModalShow"
      @withdraw="withdrawModalShow"
    />

    <!-- Modals -->
    <withdraw-modal
      v-if="withdrawModal.show"
      :currency-id="withdrawModal.currency_id"
      @close="withdrawModal.show = false"
    ></withdraw-modal>
    <transfer-modal
      v-if="transferModal.show"
      :currency-id="transferModal.currency_id"
      :wallet-id="transferModal.wallet_id"
      @close="transferModal.show = false"
    ></transfer-modal>
    <deposit-modal
      v-if="depositModal.show"
      :currency-id="depositModal.currency_id"
      @close="depositModalHide"
      @receipt="submitReceiptModalShow"
    ></deposit-modal>
    <submit-deposit-receipt-modal
      :deposit-id="submitReceiptModal.id"
      @close="submitReceiptModal.show = false"
      v-if="submitReceiptModal.show"
    />
  </div>
</template>

<script>
import WalletTable from "./WalletTable";
import WithdrawModal from "./WithdrawModal.vue";
import TransferModal from "./TransferModal.vue";
import DepositModal from "./DepositModal.vue";
import SubmitDepositReceiptModal from "@/components/Modals/SubmitDepositReceipt.vue";
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  components: {
    WalletTable,
    WithdrawModal,
    TransferModal,
    DepositModal,
    SubmitDepositReceiptModal
  },
  data() {
    return {
      withdrawModal: {
        show: false,
        currency_id: 0
      },
      transferModal: {
        show: false,
        currency_id: 0
      },
      addWalletModalShow: false,
      submitReceiptModal: {
        id: null,
        show: false
      }
    };
  },
  computed: {
    ...mapState({
      loadingWallets: state => state.Wallets.loading,
      wallets: state => state.Wallets.wallets,
      depositModal: state => state.Modals.deposit
    }),
    ...mapGetters({
      noWallets: "Wallets/isEmpty",
      isInitialized: "Wallets/isInitialized"
    })
  },
  methods: {
    ...mapActions({
      fetchWallets: "Wallets/fetchWallets",
      depositModalShow: "Modals/launchDeposit",
      depositModalHide: "Modals/hideDeposit"
    }),
    transferModalShow({ currency_id, wallet_id }) {
      this.transferModal.currency_id = currency_id;
      this.transferModal.wallet_id = wallet_id;
      this.transferModal.show = true;
    },
    withdrawModalShow(currency_id) {
      if (this.$device == "desktop") {
        this.withdrawModal.currency_id = currency_id;
        this.withdrawModal.show = true;
      } else {
        this.$router.push(`/mobile-wizard/withdraw?currency=${currency_id}`);
      }
    },
    submitReceiptModalShow(id) {
      this.submitReceiptModal.id = id;
      this.submitReceiptModal.show = true;
    }
  },
  created() {
    if (this.$store.getters["ActiveSession/isAuthenticated"]) {
      this.fetchWallets().catch(err => console.error(err));
    }
  }
};
</script>
