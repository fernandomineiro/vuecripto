<template>
  <div class="md-layout text-center">
    <div
      class="md-layout-item md-size-33 md-medium-size-50 md-small-size-70 md-xsmall-size-100"
    >
      <login-card header-color="danger">
        <h4 slot="title" class="card-title">{{ $t("recover.cardHeader") }}</h4>
        <!-- Display only after token is provided by user -->
        <p slot="description" v-show="hasToken">{{ $t("api.user.password.tip") }}</p>
        <form
          autocomplete="off"
          name="setPass"
          v-show="hasToken"
          slot="inputs"
          @submit.prevent="setPassword"
        >
          <md-field
            class="md-form-group"
            :md-toggle-password="false"
            :class="{ 'md-error': errors.has('password') }"
          >
            <md-icon>lock_outline</md-icon>
            <label>{{ $t("recover.newPassword") }}...</label>
            <md-input
              v-model="password"
              type="password"
              v-validate="{
                required: true,
                min: 8,
                max: 25
              }"
              name="password"
              ref="password"
            ></md-input>
          </md-field>
          <md-field
            class="md-form-group"
            :md-toggle-password="false"
            :class="{ 'md-error': errors.has('passwordVerification') }"
          >
            <md-icon>lock_outline</md-icon>
            <label>{{ $t("register.repeatPassword") }}...</label>
            <md-input
              v-model="passwordVerification"
              type="password"
              v-validate="'required|confirmed:password'"
            >
            </md-input>
          </md-field>
        </form>
        <!-- Get token from user -->
        <form
          autocomplete="off"
          name="getToken"
          v-show="!hasToken"
          slot="inputs"
          @submit.prevent="verifyToken"
        >
          <p>{{ $t("recover.insertToken") }}</p>
          <md-field>
            <label>{{ $t("recover.token") }}...</label>
            <md-input v-model="token" type="text"></md-input>
          </md-field>
        </form>
        <!-- Token phase -->
        <md-button
          class="md-simple md-danger md-lg"
          @click="verifyToken"
          slot="footer"
          v-if="!hasToken"
        >
          {{ $t("recover.submitToken") }}
        </md-button>
        <!-- New password phase -->
        <!-- Show loading -->
        <sync-loader slot="footer" :loading="loading" color="#999999" />
        <!-- Or show button -->
        <md-button
          class="md-simple md-danger md-lg"
          @click="setPassword"
          slot="footer"
          v-if="hasToken && !loading"
        >
          {{ $t("recover.submitPassword") }}
        </md-button>
      </login-card>
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
import Alert from "@/components/Modals/Alert.vue";
import SyncLoader from "vue-spinner/src/SyncLoader.vue";
import user from "@/api/user";

export default {
  components: {
    LoginCard,
    Alert,
    SyncLoader
  },
  props: {
    reference: { type: String, default: "" }
  },
  data() {
    return {
      password: null,
      passwordVerification: null,
      token: null,
      hasToken: false,
      tokenExpired: false,
      loading: false,
      alert: {
        show: false,
        title: null,
        message: null
      }
    };
  },
  methods: {
    verifyToken() {
      if (this.token && this.token.trim()) {
        this.hasToken = true;
      }
    },
    async setPassword() {
      if (await this.$validator.validate()) {
        this.setLoading();
        user
          .RecoverPassword(this.token, this.password, this.passwordVerification)
          .then(() => {
            this.alertUser(
              this.$t("success"),
              this.$t("recover.success"),
              () => {
                this.$router.push("/login");
              }
            );
          })
          .catch(err => {
            const s = err.statusCode;
            this.alertUser(
              this.$t("error"),
              this.$t(`api.user.${err.statusString}`),
              // Revert to token input if error is token related
              s == 410 || s == 404
                ? () => {
                    this.hasToken = false;
                    // Clear inputs
                    this.token = this.password = this.passwordVerification = null;
                  }
                : null
            );
          })
          .finally(() => {
            this.unsetLoading();
          });
      } else {
        return this.alertUser(this.$t("error"), this.$t("verifyFormErrors"));
      }
    },
    alertUser(title, message, closeAction = null) {
      this.alert.title = title;
      this.alert.message = message;
      this.alert.show = true;
      this.alert.onClose = closeAction;
    },
    closeAlert() {
      this.alert.show = false;
      if (this.alert.onClose) {
        this.alert.onClose();
      }
    },
    setLoading() {
      this.loading = true;
    },
    unsetLoading() {
      this.loading = false;
    }
  },
  created() {
    if (this.reference == "modal") {
      this.alertUser(
        this.$t("success"),
        this.$t("recover.tokenRequestSuccess")
      );
    }
  }
};
</script>

<style lang="css" scoped>
.md-card-header>h4 {
  color: #fff;
  font-weight: 700;
  margin-top: 10px;
  margin-bottom: 10px;
}
.modal-mask {
  color: #3c4858;
}
.v-spinner {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
