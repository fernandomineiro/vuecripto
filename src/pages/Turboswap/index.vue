<template>
  <div>
    <div class="md-layout md-alignment-top-right`">
      <div class="md-layout-item">
        <badge
          style="margin-right: 5px; margin-top: 10px; height: 20px;"
          v-for="currency in currencies"
          :key="currency.id"
          :type="isTypeOf(currency)"
        >
          <span
            @click="addToFilter(currency)"
            class="span-badge"
            :class="{ 'cursor-badge': !isOnFilter(currency) }"
            >{{ currency.name }}</span
          >
          <eva-icon
            :class="{ 'cursor-badge': isOnFilter(currency) }"
            style="margin-top: -4px; margin-right: -10px;"
            v-show="isOnFilter(currency)"
            @click="removeOfFilter(currency)"
            name="close"
            animation="shake"
            fill="black"
            height="16px"
          ></eva-icon>
        </badge>
      </div>
    </div>
    <div class="md-layout">
      <template v-if="showPairs && showPairs.length > 0">
        <div
          class="md-layout-item md-xsmall-size-100  md-small-size-50 md-medium-size-33 md-size-25"
          v-for="pair in showPairs"
          :key="pair.id"
        >
          <turbo-swap-precision :data="pair" @open="openTradeModal" />
        </div>
      </template>
      <div v-if="pairNotFound" class="md-layout md-gutter md-alignment-center">
        <div
          class="md-layout-item md-xsmall-size-100  md-small-size-50 md-medium-size-33 md-size-33"
        >
          <md-icon class="md-accent icon-center md-size-4x"
            >highlight_off</md-icon
          >
          <h3 align="center" class="title">
            {{ $t("trade.warnings.notFound") }}
          </h3>
          <p class="card-description">
            {{ $t("trade.warnings.notFoundPairs") }}
          </p>
        </div>
      </div>
    </div>
    <trade-precision-modal
      :data="tradeModal.data"
      v-if="tradeModal.show && !mobileModal"
      @close="tradeModal.show = false"
    />
    <trade-precision-mobile-modal
      :data="tradeModal.data"
      v-if="tradeModal.show && mobileModal"
      @close="tradeModal.show = false"
    />
  </div>
</template>

<script>
import TurboSwapPrecision from "@/components/Cards/TurboSwapPrecisionCard.vue";
import { Badge } from "@/components";
import TradePrecisionModal from "@/components/Modals/TradePrecisionModal";
import TradePrecisionMobileModal from "@/components/Modals/TradePrecisionMobileModal";
import { mapState, mapActions } from "vuex";
import tradeAPI from "@/api/trade.js";

export default {
  data() {
    return {
      tradeModal: {
        data: null,
        show: false
      },
      selected: false,
      mobileModal: false,
      selectedItems: [],
      walletsPollingInterval: null,
      tradePairsPollingInterval: null,
      currenciesList: [],
      badgesFilters: [],
      selectedBadge: {
        id: null
      },
      pairNotFound: false,
      showPairs: []
    };
  },
  components: {
    TurboSwapPrecision,
    TradePrecisionModal,
    TradePrecisionMobileModal,
    Badge
  },
  computed: {
    ...mapState({
      pairs: state => state.Pairs.tradePairs,
      currencies: state => state.Currencies.currencies
    })
  },
  methods: {
    ...mapActions("Pairs", ["fetchTradePairs"]),
    ...mapActions("Currencies", ["fetchCurrencies"]),
    openTradeModal(data) {
      this.tradeModal.data = data;
      this.tradeModal.show = true;
    },
    removeOfFilter() {
      this.selectedBadge = {
        id: null
      };
      this.showPairs = this.pairs;
      this.checkIsNotFound();
    },
    async fetchPairs(currency) {
      await tradeAPI
        .GetAllPairs("?filter[currency_base]=" + currency.title)
        .then(res => {
          if (res)
            res.forEach(pair => {
              this.showPairs.push(pair);
            });
        });
      this.checkIsNotFound();
      await tradeAPI
        .GetAllPairs("?filter[currency_quote]=" + currency.title)
        .then(res => {
          if (res)
            res.forEach(pair => {
              this.showPairs.push(pair);
            });
        });
      this.checkIsNotFound();
    },
    addToFilter(currency) {
      this.showPairs = [];
      this.selectedBadge = currency;
      this.fetchPairs(currency);
    },
    isOnFilter(currency) {
      if (this.selectedBadge.id === currency.id) return true;
      else return false;
    },
    isTypeOf(currency) {
      if (this.isOnFilter(currency)) return "cda-red";
      else return "cda-blue";
    },
    checkIsNotFound() {
      if (this.showPairs && this.showPairs.length > 0)
        this.pairNotFound = false;
      else this.pairNotFound = true;
    }
  },
  created() {
    if (this.$device == "mobile") {
      this.mobileModal = true;
    }
    this.walletsPollingInterval = setInterval(
      () => this.$store.dispatch("Wallets/fetchWallets"),
      15000
    );
    this.fetchTradePairs().then(() => {
      this.showPairs = this.pairs;
    });
    this.fetchCurrencies().then(() => {
      this.currenciesList = Object.keys(this.currencies).map(item => {
        let id = this.currencies[item].id;
        let title = this.currencies[item].title;
        return { id, title };
      });
    });
    this.showPairs = this.pairs;
    this.tradePairsPollingInterval = setInterval(this.fetchTradePairs, 5000);
  },
  beforeDestroy() {
    clearInterval(this.walletsPollingInterval);
    clearInterval(this.tradePairsPollingInterval);
  }
};
</script>
<style lang="scss">
.span-badge {
  vertical-align: super;
}
.cursor-badge {
  cursor: pointer;
}

.icon-center {
  display: flex;
  align-items: center;
}
</style>
