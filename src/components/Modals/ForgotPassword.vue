<template>
  <modal v-if="visible" @close="hide">
    <template slot="header">
      <h4 class="modal-title">
        {{ $t("login.recoverPassword") }}
      </h4>
      <md-button
        class="md-simple md-just-icon md-round modal-default-button"
        @click="hide"
      >
        <md-icon>clear</md-icon>
      </md-button>
    </template>
    <md-field class="md-form-group" slot="body">
      <md-icon>email</md-icon>
      <label>{{ $t("email") }}...</label>
      <md-input autocomplete="off" v-model="email" type="email"></md-input>
    </md-field>

    <sync-loader color="#999999" slot="footer" v-if="loading" />
    <md-button
      class="md-simple md-danger"
      @click="resetPassword"
      slot="footer"
      v-else
    >
      {{ $t("modal.forgotPassword.submit") }}
    </md-button>
  </modal>
</template>

<script>
import user from "@/api/user";
import { Modal } from "@/components";
import SyncLoader from "vue-spinner/src/SyncLoader";

export default {
  name: "forgot-password",
  components: {
    Modal,
    SyncLoader
  },
  data() {
    return {
      email: null,
      visible: false,
      loading: false
    };
  },
  methods: {
    resetPassword() {
      this.loading = true;
      user
        .ResetPassword(this.email)
        .then(() => {
          this.$router.push("/recover?ref=modal");
        })
        .catch(err => {
          this.$emit("error", err);
        })
        .finally(() => (this.loading = false));
    },
    show() {
      this.visible = true;
    },
    hide() {
      this.visible = false;
    }
  }
};
</script>

<style scoped>
.modal-title {
  color: #3c4858;
}
</style>
