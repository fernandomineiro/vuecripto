<template>
  <div class="md-layout text-center">
    <div
      class="main md-layout-item md-medium-size-90 md-large-size-50 md-xlarge-size-45"
    >
      <h3 class="page-title">{{ $t("pageNotFound") }}</h3>
      <img class="cda-logo" src="/img/CDA-logo.png" />
      <md-button class="md-simple" @click="backToPrevPage">
        {{ $t("backToPrevPage") }}
      </md-button>
      <md-button class="md-simple" @click="goToDashboard">
        {{ $t("backToDashboard") }}
      </md-button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goToDashboard() {
      this.$router.push("/dashboard");
    },
    backToPrevPage() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/md/_variables";

.main {
  padding: 5rem 0;
}
.main * {
  margin: 0 auto;
  display: block;
}
.cda-logo {
  max-width: 600px;
  width: 98%;
}
.main .md-simple {
  color: #029baf !important;
  display: inline-block;
  font-size: 1rem;
  margin-top: 0.5rem;
}

@media (max-width: $screen-md) {
  .main {
    padding: 0 5%;
  }
}

@media (min-width: $screen-md) {
  .page-title {
    font-size: 2rem;
  }
}
</style>
