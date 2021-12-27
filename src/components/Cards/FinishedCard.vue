<template>
  <div>
    <md-card>
      <div class="md-layout md-alignment-center-center">
        <div class="md-layout-item md-size-100">
          <md-card-header>
            <div class="md-title">{{ $t("wizard.finishedDocs") }}</div>
            <div class="md-subhead">
              {{ $t("wizard.waitDocs") }}
            </div>
          </md-card-header>
        </div>
      </div>
      <div class="md-layout md-alignment-center-center">
        <div class="md-layout-item md-size-100">
          <sweetalert-icon icon="success"></sweetalert-icon>
        </div>
      </div>
      <div class="md-layout md-alignment-center-center">
        <div class="md-layout-item md-size-100">
          <md-button to="/" class="md-block md-info">
            {{ $t("wizard.goToDashboard") }}
          </md-button>
        </div>
      </div>
    </md-card>
  </div>
</template>

<script>
import SweetalertIcon from "vue-sweetalert-icons";
export default {
  components: {
    SweetalertIcon
  },
  methods: {
    proceedToNext() {
      this.$emit("set-finish");
    }
  }
};
</script>

<style scoped></style>
