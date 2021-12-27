<template>
  <form autocomplete="off" @submit.prevent="submit">
    <md-card>
      <md-card-header
        class="md-card-header-icon"
        :class="getClass(headerColor)"
      >
        <div class="card-icon">
          <md-icon>perm_identity</md-icon>
        </div>
        <h4 class="title">{{ $t("profile.myData") }}</h4>
      </md-card-header>

      <md-card-content v-if="loadingProfile" class="text-center">
        <sync-loader color="#999999" />
      </md-card-content>
      <md-card-content v-else>
        <div class="text-center">
          <Avatar
            :user="user"
            :size="120"
            :editable="true"
            class="mobile-user-avatar"
          />
        </div>
        <brazilian-profile-form
          v-if="country === 'BR'"
          v-model="profileForm"
          :editing="editing"
          :username="username"
          :email="email"
          :valid.sync="isFormValid"
          ref="form"
        />
        <international-profile-form
          v-else-if="country"
          v-model="profileForm"
          :editing="editing"
          :username="username"
          :email="email"
          :valid.sync="isFormValid"
          ref="form"
        />
        <div class="md-layout">
          <div class="md-layout-item md-size-100 text-left">
            <sync-loader color="#999999" v-if="loading" />
            <div class="md-layout" v-else-if="editing || isProfileEmpty">
              <div class="md-layout-item md-xsmall-size-100 md-size-50">
                <md-button
                  class="md-raised md-danger mt-4 md-block"
                  type="submit"
                >
                  {{ $t("profile.updateProfile") }}
                </md-button>
              </div>
              <div class="md-layout-item md-xsmall-size-100 md-size-50">
                <md-button
                  class="md-raised mt-4 md-block"
                  @click="editing = false"
                  v-if="!isProfileEmpty"
                >
                  {{ $t("cancel") }}
                </md-button>
              </div>
            </div>
            <md-button
              class="md-raised md-danger mt-4 md-block"
              @click="editing = true"
              v-else
            >
              {{ $t("profile.editData") }}
            </md-button>
          </div>
        </div>
      </md-card-content>
    </md-card>
  </form>
</template>

<script>
import profile from "@/api/profile";
import { mapState, mapActions, mapGetters } from "vuex";
import SyncLoader from "vue-spinner/src/SyncLoader";
import types from "@/utils/types";
import BrazilianProfileForm from "./BrazilianProfileForm";
import InternationalProfileForm from "./InternationalProfileForm";
import isUnderage from "@/utils/isUnderage";
import Avatar from "@/components/Avatar";
import { strip as stripCpf, format as formatCpf } from "@fnando/cpf";
import { strip as stripCnpj, format as formatCnpj } from "@fnando/cnpj";

const { PROFILE_COMMERCIAL, PROFILE_PERSONAL } = types;

export default {
  name: "edit-profile-form",
  components: {
    Avatar,
    SyncLoader,
    BrazilianProfileForm,
    InternationalProfileForm
  },
  props: {
    headerColor: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      profileForm: null,
      editing: false,
      loading: false,
      isFormValid: null,
      PROFILE_COMMERCIAL,
      PROFILE_PERSONAL
    };
  },
  computed: {
    ...mapState({
      profile: state => state.Profiles.profile,
      loadingProfile: state => state.Profiles.loading,
      profileCount: state => state.Profiles.count,
      username: state => state.User.username,
      email: state => state.User.email,
      country: state => state.ActiveSession.country_code,
      user: state => state.User
    }),
    ...mapGetters({ isProfileEmpty: "Profiles/isEmpty" })
  },
  methods: {
    ...mapActions({ fetchProfiles: "Profiles/fetchProfiles" }),
    getClass: function(headerColor) {
      return "md-card-header-" + headerColor + "";
    },
    async submit() {
      if (isUnderage(this.profileForm.date_of_birth)) {
        this.$store.dispatch("Alerts/alertUser", {
          title: this.$t("error"),
          message: this.$t("profile.mustNotBeUnderage")
        });

        return;
      }

      await this.$refs.form.$validator.validate();
      if (!this.isFormValid) {
        this.$store.dispatch("Alerts/alertUser", {
          title: this.$t("error"),
          message: this.$t("verifyFormErrors")
        });
        return;
      }

      this.loading = true;
      const form = Object.assign({}, this.profileForm);
      // Strip spaces from phone number
      form.phone_number = form.phone_number.replace(/ /g, "");
      // Strip dashes from CPF/CNPJ
      if (this.country === "BR") {
        form.cpf = stripCpf(form.cpf);
        if (form.profile_type_id === PROFILE_COMMERCIAL) {
          form.business_vat = stripCnpj(form.business_vat);
        }

        form.postal_code = form.postal_code.replace(/\D/g, "");
      }

      if (this.isProfileEmpty) {
        const request =
          this.country === "BR"
            ? profile.CreateNational(
                form,
                this.$store.state.ActiveSession.token
              )
            : profile.CreateForeign(
                form,
                this.$store.state.ActiveSession.token
              );

        request
          .then(() => {
            this.fetchAndUpdate();
          })
          .catch(err =>
            this.$store.dispatch("Alerts/alertUser", {
              title: this.$t("error"),
              message: this.$t(`api.profile.${err.statusString}`)
            })
          )
          .finally(() => (this.loading = false));
      } else {
        const request =
          this.country === "BR"
            ? profile.EditNational(
                this.profile.id,
                form,
                this.$store.state.ActiveSession.token
              )
            : profile.EditForeign(
                this.profile.id,
                form,
                this.$store.state.ActiveSession.token
              );

        request
          .then(() => {
            this.fetchAndUpdate();
            this.editing = false;
          })
          .catch(err =>
            this.$store.dispatch("Alerts/alertUser", {
              title: this.$t("error"),
              message: this.$t(`api.profile.${err.statusString}`)
            })
          )
          .finally(() => (this.loading = false));
      }
    },

    /**
     * @description Copies the first profile in the store to profileForm
     */
    mapProfileToForm() {
      // First profile in store
      this.profileForm = Object.assign({}, this.profile);

      // Apply formatting on CPF/CNPJ
      if (this.country === "BR") {
        this.profileForm.postal_code = String(
          this.profileForm.postal_code
        ).replace(/^([\d]{2})\.?([\d]{3})\-?([\d]{3})/, "$1.$2-$3");

        this.profileForm.fiscal_number = formatCpf(
          this.profileForm.fiscal_number
        );

        if (this.profileForm.profile_type_id === PROFILE_COMMERCIAL) {
          this.profileForm.business_vat = formatCnpj(
            this.profileForm.business_vat
          );
        }
      }
    },
    fetchAndUpdate() {
      this.fetchProfiles()
        .then(() => {
          if (this.profileCount) {
            this.mapProfileToForm();
          }
        })
        .catch(err => console.error(err));
    }
  },
  created() {
    // Get profile info
    if (this.$store.getters["ActiveSession/isAuthenticated"]) {
      if (this.profileCount) {
        this.mapProfileToForm();
      } else {
        if (!this.isProfileEmpty) {
          this.fetchAndUpdate();
        }
      }
    }
  }
};
</script>
