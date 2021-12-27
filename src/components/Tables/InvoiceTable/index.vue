<template>
  <div class="invoice-table">
    <otc-request v-if="invoiceType == 'OTC/Request'" />
    <swap-request v-if="invoiceType == 'Swap/Request'" />
    <withdraw v-if="invoiceType.split('/')[0] == 'Withdraw'" />
  </div>
</template>

<script>
import OtcRequest from "./OtcRequest";
import SwapRequest from "./SwapRequest";
import Withdraw from "./Withdraw";

export default {
  name: "invoice-table",
  inject: ["invoiceType"],
  components: {
    OtcRequest,
    SwapRequest,
    Withdraw
  }
};
</script>
