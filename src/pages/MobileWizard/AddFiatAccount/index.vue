<template>
  <div class="md-layout">
    <div class="md-layout-item md-size-100">
      <div class="text-center mt-4" v-if="!isStoreLoaded">
        <sync-loader color="#999999" />
      </div>
      <!-- Success screen -->
      <div class="text-center" v-else-if="success">
        <i class="far fa-check-circle text-success" id="success-icon"></i>
        <h3>{{ $t("wallets.withdraw.addAccountSuccess") }}</h3>
        <router-link :to="`/mobile-wizard/withdraw?currency=${currency_id}`">
          <md-button class="md-danger md-lg md-raised">
            {{ $t("wallets.withdraw.returnToWithdraw") }}
          </md-button>
        </router-link>
      </div>

      <!-- Form screen -->
      <md-card v-else>
        <md-card-content>
          <add-brl-account
            v-if="currencyTitle == 'BRL'"
            @success="showSuccess"
          />
          <add-eur-account
            v-if="currencyTitle == 'EUR'"
            @success="showSuccess"
          />
          <add-usd-account
            v-if="currencyTitle == 'USD'"
            @success="showSuccess"
          />
        </md-card-content>
      </md-card>

      <router-link :to="`/mobile-wizard/withdraw?currency=${currency_id}`">
        <md-button class="md-info md-block">
          {{ $t("wallets.withdraw.returnToWithdraw") }}
        </md-button>
      </router-link>
    </div>
  </div>
</template>

<script>
import SyncLoader from "vue-spinner/src/SyncLoader";
import AddBrlAccount from "./AddBrlAccount";
import AddEurAccount from "./AddEurAccount";
import AddUsdAccount from "./AddUsdAccount";
import { mapState } from "vuex";

export default {
  components: {
    SyncLoader,
    AddBrlAccount,
    AddEurAccount,
    AddUsdAccount
  },
  provide() {
    const provision = {};

    // Make reactive
    Object.defineProperties(provision, {
      currencyBanks: {
        enumerable: true,
        get: () => this.currencyBanks
      },
      currencyId: {
        value: this.currency_id
      }
    });

    return provision;
  },
  data() {
    return {
      currency_id: this.$route.query.currency,
      success: false
    };
  },
  computed: {
    ...mapState({
      banks: state => state.Banks.banks,
      currencies: state => state.Currencies.currencies
    }),
    currencyBanks() {
      return Object.values(this.banks).filter(
        x => x.currency_id == this.currency_id
      );
    },
    currencyTitle() {
      return (this.currencies[this.currency_id] || { title: "Not found" })
        .title;
    },
    isStoreLoaded() {
      return (
        Object.keys(this.banks).length && Object.keys(this.currencies).length
      );
    }
  },
  methods: {
    showSuccess() {
      this.success = true;
    }
  },
  beforeRouteUpdate(to) {
    this.currency_id = to.query.currency;
  }
};
</script>
