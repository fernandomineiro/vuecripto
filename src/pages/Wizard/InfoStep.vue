<template>
  <form
    autocomplete="off"
    name="personal"
    data-vv-scope="personal"
    @submit.prevent="sendPersonal"
  >
    <div class="md-layout">
      <div class="md-layout-item md-size-100">
        <md-field
          :class="{
            'md-error': errors.has('fullname', 'personal')
          }"
        >
          <label>{{ $t("wizard.fullName") }}</label>
          <md-input
            type="text"
            v-model="form.fullname"
            name="fullname"
            v-validate="'required'"
          />
        </md-field>
      </div>
      <div
        class="md-layout-item md-xsmall-size-100 md-medium-size-50 md-size-33"
      >
        <md-field
          :class="{
            'md-error': errors.has('phone_number', 'personal') || !isTelValid
          }"
        >
          <vue-tel-input
            v-model="form.phone_number"
            inputClasses="custom-input"
            :placeholder="$t('wizard.phoneNumber')"
            name="phone_number"
            v-validate="'required'"
            @validate="onTelValidate"
          />
        </md-field>
      </div>
      <div
        class="md-layout-item md-xsmall-size-100 md-medium-size-50 md-size-33"
      >
        <md-field
          :class="{
            'md-error': errors.has('date_of_birth', 'personal') || isUnderage
          }"
        >
          <label>{{ $t("wizard.birthDate") }}</label>
          <datetime-input
            v-model="form.date_of_birth"
            :valid.sync="birthDateValid"
            type="date"
            name="date_of_birth"
            v-validate="'required'"
          />
        </md-field>
      </div>
      <div
        class="md-layout-item md-xsmall-size-100 md-medium-size-50 md-size-33"
      >
        <md-field
          :class="{
            'md-error': errors.has('fiscal_number', 'personal')
          }"
        >
          <label>{{ $t("cpf") }}</label>
          <lazy-input
            v-if="country === 'BR'"
            v-model="form.fiscal_number"
            v-validate="'required|cpf'"
            v-mask="'###.###.###-##'"
            type="text"
            name="fiscal_number"
          />
          <md-input
            v-else
            type="text"
            v-model="form.fiscal_number"
            name="fiscal_number"
            v-validate="'required'"
          />
        </md-field>
      </div>
      <div
        class="md-layout-item md-xsmall-size-100 md-medium-size-50 md-size-33"
      >
        <md-field
          :class="{
            'md-error': errors.has('job', 'personal')
          }"
        >
          <label>{{ $t("wizard.job") }}</label>
          <md-input
            type="text"
            v-model="form.job"
            name="job"
            v-validate="'required'"
          />
        </md-field>
      </div>
      <div class="md-layout-item md-small-size-100 md-size-33">
        <md-field
          :class="{ 'md-error': errors.has('document_type', 'personal') }"
        >
          <label>{{ $t("profile.documentType") }}</label>
          <md-select
            v-model="form.document_type"
            v-validate="'required'"
            name="document_type"
          >
            <md-option v-for="type in documentTypes" :key="type" :value="type">
              {{ $t(`profile.document.${type}`) }}
            </md-option>
          </md-select>
        </md-field>
      </div>
      <div class="md-layout-item md-small-size-100 md-size-33">
        <md-field
          :class="{ 'md-error': errors.has('document_number', 'personal') }"
        >
          <label>{{ $t("profile.documentNumber") }}</label>
          <md-input
            v-model="form.document_number"
            v-validate="'required'"
            name="document_number"
            type="text"
          ></md-input>
        </md-field>
      </div>
      <div class="md-layout-item md-small-size-100 md-size-33">
        <md-field
          :class="{ 'md-error': errors.has('document_issuer', 'personal') }"
        >
          <label>{{ $t("profile.documentIssuer") }}</label>
          <md-input
            v-model="form.document_issuer"
            v-validate="'required|max:255'"
            name="document_issuer"
            type="text"
          ></md-input>
        </md-field>
      </div>

      <!-- Business fields -->
      <template v-if="isUserBusinessType">
        <div class="md-layout-item md-size-100">
          <md-field
            :class="{
              'md-error': errors.has('businessName', 'personal')
            }"
          >
            <label>{{ $t("wizard.businessName") }}</label>
            <md-input
              type="text"
              v-model="form.business_name"
              name="businessName"
              v-validate="'required'"
            />
          </md-field>
        </div>

        <div class="md-layout-item md-size-100">
          <md-field
            :class="{
              'md-error': errors.has('businessVat', 'personal')
            }"
          >
            <label>{{ $t("wizard.businessVat") }}</label>
            <md-input
              v-if="country === 'BR'"
              v-model="form.business_vat"
              v-validate="'required|cnpj'"
              v-mask="'##.###.###/####-##'"
              type="text"
              name="businessVat"
            />
            <md-input
              v-else
              type="text"
              v-model="form.business_vat"
              name="businessVat"
              v-validate="'required'"
            />
          </md-field>
        </div>

        <div class="md-layout-item md-size-100">
          <md-field
            :class="{
              'md-error': errors.has('businessCommercialName', 'personal')
            }"
          >
            <label>{{ $t("wizard.businessCommercialName") }}</label>
            <md-input
              type="text"
              v-model="form.business_commercial_name"
              name="businessCommercialName"
              v-validate="'required'"
            />
          </md-field>
        </div>

        <div class="md-layout-item md-size-100">
          <md-field
            :class="{
              'md-error': errors.has('businessStateNumber', 'personal')
            }"
          >
            <label>{{ $t("wizard.businessStateNumber") }}</label>
            <md-input
              type="text"
              v-model="form.business_state_number"
              name="businessStateNumber"
              v-validate="'required'"
            />
          </md-field>
        </div>

        <div class="md-layout-item md-size-100">
          <md-field
            :class="{
              'md-error': errors.has('businessCityNumber', 'personal')
            }"
          >
            <label>{{ $t("wizard.businessCityNumber") }}</label>
            <md-input
              type="text"
              v-model="form.business_city_number"
              name="businessCityNumber"
              v-validate="'required'"
            />
          </md-field>
        </div>

        <div class="md-layout-item md-size-100">
          <md-field :class="{ 'md-error': errors.has('admin', 'personal') }">
            <label>{{ $t("wizard.admin") }}</label>
            <md-input
              type="text"
              v-model="form.admin"
              name="admin"
              v-validate="'required'"
            />
          </md-field>
        </div>
      </template>
    </div>
    <div class="mt-4 text-right">
      <md-button class="md-danger md-raised d-inline-block" type="submit">
        {{ $t("continue") }}
      </md-button>
    </div>
  </form>
</template>

<script>
import { mapActions } from "vuex";
import types from "@/utils/types";
import { DatetimeInput, LazyInput } from "@/components";
import VueTelInput from "vue-tel-input";
import isUnderage from "@/utils/isUnderage";

export default {
  name: "info-step",
  components: {
    DatetimeInput,
    VueTelInput,
    LazyInput
  },
  props: {
    type: { type: Number, required: true },
    country: { type: String, required: true }
  },
  data() {
    return {
      form: {
        profile_type_id: this.type,
        // Personal
        fullname: null,
        fiscal_number: null,
        date_of_birth: null,
        phone_number: null,
        job: null,
        document_type: null,
        document_number: null,
        document_issuer: null,
        // Business
        admin: null,
        business_vat: null,
        business_city_number: null,
        business_state_number: null,
        business_name: null,
        business_commercial_name: null
      },
      documentTypes: ["PASSPORT", "NATIONAL_ID", "NATIONAL_DRIVE_LICENSE"],
      isTelValid: null,
      birthDateValid: null
    };
  },
  computed: {
    isUserBusinessType() {
      return this.type == types.PROFILE_COMMERCIAL;
    },
    isUnderage() {
      if (!this.birthDateValid) {
        return false;
      }

      return isUnderage(this.form.date_of_birth);
    }
  },
  methods: {
    ...mapActions({ alertUser: "Alerts/alertUser" }),
    async sendPersonal() {
      if (this.isUnderage) {
        this.alertUser({
          title: this.$t("error"),
          message: this.$t("profile.mustNotBeUnderage")
        });

        return;
      }

      if ((await this.$validator.validate("personal.*")) && this.isTelValid) {
        this.$emit("success", this.form);
      } else {
        this.alertUser({
          title: this.$t("error"),
          message: this.$t("verifyFormErrors")
        });
      }
    },
    onTelValidate({ isValid }) {
      this.isTelValid = isValid;
    }
  }
};
</script>

<style scoped>
/* VueTelInput */
.dropdown.open {
  z-index: 9999 !important;
}
.custom-input {
  height: 36px;
  padding: 7px 0;
  font-size: 14px !important;
  -webkit-text-fill-color: #3c4858 !important;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
.md-error .custom-input {
  -webkit-text-fill-color: #f44336 !important;
}
.vue-tel-input {
  border: none !important;
}
.vue-tel-input:focus-within {
  -webkit-box-shadow: unset !important;
  box-shadow: unset !important;
  border-color: unset !important;
}
</style>
