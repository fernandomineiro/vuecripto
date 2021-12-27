<template>
  <div id="wizard-wrapper">
    <div class="content">
      <div class="md-layout text-center">
        <div class="md-layout-item md-size-100">
          <h1>{{ $t("wizard.welcome") }}</h1>
          <p v-if="!(isComplete || resuming)">{{ $t("wizard.guideline") }}</p>
        </div>
        <div
          class="md-layout-item md-small-size-100 md-large-size-75 md-size-50"
        >
          <sync-loader class="mt-4" color="#999999" v-if="resuming" />
          <div v-else-if="isComplete">
            <i class="far fa-check-circle text-success" id="complete-icon"></i>
            <h3>{{ $t("wizard.allDone") }}</h3>
            <router-link to="/dashboard">
              <md-button class="md-danger md-lg md-raised">
                {{ $t("wizard.proceedToDashboard") }}
              </md-button>
            </router-link>
          </div>
          <md-steppers
            :md-active-step.sync="active"
            md-vertical
            md-linear
            v-else
          >
            <md-step
              id="WizardType"
              :md-label="$t('wizard.accountType')"
              :md-editable="isAccountTypeEditable"
              :md-done.sync="progress.accountType"
            >
              <profile-type-step @select="setUserType" />
            </md-step>
            <md-step
              id="WizardPersonal"
              :md-label="$t('wizard.personalInfo')"
              :md-editable="false"
              :md-done.sync="progress.personal"
            >
              <info-step
                v-if="profileType"
                :type="profileType"
                :country="country"
                @success="onCreateProfileSuccess"
              />
            </md-step>
            <md-step
              id="WizardResidence"
              :md-label="$t('wizard.residenceInfo')"
              :md-editable="false"
              :md-done.sync="progress.residence"
            >
              <address-step
                :loading="loading"
                @success="onSubmitAddressSuccess"
              />
            </md-step>
            <md-step
              id="WizardDocuments"
              :md-label="$t('wizard.documents')"
              :md-editable="false"
              :md-done.sync="progress.documents"
            >
              <h3 class="title">{{ $t("wizard.warningDocument") }}</h3>
              <div class="md-layout md-alignment-center-center">
                <div class="md-layout-item">
                  <md-button to="/wizard-document" class="md-primary">
                    {{ $t("wizard.goToDocument") }}
                  </md-button>
                </div>
              </div>
            </md-step>
          </md-steppers>
          <div class="text-right">
            <md-button
              @click="skip"
              class="md-danger"
              v-if="!(resuming || isComplete)"
            >
              {{ $t("wizard.skip") }}
            </md-button>
          </div>
        </div>
      </div>
    </div>
    <alert
      :title="alert.title"
      :message="alert.message"
      v-if="alert.show"
      @click="hideAlert"
    />
  </div>
</template>

<script>
import ProfileTypeStep from "./ProfileTypeStep";
import InfoStep from "./InfoStep";
import AddressStep from "./AddressStep";
import Alert from "@/components/Modals/Alert";
import SyncLoader from "vue-spinner/src/SyncLoader";
import profile from "@/api/profile";
import { mapState, mapActions } from "vuex";
import patchObject from "@/utils/patchObject";
import { strip as stripCpf } from "@fnando/cpf";
import { strip as stripCnpj } from "@fnando/cnpj";
import types from "@/utils/types";

const { PROFILE_COMMERCIAL } = types;

const brazilianProfileForm = {
  profile_type_id: null,
  fullname: null,
  fiscal_number: null,
  date_of_birth: null,
  job: null,
  phone_number: null,
  document_type: null,
  document_number: null,
  document_issuer: null,
  street: null,
  neighborhood: null,
  city: null,
  postal_code: null,
  street_number: null,
  region: null,
  additional_information: null,
  business_vat: null,
  business_state_number: null,
  business_commercial_name: null,
  business_city_number: null,
  admin: null,
  business_name: null
};

const intlProfileForm = {
  profile_type_id: null,
  fullname: null,
  fiscal_number: null,
  date_of_birth: null,
  job: null,
  phone_number: null,
  document_type: null,
  document_number: null,
  document_issuer: null,
  address_line_one: null,
  address_line_two: null,
  additional_information: null,
  business_vat: null,
  business_state_number: null,
  business_commercial_name: null,
  business_city_number: null,
  admin: null,
  business_name: null
};

export default {
  components: {
    ProfileTypeStep,
    InfoStep,
    AddressStep,
    Alert,
    SyncLoader
  },
  data() {
    return {
      form: null,
      /**
       * @description Progress state of steps
       */
      progress: {
        accountType: false,
        personal: false,
        residence: false,
        documents: false
      },

      docModal: {
        doctype: null,
        show: false
      },

      /**
       * @description Whether progress resume is being calculated
       */
      resuming: true,

      /**
       * @description ID of current active step
       */
      active: "WizardType",
      profileId: null,
      profileType: null,
      documentsComplete: false,
      loading: false
    };
  },
  computed: {
    ...mapState({
      token: state => state.ActiveSession.token,
      userId: state => state.ActiveSession.uid,
      country: state => state.ActiveSession.country_code,
      alert: state => state.Alerts
    }),
    isAccountTypeEditable() {
      return !this.profileId;
    },
    isComplete() {
      return (
        this.progress.personal &&
        this.progress.residence &&
        this.documentsComplete
      );
    }
  },
  watch: {
    isComplete(val) {
      if (val) {
        this.$store.dispatch("Profiles/fetchProfiles");
        this.$router.push("/profile");
      }
    }
  },
  methods: {
    ...mapActions({
      alertUser: "Alerts/alertUser",
      hideAlert: "Alerts/hide",
      skipWizard: "Profiles/skipWizard"
    }),
    setUserType(profile_type_id) {
      this.profileType = profile_type_id;
      this.progress.accountType = true;
      this.active = "WizardPersonal";
    },
    onCreateProfileSuccess(profile) {
      profile.phone_number = profile.phone_number.replace(/ /g, "");
      this.form = patchObject(this.form)(profile);
      this.progress.personal = true;
      this.active = "WizardResidence";
    },
    onSubmitAddressSuccess(address) {
      this.form = patchObject(this.form)(address);
      if (this.country === "BR") {
        this.form.fiscal_number = stripCpf(this.form.fiscal_number);
        this.form.postal_code = this.form.postal_code.replace(/\D/g, "");
        if (this.form.profile_type_id === PROFILE_COMMERCIAL) {
          this.form.business_vat = stripCnpj(this.form.business_vat);
        }
      }

      this.loading = true;
      const request =
        this.country === "BR"
          ? profile.CreateNational(this.form)
          : profile.CreateForeign(this.form);

      request
        .then(res => {
          this.progress.residence = true;
          this.active = "WizardDocuments";
          this.profileId = res.id;

          this.$store.dispatch("Profiles/fetchProfiles");
        })
        .catch(err =>
          this.alertUser({
            title: this.$t("error"),
            message: this.$t(`api.profile.${err.statusString}`)
          })
        )
        .finally(() => (this.loading = false));
    },
    async checkProfileCompletion() {
      // Check if user has a profile
      try {
        const userProfile = await profile.GetByUserId(this.userId);

        // Check if user has any profile
        if (!userProfile) {
          return;
        }

        // Store profile type
        this.profileType = userProfile.profile_type_id;
        this.profileId = userProfile.id;

        this.progress.accountType = true;
        this.progress.personal = true;
        this.progress.residence = true;
        this.active = "WizardDocuments";
      } catch (e) {
        this.alertUser({
          title: this.$t("error"),
          message: this.$t(`api.profile.${e.statusString}`)
        });
      }
    },
    skip() {
      this.skipWizard();
      this.$router.push("/dashboard");
    }
  },
  created() {
    this.checkProfileCompletion().finally(() => (this.resuming = false));

    // Set form template based on nationality
    this.form = Object.assign(
      {},
      this.country === "BR" ? brazilianProfileForm : intlProfileForm
    );
  }
};
</script>

<style>
#complete-icon {
  font-size: 10rem;
}
</style>
