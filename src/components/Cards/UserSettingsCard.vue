<template>
  <div>
    <md-card>
      <md-card-header class="md-card-header-danger">
        <h4>{{ $t("api.user.settings") }}</h4>
      </md-card-header>
      <md-card-content>
        <!-- Password -->
        <md-button
          class="md-button md-info md-block"
          @click="showChangePassword()"
        >
          {{ $t("password.changePassword") }}
        </md-button>

        <!-- 2FA -->
        <md-button
          v-if="!twoFactorMethod"
          class="md-button md-info md-block"
          @click="showChangeTwoFa"
        >
          {{ $t("profile.twoFa.enableTwoFa") }}
        </md-button>
        <template v-else>
          <md-button
            class="md-button md-info md-block"
            @click="showChangeTwoFa"
          >
            {{ $t("profile.twoFa.changeTwoFa") }}
          </md-button>
          <md-button class="md-button md-info md-block" @click="disableTwoFa">
            {{ $t("profile.twoFa.disableTwoFa") }}
          </md-button>
        </template>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "user-settings-card",
  data() {
    return {
      changePasswordModal: {
        show: false,
        alert: false
      }
    };
  },
  computed: {
    ...mapState({
      userId: state => state.User.id,
      twoFactorMethod: state => state.ActiveSession.two_factor_method,
      token: state => state.ActiveSession.token
    })
  },
  methods: {
    ...mapActions({
      showChangePassword: "Modals/launchChangePassword",
      showChangeTwoFa: "Modals/launchChangeTwoFa",
      setTwoFaMethod: "ActiveSession/setTwoFaMethod",
      requestTwoFa: "TwoFactor/request",
      alertUser: "Alerts/alertUser"
    }),
    disableTwoFa() {
      this.requestTwoFa({
        resource: "twoFactor/removePin",
        args: [this.token]
      })
        .then(() => {
          this.setTwoFaMethod(null);
          this.alertUser({
            title: this.$t("success"),
            message: this.$t("profile.twoFa.twoFaWasDisabled")
          });
        })
        .catch(err => {
          if (err === "cancelled") {
            return;
          }

          this.alertUser({
            title: this.$t("error"),
            message: this.$t(`api.twoFactor.${err.statusString}`)
          });
        });
    }
  }
};
</script>

<style scoped>
.md-card-header > h4 {
  font-weight: 700;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
