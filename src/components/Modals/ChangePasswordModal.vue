<template>
  <form autocomplete="off" @submit.prevent="changePassword()">
    <modal v-if="!alert" @close="$emit('close')">
      <template slot="header">
        <h4 class="modal-title">
          {{ $t("password.changePassword") }}
        </h4>
        <md-button
          class="md-simple md-just-icon md-round modal-default-button"
          @click="$emit('close')"
        >
          <md-icon>clear</md-icon>
        </md-button>
      </template>
      <template slot="body">
        <md-field :class="{ 'md-error': errors.has('old_password') }">
          <label>{{ $t("password.typeCurrentPassword") }}</label>
          <md-input
            type="password"
            v-model="old_password"
            v-validate="'required|min:8|max:25'"
            name="password"
            ref="password"
          ></md-input>
        </md-field>

        <md-field
          :class="{ 'md-error': errors.has('password') }"
          :md-toggle-password="false"
        >
          <label>{{ $t("password.setPassword") }}</label>
          <md-input
            type="password"
            v-model="password"
            v-validate="'required|min:8|max:25'"
            name="password"
            ref="password"
          ></md-input>
        </md-field>
        <md-field
          :class="{ 'md-error': errors.has('repeat_password') }"
          :md-toggle-password="false"
        >
          <label>{{ $t("password.setRepeatPassword") }}</label>
          <md-input
            type="password"
            v-model="repeat_password"
            v-validate="'required|confirmed:password'"
            name="repeat_password"
          ></md-input>
        </md-field>
        <span slot="inputs">
          {{ passwordStrength }}
        </span>
        <pw-strength-meter
          :value="password"
          :strength-meter-only="true"
          @score="setPasswordScore"
        />
      </template>
      <sync-loader color="#999999" slot="footer" v-if="loading" />
      <md-button class="md-danger md-block" type="submit" slot="footer" v-else>
        {{ $t("password.updatePassword") }}
      </md-button>
    </modal>
  </form>
</template>

<script>
import PasswordStrengthMixin from "@/mixins/passwordStrength";
import { Modal } from "@/components";
import SyncLoader from "vue-spinner/src/SyncLoader";
import { mapState, mapActions } from "vuex";
import PwStrengthMeter from "vue-password-strength-meter";

export default {
  name: "change-password-modal",
  mixins: [PasswordStrengthMixin],
  components: {
    Modal,
    SyncLoader,
    PwStrengthMeter
  },
  data() {
    return {
      old_password: null,
      password: null,
      repeat_password: null,
      alert: false,
      loading: false
    };
  },
  computed: {
    ...mapState({
      userId: state => state.User.id,
      twoFaMethod: state => state.ActiveSession.two_factor_method
    })
  },
  methods: {
    ...mapActions({ twoFaRequest: "TwoFactor/request" }),
    async changePassword() {
      let validate = await this.$validator.validate();
      if (!validate) {
        this.$emit("close");
        return this.$store.dispatch("Alerts/alertUser", {
          message: this.$t("verifyFormErrors"),
          title: this.$t("error")
        });
      }
      if (!this.password) {
        this.$emit("close");
        return this.$store.dispatch("Alerts/alertUser", {
          message: this.$t("password.passwordRequired"),
          title: this.$t("error")
        });
      }
      if (!this.repeat_password) {
        this.$emit("close");
        return this.$store.dispatch("Alerts/alertUser", {
          message: this.$t("password.repeatPasswordRequired"),
          title: this.$t("error")
        });
      }
      if (this.password === this.repeat_password) {
        this.loading = true;
        if (this.twoFaMethod) {
          this.alert = true;
        }

        this.twoFaRequest({
          resource: "user/changePassword",
          args: [
            this.userId,
            this.old_password,
            this.password,
            this.repeat_password
          ],
          onCloseModal: () => (this.alert = false)
        })
          .then(() => {
            this.$store.dispatch("Alerts/alertUser", {
              title: this.$t("success"),
              message: this.$t("password.updateSuccess")
            });
            this.$emit("close");
          })
          .catch(err => {
            if (err === "cancelled") {
              return;
            }
            this.alert = true;
            this.$store.dispatch("Alerts/alertUser", {
              title: this.$t("error"),
              message: this.$t(`api.user.password.${err.statusString}`),
              onClose: () => (this.alert = false)
            });
          })
          .finally(() => (this.loading = false));
      } else {
        this.$emit("close");
        return this.$store.dispatch("Alerts/alertUser", {
          title: this.$t("error"),
          message: this.$t(`api.user.password.addNewBadRequest`)
        });
      }
    }
  }
};
</script>
