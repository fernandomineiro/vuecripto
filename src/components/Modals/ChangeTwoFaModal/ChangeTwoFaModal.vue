<template>
  <modal v-show="!(alert || otpModal)">
    <template slot="header">
      <h4 class="modal-title">
        {{ modalHeader }}
      </h4>
      <md-button
        class="md-simple md-just-icon md-round modal-default-button"
        @click="$emit('close')"
      >
        <md-icon>clear</md-icon>
      </md-button>
    </template>
    <template slot="body">
      <method-select-form v-if="!selectedMethod" @select="onSelectMethod" />
      <set-two-fa-form
        v-else
        :method="selectedMethod"
        :otp-modal.sync="otpModal"
        @set="onUpdateTwoFa"
        @error="onError"
      />
    </template>
  </modal>
</template>

<script>
import { Modal } from "@/components";
import { mapState, mapActions } from "vuex";
import MethodSelectForm from "./MethodSelectForm";
import SetTwoFaForm from "./SetTwoFaForm";
import methods from "@/utils/twoFaMethodNames";

export default {
  name: "change-two-fa-modal",
  components: {
    Modal,
    MethodSelectForm,
    SetTwoFaForm
  },
  data() {
    return {
      selectedMethod: null,
      alert: false,
      otpModal: false
    };
  },
  computed: {
    ...mapState("ActiveSession", { method: state => state.two_factor_method }),
    modalHeader() {
      return this.selectedMethod
        ? this.method === this.selectedMethod
          ? this.$t("profile.twoFa.changeMethod", [
              methods[this.selectedMethod]
            ])
          : this.$t("profile.twoFa.createMethod", [
              methods[this.selectedMethod]
            ])
        : this.method
        ? this.$t("profile.twoFa.changeTwoFa")
        : this.$t("profile.twoFa.createTwoFa");
    }
  },
  methods: {
    ...mapActions({
      setTwoFaMethod: "ActiveSession/setTwoFaMethod",
      alertUser: "Alerts/alertUser"
    }),
    onSelectMethod(method) {
      this.selectedMethod = method;
    },
    onUpdateTwoFa(method) {
      this.setTwoFaMethod(method);
      this.alertUser({
        title: this.$t("success"),
        message: this.$t(`profile.twoFa.twoFaWasChanged`)
      });
      this.$emit("close");
    },
    onError(error) {
      this.alert = true;
      this.alertUser({
        title: this.$t("error"),
        message: this.$t(`api.twoFactor.${error.statusString}`),
        onClose: () => (this.alert = false)
      });
    }
  }
};
</script>
