<template>
  <modal @close="$emit('close')">
    <template slot="header">
      <h4 class="modal-title">{{ $t("loginWithQrCode") }}</h4>
      <md-button
        class="md-simple md-just-icon md-round modal-default-button"
        @click="$emit('close')"
      >
        <md-icon>clear</md-icon>
      </md-button>
    </template>
    <div class="text-center" slot="body">
      <qrcode :value="tokenBase64" />
      <h5>{{ $t("qrCodeLoginDisclaimer") }}</h5>
    </div>
    <template class="md-block" slot="footer">
      <md-button class="md-block" @click="$emit('close')">
        {{ $t("cancel") }}
      </md-button>
    </template>
  </modal>
</template>

<script>
import { Modal } from "@/components";
import VueQrcode from "@chenfengyuan/vue-qrcode";
import { mapState } from "vuex";

export default {
  name: "qr-code-login-modal",
  components: {
    Modal,
    qrcode: VueQrcode
  },
  computed: {
    ...mapState({
      token: state => state.ActiveSession.token
    }),
    tokenBase64() {
      return window.btoa(this.token);
    }
  }
};
</script>
