<template>
  <md-card>
    <md-card-header class="md-card-header-danger">
      <h4 class="card-title">{{ $t("accSettings.userRegister") }}</h4>
    </md-card-header>
    <md-card-content>
      <form autocomplete="off" @submit.prevent="register">
        <p slot="description">{{ $t("api.user.tip") }}</p>
        <md-field
          class="md-form-group"
          :class="{ 'md-error': errors.has('user') }"
          slot="inputs"
        >
          <md-icon>face</md-icon>
          <label>{{ $t("user") }}</label>
          <md-input
            v-model="user"
            type="text"
            v-validate="{ required: true, regex: /^[a-zA-Z0-9_]{5,25}$/ }"
            name="user"
            @keydown.space.prevent
          ></md-input>
        </md-field>
        <md-field
          class="md-form-group"
          :class="{ 'md-error': errors.has('email') }"
          slot="inputs"
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
          slot="inputs"
          :md-toggle-password="false"
        >
          <md-icon>lock_outline</md-icon>
          <label>{{ $t("password.password") }}...</label>
          <md-input
            v-model="password"
            type="password"
            v-validate="{
              required: true,
              regex: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,25}$/
            }"
            name="password"
            ref="password"
          ></md-input>
        </md-field>
        <md-field
          class="md-form-group"
          :class="{ 'md-error': errors.has('passwordVerification') }"
          slot="inputs"
          :md-toggle-password="false"
        >
          <md-icon>lock_outline</md-icon>
          <label>{{ $t("register.repeatPassword") }}...</label>
          <md-input
            v-model="passwordVerification"
            type="password"
            v-validate="'required|confirmed:password'"
            name="passwordVerification"
          ></md-input>
        </md-field>
        <!-- Show loading -->
        <sync-loader slot="footer" :loading="loading" color="#999999" />
        <!-- Or show button -->
        <md-button
          slot="footer"
          class="md-danger md-lg md-block"
          type="submit"
          v-if="!loading"
        >
          {{ $t("register.submit") }}
        </md-button>
      </form>
      <alert
        :showing="alert.show"
        :title="alert.title"
        :message="alert.message"
        @close="closeAlert"
      />
    </md-card-content>
  </md-card>
</template>
<script>
import Alert from "@/components/Modals/Alert.vue";
import SyncLoader from "vue-spinner/src/SyncLoader.vue";
import user from "@/api/user";
import { mapState } from "vuex";

export default {
  components: {
    Alert,
    SyncLoader
  },
  data() {
    return {
      user: null,
      email: null,
      password: null,
      passwordVerification: null,
      loading: false,
      alert: {
        show: false,
        title: null,
        message: null
      }
    };
  },
  computed: {
    ...mapState({
      username: state => state.User.username
    })
  },
  methods: {
    async register() {
      if (await this.$validator.validate()) {
        this.setLoading();
        user
          .CreateUser(
            this.user,
            this.email,
            this.password,
            this.passwordVerification,
            this.username
          )
          .then(() => {
            this.alertUser(
              this.$t("success"),
              this.$t("register.success"),
              () => {
                this.user = "";
                this.email = "";
                this.password = "";
                this.passwordVerification = "";
                this.$validator.reset();
              }
            );
          })
          .catch(err => {
            this.alertUser(
              this.$t("error"),
              this.$t(`api.user.${err.statusString}`)
            );
          })
          .finally(() => {
            this.unsetLoading();
          });
      } else {
        this.alertUser(this.$t("error"), this.$t("verifyFormErrors"));
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
  }
};
</script>

<style lang="css" scoped>
.md-card-header {
  color: #fff;
}
.md-card-header > h4 {
  font-weight: 700;
  margin-top: 10px;
  margin-bottom: 10px;
}
.v-spinner {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
