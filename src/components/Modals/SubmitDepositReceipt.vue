<template>
  <form @submit.prevent="submit" autocomplete="off">
    <modal v-if="!alert">
      <template slot="header">
        <h4 class="modal-title">
          {{ $t("wallets.deposit.submitReceipt") }}
        </h4>
        <md-button
          class="md-simple md-just-icon md-round modal-default-button"
          @click="$emit('close')"
        >
          <md-icon>clear</md-icon>
        </md-button>
      </template>

      <template slot="body">
        <p>{{ $t("wallets.deposit.requestSuccessSubmitReceipt") }}</p>
        <md-field :class="{ 'md-error': errors.has('file') }">
          <input
            type="file"
            accept="image/*,.pdf"
            :placeholder="$t('allowedImageFiles')"
            name="file"
            v-validate="'required|ext:jpg,jpeg,png,pdf|size:5120'"
            @change="handleFile"
          />
        </md-field>
        <div v-if="file && errors.has('file')">
          <md-icon class="text-warning">warning</md-icon>
          {{ $t("wallets.deposit.invalidFileType") }}
        </div>
      </template>
      <sync-loader color="#999999" slot="footer" v-if="loading" />
      <md-button type="submit" class="md-danger" slot="footer" v-else>
        {{ $t("submit") }}
      </md-button>
    </modal>
  </form>
</template>

<script>
import { Modal } from "@/components";
import ValidFile from "@/components/Inputs/ValidFile.vue";
import deposit from "@/api/deposit";
import SyncLoader from "vue-spinner/src/SyncLoader";

export default {
  name: "submit-deposit-receipt-modal",
  components: {
    Modal,
    ValidFile,
    SyncLoader
  },
  data() {
    return {
      file: null,
      alert: false,
      loading: false
    };
  },
  props: {
    depositId: { type: Number, default: 0 }
  },
  methods: {
    handleFile(ev) {
      this.file = ev.target.files[0];
    },
    submit() {
      if (this.file) {
        this.loading = true;
        deposit
          .UploadReceipt(
            this.depositId,
            this.file
          )
          .then(() => {
            this.$store.dispatch("Alerts/alertUser", {
              title: this.$t("success"),
              message: this.$t("wallets.deposit.submitReceiptSuccess")
            });
            this.$emit("close");
          })
          .catch(err => {
            this.alert = true;
            this.$store.dispatch("Alerts/alertUser", {
              title: this.$t("error"),
              message: this.$t(`api.deposit.${err.statusString}`),
              onClose: () => (this.alert = false)
            });
          })
          .finally(() => (this.loading = false));
      }
    }
  }
};
</script>
