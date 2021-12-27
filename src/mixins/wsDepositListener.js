/**
 * This mixin is meant to be used in the Dashboard Layout
 */

import { mapState, mapActions } from "vuex";
import BlockIo from "@/api/BlockIo";

const minConfirmations = process.env.VUE_APP_DEPOSIT_MIN_CONFIRMATIONS || 1;
// const dev = process.env.NODE_ENV !== "production";

export default {
  data() {
    const playNotificationSound = confirmations =>
      this.$ion.sound.play(
        confirmations >= 1 ? "cash_register" : "cash_machine"
      );

    const onMessage = response => {
      // if (dev) console.log(response);

      // We are only interested in 'address' types
      if (response.type !== "address") return;

      const { balance_change, confirmations, network } = response.data;

      // Enforce types
      if (
        !(typeof balance_change == "string" && typeof confirmations == "number")
      ) {
        console.error(
          "wsDepositListener >> Types of response objects are not the expected"
        );
        return;
      }

      // Detect if change was positive
      if (balance_change <= 0) {
        // if (dev) console.log("wsDepositListener >> Balance withdraw detected");
        return;
      }

      // Last notification should be when transfer is confirmed
      if (confirmations > minConfirmations) return;

      // Hide deposit modal
      this.hideDepositModal();

      // Check if it's confirmed
      const confirmed = confirmations >= minConfirmations;

      // Notify user about wallet change
      playNotificationSound(confirmations);
      this.$notify({
        icon: "attach_money",
        message: confirmed
          ? this.$t("wallets.deposit.received", { cur: network })
          : `${this.$t("wallets.deposit.receiving", {
              cur: network
            })} (${this.$tc("wallets.deposit.nConfirmations", confirmations, {
              n: confirmations
            })})`,
        type: confirmed ? "success" : "info",
        horizontalAlign: "center",
        verticalAlign: "top",
        timeout: 10000
      });
    };

    return {
      wsBlockOpened: false,
      wsBlock: new BlockIo(
        () => (this.wsBlockOpened = true),
        onMessage,
        () => (this.wsBlockOpened = false)
      )
    };
  },
  computed: {
    ...mapState({
      wallets: state => state.Wallets.wallets,
      walletsLoaded: state =>
        !["pristine", "fetching"].includes(state.Wallets.status),

      addresses: state => state.CryptoAddr.addresses,
      addressesLoaded: state =>
        !["pristine", "fetching"].includes(state.CryptoAddr.status),

      currencies: state => state.Currencies.currencies,
      currenciesLoaded: state =>
        !["pristine", "fetching"].includes(state.Currencies.status)
    })
  },
  methods: {
    ...mapActions({
      hideDepositModal: "Modals/hideDeposit"
    }),
    initWsBlockListeners() {
      const storeInitialized =
        this.walletsLoaded &&
        this.addressesLoaded &&
        this.currenciesLoaded &&
        this.wsBlockOpened;

      // Inits only if required store data is loaded and WS is open
      if (storeInitialized) {
        // Convert currencies object to array
        const curs = Object.values(this.currencies);

        // Find IDs of currencies
        //const ltcId = curs.find(x => x.title == "LTC").id || null;
        const btcId = curs.find(x => x.title == "BTC").id || null;

        // Get wallets of currencies
        // const ltcWallet = ltcId
        //   ? this.wallets.find(x => x.currency_id == ltcId) || null
        //   : null;
        const btcWallet = btcId
          ? this.wallets.find(x => x.currency_id == btcId) || null
          : null;

        // Get addresses IDs
        //const ltcAddressId = ltcWallet ? ltcWallet.address_id || null : null;
        const btcAddressId = btcWallet ? btcWallet.address_id || null : null;

        // Get addresses objects
        // const ltcAddrObj = ltcAddressId
        //   ? this.addresses.find(x => x.id == ltcAddressId) || null
        //   : null;
        const btcAddrObj = btcAddressId
          ? this.addresses.find(x => x.id == btcAddressId) || null
          : null;

        // Get addresses
        //const ltcAddress = ltcAddrObj ? ltcAddrObj.address || null : null;
        const btcAddress = btcAddrObj ? btcAddrObj.address || null : null;

        //console.log({ curs, ltcId, btcId, ltcAddress, btcAddress }); // DEBUG

        // if (ltcAddress && !this.wsBlock.hasListenerForNetwork("LTC")) {
        //   this.wsBlock.addAddressListener("LTC", ltcAddress);
        // }

        if (btcAddress && !this.wsBlock.hasListenerForNetwork("BTC")) {
          this.wsBlock.addAddressListener("BTC", btcAddress);
        }
      }
    }
  },
  watch: {
    wsBlockOpened() {
      this.initWsBlockListeners();
    },
    walletsLoaded() {
      this.initWsBlockListeners();
    },
    wallets: {
      deep: true,
      handler() {
        this.initWsBlockListeners();
      }
    },
    addressesLoaded() {
      this.initWsBlockListeners();
    },
    currenciesLoaded() {
      this.initWsBlockListeners();
    }
  },
  created() {
    this.$store.dispatch("CryptoAddr/fetchAddresses");
  },
  beforeDestroy() {
    this.wsBlock.close();
  }
};
