<template>
  <div class="md-layout text-center">
    <div
      class="md-layout-item md-size-33 md-medium-size-50 md-small-size-70 md-xsmall-size-100"
      :key="render"
    >
      <form autocomplete="off" @submit.prevent="register">
        <login-card header-color="blue" :key="render">
          <h4 slot="title" class="card-title">
            {{ $t("register.cardHeader") }}
          </h4>
          <md-field
            v-if="!storedRef"
            class="md-form-group"
            :class="{ 'md-error': errors.has('manualReferral') }"
            slot="inputs"
            :md-toggle-password="false"
          >
            <md-icon>person_add</md-icon>
            <label>{{ $t("register.someInvitedYou") }}...</label>
            <md-input
              v-model="manualReferral"
              type="text"
              v-validate="'min:0|max:36'"
              name="manualReferral"
            ></md-input>
          </md-field>

          <!-- COUNTRY -->
          <md-field
            class="md-form-group"
            :class="{
              'md-error': errors.has('country_code'),
              'md-invalid': errors.has('country_code'),
              'elevation-password': errors.has('country_code')
            }"
            slot="inputs"
          >
            <md-icon>public</md-icon>
            <label>{{ $t("country") }}</label>
            <md-select
              v-model="country_code"
              v-validate="'required'"
              name="country_code"
              class="country-selected"
            >
              <md-option
                v-for="country in countries"
                :key="country.code"
                :value="country.code"
              >
                {{ country.name }}
              </md-option>
            </md-select>
            <p v-if="errors.has('country_code')" class="md-error helper-spacer">
              {{ $t("register.countryChoose") }}
            </p>
          </md-field>

          <!-- EMAIL -->
          <md-field
            class="md-form-group"
            :class="{
              'md-error': errors.has('email') || isEmailReturnedError,
              'md-invalid': errors.has('email') || isEmailReturnedError,
              'elevation-password': errors.has('email'),
              'elevation-email': isEmailReturnedError
            }"
            slot="inputs"
            id="email"
          >
            <md-icon>email</md-icon>
            <label>{{ $t("email") }}...</label>
            <md-input
              v-on:click="checkEmailError()"
              v-model="email"
              type="email"
              v-validate="'required|email'"
              name="email"
            ></md-input>
            <p v-if="isEmailReturnedError" class="md-error helper-spacer">
              {{ emailError }}
            </p>
            <p class="md-error helper-spacer">{{ errors.first("email") }}</p>
          </md-field>
          <md-field
            class="md-form-group"
            :class="{
              'md-error': errors.has('password'),
              'md-invalid': errors.has('password'),
              'elevation-email': errors.has('password'),
              'elevation-password': isPasswordReturnedError
            }"
            slot="inputs"
            :md-toggle-password="true"
          >
            <md-icon>lock_outline</md-icon>
            <label>{{ $t("password.password") }}...</label>
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
            <p v-if="errors.has('password')" class="md-error helper-spacer">
              {{ $t("password.passwordNotOptional") }}
            </p>
          </md-field>

          <md-field
            class="md-form-group"
            :class="{
              'md-error': errors.has('passwordVerification'),
              'md-invalid': errors.has('passwordVerification'),
              'elevation-email': errors.has('passwordVerification')
            }"
            slot="inputs"
            :md-toggle-password="true"
          >
            <md-icon>lock_outline</md-icon>
            <label>{{ $t("register.repeatPassword") }}...</label>
            <md-input
              v-model="passwordVerification"
              type="password"
              v-validate="'required|confirmed:password'"
              name="passwordVerification"
            ></md-input>
            <p
              v-if="errors.has('passwordVerification')"
              class="md-error helper-spacer"
            >
              {{ $t("password.repeatPasswordNotEqual") }}
            </p>
          </md-field>

          <span slot="inputs">
            {{ passwordStrength }}
          </span>
          <pw-strength-meter
            slot="inputs"
            :value="password"
            :strength-meter-only="true"
            :user-inputs="userInputs"
            @score="setPasswordScore"
          />

          <!-- Show loading -->
          <sync-loader slot="footer" :loading="loading" color="#999999" />
          <!-- Or show button -->
          <div class="md-form-group" slot="inputs">
            <md-checkbox class="" :class="{
              'md-error': userTermsAccept,
              'md-invalid': userTermsAccept,
              'elevation-email': userTermsAccept
            }" v-model="userTermsAccept">
              {{ $t("terms.agree") }}
              <span class="term-link" @click="openTerms">
                <a>{{ $t("terms.user") }}</a>
              </span>
            </md-checkbox>
            <p v-if="!userTermsAccept" class="errortag helper-spacer-minor">
              {{ $t("wizard.userTermsAccept") }}
            </p>
          </div>
          <md-button
            slot="footer"
            class="md-danger md-lg"
            type="submit"
            v-if="!loading"
          >
            {{ $t("register.submit") }}
          </md-button>
        </login-card>
      </form>
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
import PasswordStrengthMixin from "@/mixins/passwordStrength";
import { LoginCard } from "@/components";
import countries from "@/utils/countries";
import SyncLoader from "vue-spinner/src/SyncLoader.vue";
import user from "@/api/user";
import { mapState, mapActions } from "vuex";
import PwStrengthMeter from "vue-password-strength-meter";
import pt from "vee-validate/dist/locale/pt_BR";
import en from "vee-validate/dist/locale/en";
import Alert from "@/components/Modals/Alert.vue";

export default {
  mixins: [PasswordStrengthMixin],
  components: {
    LoginCard,
    SyncLoader,
    PwStrengthMeter,
    Alert
  },
  data() {
    return {
      render: 0,
      country_code: null,
      email: null,
      emailError: null,
      birthday: null,
      birthdayValid: null,
      password: null,
      passwordError: null,
      passwordVerification: null,
      loading: false,
      userTermsAccept: false,
      alert: {
        show: false,
        title: null,
        message: null
      },
      manualReferral: null
    };
  },
  props: {
    referral: { type: String, default: null }
  },
  computed: {
    ...mapState("Referral", {
      storedRef: state => state.refUser
    }),

    isEmailReturnedError() {
      if (this.emailError) return true;
      else return false;
    },
    isPasswordReturnedError() {
      if (this.passwordError) return true;
      else return false;
    },

    /**
     * Array of user input used in password strength measurement
     */
    userInputs() {
      const inputs = [];

      if (this.email) {
        inputs.push(this.email);
      }

      return inputs;
    },

    /**
     * Available countries
     */
    countries() {
      return countries;
    }
  },
  methods: {
    ...mapActions("Referral", ["setReferral"]),
    openTerms() {
      window.open("/document/termos_de_uso.pdf", "_blank");
      this.userTermsAccept = false;
    },
    async register() {
      if (!this.userTermsAccept) {
        await this.$validator.validate();
        return;
      }
      if (
        (await this.$validator.validate()) &&
        this.country_code &&
        !this.isUnderage
      ) {
        const referral = this.storedRef || this.manualReferral || null;
        this.setLoading();
        this.emailError = null;
        this.passwordError = null;
        user
          .CreateUser(
            this.country_code,
            this.email,
            this.password,
            this.passwordVerification,
            referral
          )
          .then(data => {
            this.$store.dispatch("ActiveSession/setSession", data);
            this.alertUser(
              this.$t("success"),
              this.$t("register.success"),
              () => {
                this.$router.push("/dashboard");
              }
            );
          })
          .catch(err => {
            if (err.statusCode === 422) {
              this.emailError = err.message.email
                ? err.message.email.toString()
                : null;
              this.passwordError = err.message.password
                ? err.message.password.toString()
                : null;
              document.getElementById("email").style.marginTop = "40px";
              this.render += 1;
            } else if (err.statusCode === 409) {
              this.render += 1;
              this.emailError = err.message.message;
            }
          })
          .finally(() => {
            this.unsetLoading();
          });
      } else {
        await this.$validator.validate();
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
    },
    checkEmailError() {
      if (this.isEmailReturnedError) {
        this.email = null;
        this.emailError = false;
      }
    }
  },
  created() {
    if (this.$i18n.locale == "pt-br") {
      this.$validator.localize("pt-br", pt);
    } else if (this.i18n.locale == "en") this.$validator.localize("en", en);
    if (!this.storedRef && this.referral) {
      this.setReferral(this.referral);
    }
  }
};
</script>

<style lang="css" scoped>
.md-card-header > h4 {
  color: #fff !important;
  font-weight: 700;
  margin-top: 10px;
  margin-bottom: 10px;
}
.v-spinner {
  margin-top: 20px;
  margin-bottom: 20px;
}
.country-selected {
  margin-left: 12px;
}

.helper-spacer {
  margin-left: 35px;
  text-align: start;
}

.helper-spacer-minor {
  margin-left: 20px;
  text-align: start;
}

.elevation-email {
  margin-bottom: 60px;
}

.elevation-password {
  margin-bottom: 30px;
}

.errortag {
  text-align: start;
  margin-top: -5px;
  font-size: 12px;
  transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-text-fill-color: #f44336 !important;
}
</style>
