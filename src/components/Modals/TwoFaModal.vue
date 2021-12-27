<template>
  <modal @close="onCancel">
    <template slot="header">
      <h4 class="modal-title">
        {{ header }}
      </h4>
      <md-button
        class="md-simple md-just-icon md-round modal-default-button"
        @click="onCancel"
      >
        <md-icon>clear</md-icon>
      </md-button>
    </template>
    <template slot="body">
      <form @submit.prevent="onSubmit">
        <md-field
          :md-counter="false"
          :class="{ 'md-error': errors.has('otp') }"
        >
          <label>{{ $t(`twoFa.method.${method}`) }}</label>
          <md-input
            v-model="otp"
            type="password"
            name="otp"
            v-validate="'required'"
            maxlength="4"
          />
          <span class="md-helper-text">
            {{ $t("twoFa.yourMethod") }}:
            {{ $t(`twoFa.method.${method}`) }}
          </span>
        </md-field>

        <md-button type="submit" class="md-info md-block mt-4">
          {{ $t("confirm") }}
        </md-button>
      </form>
    </template>
  </modal>
</template>

<script>
import { Modal } from "@/components";
import { mapState } from "vuex";

export default {
  components: {
    Modal
  },
  data() {
    return {
      otp: null
    };
  },
  computed: {
    ...mapState("TwoFactor", {
      description: state => state.description,
      resolveCallback: state => state.resolveCallback,
      rejectCallback: state => state.rejectCallback
    }),
    ...mapState("ActiveSession", { method: state => state.two_factor_method }),
    header() {
      return this.$t("twoFa.description.description", {
        method: this.$t("twoFa.description.method." + this.method),
        action: this.$t("twoFa.description.action." + this.description)
      });
    }
  },
  methods: {
    async onSubmit() {
      if (await this.$validator.validate()) {
        this.resolveCallback(this.otp);
      }
    },
    onCancel() {
      this.rejectCallback("cancelled");
    }
  }
};
</script>
