<template>
  <div class="md-layout text-center">
    <div
      class="md-layout-item md-size-33 md-medium-size-50 md-small-size-70 md-xsmall-size-100"
    >
      <form autocomplete="off" @submit.prevent="authenticate">
        <login-card header-color="blue" class="transparency-white">
          <h4 slot="title" class="card-title">{{ $t("login.cardHeader") }}</h4>
          <template slot="inputs">
            <md-field
              class="md-form-group"
              :class="{ 'md-error': errors.has('email') }"
            >
              <md-icon>email</md-icon>
              <label>{{ $t("email") }}...</label>
              <md-input
                v-model="email"
                type="email"
                v-validate="'required|email'"
                name="email"
              ></md-input>
            </md-field>
            <md-field
              class="md-form-group"
              :class="{ 'md-error': errors.has('password') }"
            >
              <md-icon>lock_outline</md-icon>
              <label>{{ $t("password.password") }}...</label>
              <md-input
                v-model="password"
                type="password"
                v-validate="'required|min:8'"
                name="password"
              ></md-input>
            </md-field>
            <md-button class="md-simple" @click="forgotPasswordModalShow">
              {{ $t("forgotMyPassword") }}
            </md-button>
          </template>
          <!-- Show loading -->
          <sync-loader slot="footer" :loading="loading" color="#999999" />
          <!-- Or show button -->
          <md-button
            class="md-danger md-lg"
            type="submit"
            slot="footer"
            v-if="!loading"
          >
            {{ $t("login.submit") }}
          </md-button>
        </login-card>
      </form>
      <forgot-password
        ref="forgotPasswordModal"
        @error="alertForgotPasswordModalError"
      />
      <alert
        :showing="alert.show"
        :title="alert.title"
        :message="alert.message"
        @close="closeAlert"
      />
    </div>
  </div>
</template>
<script>
import { LoginCard } from "@/components";
import SyncLoader from "vue-spinner/src/SyncLoader.vue";
import ForgotPassword from "@/components/Modals/ForgotPassword.vue";
import Alert from "@/components/Modals/Alert.vue";

export default {
  components: {
    LoginCard,
    ForgotPassword,
    SyncLoader,
    Alert
  },
  props: {
    reference: String
  },
  data() {
    return {
      email: null,
      password: null,
      loading: false,
      alert: {
        show: false,
        title: null,
        message: null
      },
      closeTimeout: null
    };
  },
  methods: {
    async authenticate() {
      if (await this.$validator.validate()) {
        this.setLoading();

        this.$store
          .dispatch("ActiveSession/authenticate", {
            email: this.email,
            password: this.password
          })
          .then(() => {
            this.$router.push("/dashboard");
          })
          .catch(err => {
            const status = err.statusCode;

            this.alertUser(
              this.$t("error"),
              this.$t(
                `api.user.${err.statusString}`,
                status == 403 ? { reason: err.message } : null
              )
            );
          })
          .finally(() => {
            this.unsetLoading();
          });
      } else {
        this.alertUser(this.$t("error"), this.$t("verifyFormErrors"));
      }
    },
    redirectIfLogged() {
      if (this.isAuthenticated) {
        this.alertUser(this.$t("alert"), this.$t("login.alreadyLogged"), () => {
          this.$router.push("/dashboard");
        });
      }
    },
    forgotPasswordModalShow() {
      this.$refs.forgotPasswordModal.show();
    },
    setLoading() {
      this.loading = true;
    },
    unsetLoading() {
      this.loading = false;
    },
    alertUser(title, message, closeAction = null) {
      this.alert.title = title;
      this.alert.message = message;
      this.alert.show = true;
      this.alert.onClose = closeAction;
    },
    closeAlert() {
      clearTimeout(this.closeTimeout);
      this.alert.show = false;
      if (this.alert.onClose) {
        this.alert.onClose();
      }
    },
    alertForgotPasswordModalError(error) {
      // Close the modal
      this.$refs.forgotPasswordModal.hide();
      // Show alert
      this.alertUser(
        this.$t("error"),
        this.$t(`api.user.${error.statusString}`),
        () => {
          this.$refs.forgotPasswordModal.show();
        }
      );
    }
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters["ActiveSession/isAuthenticated"];
    },
    getApiError() {
      return this.$store.getters["ActiveSession/getError"];
    }
  },
  created() {
    this.redirectIfLogged();
    switch (this.reference) {
      case "unauthorized":
        this.alertUser(this.$t("alert"), this.$t("login.unauthorized"));
        break;
      case "sessionExpired":
        this.alertUser(this.$t("alert"), this.$t("login.sessionExpired"));
        break;
      default:
        break;
    }
  }
};
</script>

<style lang="css" scoped>
.md-card-header>h4 {
  font-weight: 700;
  margin-top: 10px;
  margin-bottom: 10px;
}
.md-card-header-primary:not(.md-card-header-icon):not(.md-card-header-text){
  background: #fff !important;
}
.v-spinner {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
