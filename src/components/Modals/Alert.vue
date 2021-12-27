<template>
  <modal v-if="showing" @close="hide">
    <template slot="header">
      <h4 class="modal-title">
        {{ title }}
      </h4>
      <md-button
        class="md-simple md-just-icon md-round modal-default-button"
        @click="hide"
      >
        <md-icon>clear</md-icon>
      </md-button>
    </template>
    <p class="modal-message" slot="body">
      {{ message }}
    </p>
    <md-button class="md-simple md-danger" @click="hide" slot="footer">
      {{ close }}
    </md-button>
  </modal>
</template>

<script>
import { Modal } from "@/components";

export default {
  name: "alert",
  components: {
    Modal
  },
  props: {
    showing: { type: Boolean, default: true },
    title: { type: String, default: "Alert" },
    message: { type: String, default: "An alert was emitted" },
    close: { type: String, default: "Ok" }
  },
  methods: {
    hide() {
      this.$store.dispatch("Alerts/hide");
      this.$emit("close");
    }
  }
};
</script>

<style scoped>
.modal-title,
.modal-message {
  color: #3c4858;
}
</style>
