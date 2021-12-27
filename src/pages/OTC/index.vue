<template>
  <div class="md-layout">
    <div class="md-layout-item md-small-size-100 md-size-66 mx-auto">
      <indicators />
      <pairs @select="showRequestModal" />
    </div>
    <div class="md-layout-item md-small-size-100 md-size-33 mx-auto">
      <requests />
    </div>
    <request-modal
      v-if="requestModal.show"
      :pair-info="requestModal.pair"
      @close="requestModal.show = false"
    />
  </div>
</template>

<script>
import Pairs from "./Pairs.vue";
import RequestModal from "./RequestModal.vue";
import Requests from "./Requests.vue";
import Indicators from "./Indicators.vue";

export default {
  components: {
    Pairs,
    RequestModal,
    Requests,
    Indicators
  },
  data() {
    return {
      requestModal: {
        pair: null,
        show: false,
        pusherInterval: null
      }
    };
  },
  methods: {
    showRequestModal(pair) {
      if (this.$device == "mobile") {
        this.$router.push({
          name: "MobileWizardOTC",
          query: { pair: pair.id }
        });
      } else {
        this.requestModal.pair = pair;
        this.requestModal.show = true;
      }
    }
  },
  created() {
    this.pusherInterval = setInterval(
      () => this.$store.dispatch("OTC/fetchRequests"),
      10000
    );

    if (!this.$store.state.Pairs.otcSettings.length) {
      this.$store.dispatch("Pairs/fetchOtcSettings");
    }
  },
  beforeDestroy() {
    clearInterval(this.pusherInterval);
  }
};
</script>

<style scoped>
.md-card-header {
  color: #fff;
}
.md-card-header > h4 {
  font-weight: 700;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
