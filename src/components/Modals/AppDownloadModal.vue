<template>
  <div>
    <md-dialog :md-active.sync="active" :md-fullscreen="false">
      <md-dialog-title>{{ $t("downloadModal.title") }}</md-dialog-title>
      <md-dialog-content>
        <p>{{ $t("downloadModal.content") }}</p>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md" @click="onCancel">
          {{ $t("dismiss") }}
        </md-button>
        <md-button class="md md-danger md-block" @click="onConfirm">
          {{ $t("downloadModal.now") }}</md-button
        >
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "AppDownloadModal",
  props: {
    active: { type: Boolean, default: false }
  },
  computed: {
    ...mapState("Referral", {
      storedRef: state => state.refUser
    })
  },
  methods: {
    onConfirm() {
      const ref = this.storedRef || "";
      window.open(this.getAppURI(ref), "_blank");
    },
    onCancel() {
      this.$emit("update:active", false);
      this.$emit("cancel", false);
    },
    getAppURI(referral) {
      const os = this.$os;
      const stores = {
        "Android OS": `intent://mycdaapp/auth/signup/name/${referral}#Intent;scheme=mycdaapp;package=br.com.wedev.cda;end`,
        iOS: `mycdaapp://auth/signup/name/${referral}`
      };
      return stores[os];
    }
  }
};
</script>

<style scoped></style>
