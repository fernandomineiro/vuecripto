<template>
  <div>
    <!-- Personal Info -->
    <small>{{ $t("profile.completeYourProfile") }}</small>
    <div class="md-layout">
      <div class="md-layout-item md-small-size-100 md-size-33">
        <md-field>
          <label>{{ $t("username") }}</label>
          <md-input :value="username" type="text" disabled></md-input>
        </md-field>
      </div>
      <div class="md-layout-item md-small-size-100 md-size-33">
        <md-field>
          <label>{{ $t("email") }}</label>
          <md-input :value="email" type="email" disabled></md-input>
        </md-field>
      </div>
      <div class="md-layout-item md-small-size-100 md-size-33">
        <md-field
          :class="{
            'md-error': errors.has('phone_number') || !isTelValid
          }"
        >
          <vue-tel-input
            v-model="profileForm.phone_number"
            :disabled="!isProfileEmpty"
            inputClasses="custom-input"
            :placeholder="$t('profile.phoneNumber')"
            name="phone_number"
            v-validate="'required'"
            ref="telInput"
            @input="onFormInput"
            @validate="onTelValidate"
          />
        </md-field>
      </div>

      <div class="md-layout-item md-small-size-100 md-size-66">
        <md-field :class="{ 'md-error': errors.has('fullname') }">
          <label>{{ $t("profile.fullName") }}</label>
          <md-input
            v-model="profileForm.fullname"
            type="text"
            v-validate="'required|alpha_spaces|min:5|max:255'"
            name="fullname"
            :disabled="!(isProfileEmpty || editing)"
            @input="onFormInput"
          ></md-input>
        </md-field>
      </div>
      <div class="md-layout-item md-small-size-100 md-size-33">
        <md-field
          :md-counter="false"
          :class="{ 'md-error': errors.has('cpf') }"
        >
          <label>{{ $t("cpf") }}</label>
          <md-input
            v-model="profileForm.fiscal_number"
            v-validate="'required|numeric'"
            name="cpf"
            type="text"
            maxlength="32"
            :disabled="!isProfileEmpty"
            @input="onFormInput"
          ></md-input>
        </md-field>
      </div>

      <div class="md-layout-item md-small-size-100 md-size-33">
        <md-field
          :class="{ 'md-error': errors.has('date_of_birth') || isUnderage }"
        >
          <label>{{ $t("profile.birthDate") }}</label>
          <datetime-input
            v-model="profileForm.date_of_birth"
            v-validate="'required'"
            :valid.sync="birthDateValid"
            name="date_of_birth"
            type="date"
            :disabled="!isProfileEmpty"
            @input="onFormInput"
          ></datetime-input>
        </md-field>
      </div>
      <div class="md-layout-item md-small-size-100 md-size-33">
        <md-field :class="{ 'md-error': errors.has('job') }">
          <label>{{ $t("profile.job") }}</label>
          <md-input
            v-model="profileForm.job"
            v-validate="'required'"
            name="job"
            type="text"
            :disabled="!(isProfileEmpty || editing)"
            @input="onFormInput"
          ></md-input>
        </md-field>
      </div>
      <div class="md-layout-item md-small-size-100 md-size-33">
        <md-field :class="{ 'md-error': errors.has('profile_type') }">
          <label>{{ $t("profile.profileType") }}</label>
          <md-select
            v-model="profileForm.profile_type_id"
            v-validate="'required'"
            name="profile_type"
            type="text"
            :disabled="!isProfileEmpty"
            @input="onFormInput"
          >
            <md-option :value="PROFILE_PERSONAL">
              {{ $t("profile.personal") }}
            </md-option>
            <md-option :value="PROFILE_COMMERCIAL">
              {{ $t("profile.commercial") }}
            </md-option>
          </md-select>
        </md-field>
      </div>

      <div class="md-layout-item md-small-size-100 md-size-33">
        <md-field :class="{ 'md-error': errors.has('document_type') }">
          <label>{{ $t("profile.documentType") }}</label>
          <md-select
            v-model="profileForm.document_type"
            v-validate="'required'"
            name="document_type"
            :disabled="!isProfileEmpty"
            @input="onFormInput"
          >
            <md-option v-for="type in documentTypes" :key="type" :value="type">
              {{ $t(`profile.document.${type}`) }}
            </md-option>
          </md-select>
        </md-field>
      </div>
      <div class="md-layout-item md-small-size-100 md-size-33">
        <md-field :class="{ 'md-error': errors.has('document_number') }">
          <label>{{ $t("profile.documentNumber") }}</label>
          <md-input
            v-model="profileForm.document_number"
            v-validate="'required'"
            name="document_number"
            type="text"
            :disabled="!isProfileEmpty"
            @input="onFormInput"
          ></md-input>
        </md-field>
      </div>
      <div class="md-layout-item md-small-size-100 md-size-33">
        <md-field :class="{ 'md-error': errors.has('document_issuer') }">
          <label>{{ $t("profile.documentIssuer") }}</label>
          <md-input
            v-model="profileForm.document_issuer"
            v-validate="'required|max:255'"
            name="document_issuer"
            type="text"
            :disabled="!isProfileEmpty"
            @input="onFormInput"
          ></md-input>
        </md-field>
      </div>
    </div>

    <!-- Residence Info -->
    <small>{{ $t("profile.residentialData") }}</small>
    <div class="md-layout">
      <div class="md-layout-item md-size-100">
        <md-field :class="{ 'md-error': errors.has('address_line_one') }">
          <label>{{ $t("profile.addressLineOne") }}</label>
          <md-input
            v-model="profileForm.address_line_one"
            v-validate="'required|min:5|max:255'"
            name="address_line_one"
            type="text"
            :disabled="!(isProfileEmpty || editing)"
            @input="onFormInput"
          ></md-input>
        </md-field>
      </div>
      <div class="md-layout-item md-size-100">
        <md-field :class="{ 'md-error': errors.has('address_line_two') }">
          <label>{{ $t("profile.addressLineTwo") }}</label>
          <md-input
            v-model="profileForm.address_line_two"
            v-validate="'required|max:255'"
            name="address_line_two"
            type="text"
            :disabled="!(isProfileEmpty || editing)"
            @input="onFormInput"
          ></md-input>
        </md-field>
      </div>
      <div class="md-layout-item md-size-100">
        <md-field>
          <label>{{ $t("profile.complement") }}</label>
          <md-input
            v-model="profileForm.additional_information"
            type="text"
            :disabled="!(isProfileEmpty || editing)"
            @input="onFormInput"
          ></md-input>
        </md-field>
      </div>
    </div>

    <!-- Commercial Info -->
    <template v-if="isProfileCommercial">
      <small>{{ $t("profile.commercialData") }}</small>
      <div class="md-layout">
        <div class="md-layout-item md-small-size-100 md-size-66">
          <md-field :class="{ 'md-error': errors.has('admin') }">
            <label>{{ $t("profile.admin") }}</label>
            <md-input
              v-model="profileForm.admin"
              name="admin"
              type="text"
              :disabled="!isProfileEmpty"
              @input="onFormInput"
            ></md-input>
          </md-field>
        </div>

        <div class="md-layout-item md-small-size-100 md-size-33">
          <md-field :class="{ 'md-error': errors.has('business_vat') }">
            <label>{{ $t("profile.business_vat") }}</label>
            <md-input
              v-model="profileForm.vat"
              name="business_vat"
              type="text"
              :disabled="!isProfileEmpty"
              @input="onFormInput"
            ></md-input>
          </md-field>
        </div>

        <div class="md-layout-item md-small-size-100 md-size-50">
          <md-field :class="{ 'md-error': errors.has('business_name') }">
            <label>{{ $t("profile.business_name") }}</label>
            <md-input
              v-model="profileForm.business_name"
              name="business_name"
              type="text"
              :disabled="!isProfileEmpty"
              @input="onFormInput"
            ></md-input>
          </md-field>
        </div>

        <div class="md-layout-item md-small-size-100 md-size-50">
          <md-field :class="{ 'md-error': errors.has('commercial_name') }">
            <label>{{ $t("profile.business_commercial_name") }}</label>
            <md-input
              v-model="profileForm.business_commercial_name"
              name="commercial_name"
              type="text"
              :disabled="!isProfileEmpty"
              @input="onFormInput"
            ></md-input>
          </md-field>
        </div>

        <div class="md-layout-item md-small-size-100 md-size-50">
          <md-field :class="{ 'md-error': errors.has('city_number') }">
            <label>{{ $t("profile.business_city_number") }}</label>
            <md-input
              v-model="profileForm.business_city_number"
              name="city_number"
              type="text"
              :disabled="!isProfileEmpty"
              @input="onFormInput"
            ></md-input>
          </md-field>
        </div>

        <div class="md-layout-item md-small-size-100 md-size-50">
          <md-field :class="{ 'md-error': errors.has('state_number') }">
            <label>{{ $t("profile.business_state_number") }}</label>
            <md-input
              v-model="profileForm.business_state_number"
              name="state_number"
              type="text"
              :disabled="!isProfileEmpty"
              @input="onFormInput"
            ></md-input>
          </md-field>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { DatetimeInput } from "@/components";
import VueTelInput from "vue-tel-input";
import patchObject from "@/utils/patchObject";
import types from "@/utils/types";
import { mapGetters } from "vuex";
import isUnderage from "@/utils/isUnderage";

const { PROFILE_COMMERCIAL, PROFILE_PERSONAL } = types;

const profileForm = {
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

const initForm = patchObject(profileForm);

export default {
  name: "international-profile-form",
  components: {
    DatetimeInput,
    VueTelInput
  },
  props: {
    value: { type: Object, default: null },
    editing: { type: Boolean, default: false },
    username: { type: String, default: "" },
    email: { type: String, default: "" }
  },
  data() {
    return {
      PROFILE_COMMERCIAL,
      PROFILE_PERSONAL,
      profileForm: this.value ? initForm(this.value) : profileForm,
      documentTypes: ["PASSPORT", "NATIONAL_ID", "NATIONAL_DRIVE_LICENSE"],
      isTelValid: null,
      birthDateValid: null
    };
  },
  computed: {
    ...mapGetters({ isProfileEmpty: "Profiles/isEmpty" }),
    isProfileCommercial() {
      return this.profileForm
        ? this.profileForm.profile_type_id == PROFILE_COMMERCIAL
        : false;
    },
    isFormValid() {
      return Boolean(!this.errors.any() && this.isTelValid);
    },
    isUnderage() {
      if (!this.birthDateValid) {
        return false;
      }

      return isUnderage(this.profileForm.date_of_birth);
    }
  },
  watch: {
    value: {
      deep: true,
      handler: function(val) {
        this.profileForm = patchObject(this.profileForm)(val);
      }
    },
    isFormValid(val) {
      this.$emit("update:valid", val);
    }
  },
  created() {
    if (!this.value) {
      this.$emit("input", profileForm);
    }
  },
  methods: {
    onFormInput() {
      this.$emit("input", this.profileForm);
    },
    onTelValidate({ isValid }) {
      this.isTelValid = isValid;
    }
  }
};
</script>

<style>
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
