<template>
  <div class="md-layout">
    <div class="md-layout-item md-size-100">
      <!-- Loading page data -->
      <div class="text-center mt-4" v-if="!isStoreLoaded">
        <sync-loader color="#999999" />
      </div>

      <!-- Success and invoice -->
      <div class="text-center" v-else-if="invoice">
        <i class="far fa-check-circle text-success" id="success-icon"></i>
        <h3>{{ $t("wallets.withdraw.success") }}</h3>
        <md-card>
          <md-card-content>
            <invoice-table />
          </md-card-content>
        </md-card>
        <router-link to="/wallets">
          <md-button class="md-danger md-lg md-raised">
            {{ $t("wallets.withdraw.returnToWallets") }}
          </md-button>
        </router-link>
      </div>

      <template v-else-if="currency">
        <md-card class="text-center">
          <md-card-content>
            <crypto v-if="currencyType == 'crypto'" @invoice="showInvoice" />
            <fiat v-if="currencyType == 'fiat'" @invoice="showInvoice" />
          </md-card-content>
        </md-card>

        <router-link to="/wallets">
          <md-button class="md-info md-block">
            {{ $t("wallets.withdraw.returnToWallets") }}
          </md-button>
        </router-link>
      </template>

      <!-- Currency not found error -->
      <div class="text-center" v-else>
        <i class="far fa-times-circle text-danger" id="error-icon"></i>
        <h3>{{ $t("wallets.withdraw.currencyNotFound") }}</h3>
        <md-button class="md-danger md-lg md-raised" click="$router.back">
          <md-icon>keyboard_arrow_left</md-icon>
          {{ $t("wallets.withdraw.return") }}
        </md-button>
      </div>
    </div>
  </div>
</template>

<script>
import Crypto from "./Crypto";
import Fiat from "./Fiat";
import InvoiceTable from "@/components/Tables/InvoiceTable";
import SyncLoader from "vue-spinner/src/SyncLoader";
import { mapState, mapActions } from "vuex";

export default {
  provide() {
    const withdrawData = {};

    Object.defineProperties(withdrawData, {
      currency: {
        enumerable: true,
        get: () => this.currency
      },
      currencyType: {
        enumerable: true,
        get: () => this.currencyType
      },
      wallet: {
        enumerable: true,
        get: () => this.wallet
      }
    });

    const provision = { withdrawData };

    Object.defineProperties(provision, {
      invoiceType: {
        enumerable: true,
        get: () =>
          this.currencyType == "crypto" ? "Withdraw/Crypto" : "Withdraw/Fiat"
      },
      tableContents: {
        enumerable: true,
        get: () => this.invoice
      }
    });

    return provision;
  },
  components: {
    Crypto,
    Fiat,
    SyncLoader,
    InvoiceTable
  },
  data() {
    return {
      currency_id: this.$route.query.currency,
      invoice: null
    };
  },
  computed: {
    ...mapState({
      currencies: state => state.Currencies.currencies,
      wallets: state => state.Wallets.wallets
    }),
    currency() {
      return this.currencies[this.currency_id] || false;
    },
    currencyType() {
      switch (this.currency.currency_type_id) {
        case 1:
          return "crypto";
        case 2:
          return "fiat";
        case 3:
          return "token";
        default:
          return "";
      }
    },
    wallet() {
      return this.wallets.find(x => x.currency_id == this.currency_id) || false;
    },
    isStoreLoaded() {
      return (
        typeof this.currencies == "object" &&
        Object.keys(this.currencies).length &&
        this.wallets instanceof Array &&
        this.wallets.length
      );
    }
  },
  methods: {
    ...mapActions({
      fetchWallets: "Wallets/fetchWallets"
    }),
    showInvoice(data) {
      this.invoice = data;
    }
  },
  created() {
    this.fetchWallets();
  },
  beforeRouteUpdate(to) {
    this.currency_id = to.query.currency;
  }
};
</script>
