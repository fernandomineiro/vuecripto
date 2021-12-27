<template>
  <div class="md-layout">
    <div class="md-layout-item md-size-100">
      <h4>
        <strong>{{ $t("help.ifNeedHelpAskSupport") }}</strong>
      </h4>
      <p>{{ $t("help.openingHours") }}</p>
      <p>{{ $t("help.ifNotOpenSendEmail") }}</p>
    </div>
    <tawk />
  </div>
</template>

<script>
import Tawk from "@/components/Tawk";

export default {
  components: {
    Tawk
  },
  computed: {
    isTawkOpen() {
      return Boolean(this.$tawk);
    }
  },
  beforeDestroy() {
    if (this.isTawkOpen && !this.$tawk.isVisitorEngaged()) {
      // TODO
    }
  }
};
</script>
