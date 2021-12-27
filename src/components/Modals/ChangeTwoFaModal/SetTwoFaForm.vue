<template>
  <form v-if="method === 'pin'" @submit.prevent="onSubmit">
    {{ instructions }}
    <md-field
      :md-toggle-password="false"
      :md-counter="false"
      :class="{ 'md-error': errors.has('otp') }"
    >
      <label>{{ pinLabel }}</label>
      <md-input
        v-model="otp"
        type="password"
        name="otp"
        ref="otp"
        maxlength="4"
        v-validate="{ required: true, regex: /^\d{4}$/ }"
      />
    </md-field>

    <md-field
      :md-toggle-password="false"
      :md-counter="false"
      :class="{ 'md-error': errors.has('otp_confirmation') }"
    >
      <label>{{ $t("profile.twoFa.confirmPin") }}</label>
      <md-input
        v-model="otpConfirmation"
        type="password"
        name="otp_confirmation"
        maxlength="4"
        v-validate="'required|confirmed:otp'"
      />
    </md-field>

    <sync-loader v-if="loading" color="#999999" />
    <md-button v-else type="submit" class="md-danger md-block">
      {{ submitText }}
    </md-button>
  </form>
</template>

<script>
import { mapState, mapActions } from "vuex";
import twoFactor from "@/api/twoFactor";
import SyncLoader from "vue-spinner/src/SyncLoader";

export default {
  name: "set-two-fa-form",
  components: {
    SyncLoader
  },
  props: {
    method: {
      type: String,
      validator: value => ["pin"].includes(value),
      required: true
    }
  },
  data() {
    return {
      otp: null,
      otpConfirmation: null,
      loading: false
    };
  },
  computed: {
    ...mapState("ActiveSession", {
      currentMethod: state => state.two_factor_method,
      token: state => state.token
    }),
    instructions() {
      const instruction = this.currentMethod
        ? this.$t("profile.twoFa.insertNewNumericPin")
        : this.$t("profile.twoFa.insertNumericPin");
      const acceptedRange = this.$t("profile.twoFa.aDigits", ["4"]);

      return `${instruction} (${acceptedRange})`;
    },
    pinLabel() {
      return this.currentMethod
        ? this.$t("profile.twoFa.newPin")
        : this.$t("profile.twoFa.pin");
    },
    submitText() {
      return this.currentMethod
        ? this.$t("profile.twoFa.change")
        : this.$t("profile.twoFa.create");
    }
  },
  methods: {
    ...mapActions("TwoFactor", { twoFaRequest: "request" }),
    async onSubmit() {
      if (await this.$validator.validate()) {
        if (this.currentMethod) {
          this.updateTwoFa();
        } else {
          this.createTwoFa();
        }
      }
    },
    createTwoFa() {
      this.loading = true;
      twoFactor
        .CreatePin(this.otp, this.token)
        .then(res => {
          this.$emit("set", res.two_factor_method);
        })
        .catch(err => this.$emit("error", err))
        .finally(() => (this.loading = false));
    },
    updateTwoFa() {
      this.loading = true;
      this.$emit("update:otpModal", true);
      this.twoFaRequest({
        resource: "twoFactor/updatePin",
        args: [this.otp, this.otpConfirmation, this.token],
        onCloseModal: () => this.emitOtp(false)
      })
        .then(res => {
          this.$emit("set", res.two_factor_method);
        })
        .catch(err => {
          if (err === "cancelled") {
            return;
          }
          this.$emit("update:otpModal", false);
          this.$emit("error", err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    emitOtp(status) {
      this.$emit("update:otpModal", status);
    }
  }
};
</script>
