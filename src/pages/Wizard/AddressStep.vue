<template>
  <form
    autocomplete="off"
    name="residence"
    data-vv-scope="residence"
    @submit.prevent="sendResidence"
  >
    <div v-if="country === 'BR'" class="md-layout">
      <div class="md-layout-item md-xsmall-size-100 md-size-25">
        <md-field
          :class="{
            'md-error': errors.has('postal_code', 'residence')
          }"
        >
          <label>{{ $t("wizard.zipCode") }}</label>
          <lazy-input
            type="text"
            v-model="form.postal_code"
            name="postal_code"
            v-validate="{ required: true, regex: /^\d{2}.\d{3}-\d{3}$/ }"
            v-mask="'##.###-###'"
          />
        </md-field>
      </div>
      <div class="md-layout-item md-xsmall-size-100 md-size-75">
        <md-field
          :class="{
            'md-error': errors.has('street', 'residence')
          }"
        >
          <label>{{ $t("wizard.street") }}</label>
          <md-input
            type="text"
            v-model="form.street"
            name="street"
            v-validate="'required'"
          />
        </md-field>
      </div>
      <div class="md-layout-item md-xsmall-size-100 md-size-50">
        <md-field
          :class="{
            'md-error': errors.has('number', 'residence')
          }"
        >
          <label>{{ $t("wizard.number") }}</label>
          <md-input
            type="text"
            v-model="form.street_number"
            name="number"
            v-validate="'required'"
          />
        </md-field>
      </div>
      <div class="md-layout-item md-xsmall-size-100 md-size-50">
        <md-field>
          <label>{{ $t("wizard.additional") }}</label>
          <md-input
            type="text"
            v-model="form.additional_information"
            name="additional"
          />
        </md-field>
      </div>
      <div class="md-layout-item md-xsmall-size-100 md-size-40">
        <md-field
          :class="{
            'md-error': errors.has('neighborhood', 'residence')
          }"
        >
          <label>{{ $t("wizard.district") }}</label>
          <md-input
            type="text"
            v-model="form.neighborhood"
            name="neighborhood"
            v-validate="'required'"
          />
        </md-field>
      </div>
      <div class="md-layout-item md-xsmall-size-100 md-size-40">
        <md-field
          :class="{
            'md-error': errors.has('city', 'residence')
          }"
        >
          <label>{{ $t("wizard.city") }}</label>
          <md-input
            type="text"
            v-model="form.city"
            name="city"
            v-validate="'required'"
          />
        </md-field>
      </div>
      <div class="md-layout-item md-xsmall-size-100 md-size-20">
        <md-field
          :class="{
            'md-error': errors.has('region', 'residence')
          }"
        >
          <label>{{ $t("wizard.state") }}</label>
          <md-input
            type="text"
            v-model="form.region"
            name="region"
            maxlength="2"
            v-validate="'required'"
          />
        </md-field>
      </div>
    </div>
    <div v-else class="md-layout">
      <div class="md-layout-item md-size-100">
        <md-field
          :class="{
            'md-error': errors.has('address_line_one', 'residence')
          }"
        >
          <label>{{ $t("profile.addressLineOne") }}</label>
          <md-input
            type="text"
            v-model="form.address_line_one"
            name="address_line_one"
            v-validate="'required|max:255'"
          />
        </md-field>
      </div>
      <div class="md-layout-item md-size-100">
        <md-field
          :class="{
            'md-error': errors.has('address_line_two', 'residence')
          }"
        >
          <label>{{ $t("profile.addressLineTwo") }}</label>
          <md-input
            type="text"
            v-model="form.address_line_two"
            name="address_line_two"
            v-validate="'required|max:255'"
          />
        </md-field>
      </div>
      <div class="md-layout-item md-size-100">
        <md-field
          :class="{
            'md-error': errors.has('additional_information', 'residence')
          }"
        >
          <label>{{ $t("profile.complement") }}</label>
          <md-input
            type="text"
            v-model="form.additional_information"
            name="additional_information"
            v-validate="'max:255'"
          />
        </md-field>
      </div>
    </div>
    <sync-loader class="mt-4" color="#999999" v-if="loading" />
    <div class="mt-4 text-right" v-else>
      <md-button class="md-danger md-raised d-inline-block" type="submit">
        {{ $t("continue") }}
      </md-button>
    </div>
  </form>
</template>

<script>
import SyncLoader from "vue-spinner/src/SyncLoader";
import { mapState, mapActions } from "vuex";
import { LazyInput } from "@/components";

const brazilianAddress = {
  street: null,
  neighborhood: null,
  city: null,
  postal_code: null,
  street_number: null,
  region: null,
  additional_information: null
};

const intlAddress = {
  address_line_one: null,
  address_line_two: null,
  additional_information: null
};

export default {
  name: "address-step",
  components: {
    SyncLoader,
    LazyInput
  },
  props: {
    loading: { type: Boolean, default: false }
  },
  data() {
    return {
      form: null
    };
  },
  computed: {
    ...mapState({
      country: state => state.ActiveSession.country_code
    })
  },
  created() {
    this.form = Object.assign(
      {},
      this.country === "BR" ? brazilianAddress : intlAddress
    );
  },
  methods: {
    ...mapActions({ alertUser: "Alerts/alertUser" }),
    async sendResidence() {
      if (await this.$validator.validate("residence.*")) {
        this.$emit("success", this.form);
      } else {
        this.alertUser({
          title: this.$t("error"),
          message: this.$t("verifyFormErrors")
        });
      }
    }
  }
};
</script>
