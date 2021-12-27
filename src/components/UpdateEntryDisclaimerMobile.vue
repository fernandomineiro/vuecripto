<template>
  <div class="update-entry-disclaimer-mobile" @click="gotoProfile">
    <div class="margin"></div>
    <div class="bar">
      <md-icon class="text-warning">warning</md-icon>
      <u>{{ $t("addJobInfo") }}</u>
    </div>
  </div>
</template>

<script>
export default {
  name: "update-entry-disclaimer-mobile",
  methods: {
    gotoProfile() {
      this.$router.push("/profile");
    }
  }
};
</script>


<style lang="scss">
@import "@/assets/scss/md/_colors.scss";
.update-entry-disclaimer-mobile {
  .margin {
    margin-top: calc(8px + 1.5rem);
  }
  .bar {
    background: $red-900;
    position: fixed;
    bottom: 0;
    z-index: 65535;
    color: $white;
    width: 100%;
    text-align: center;
    padding: 4px 0;

    .md-icon {
      margin-right: 0.5rem;
    }
  }
}
</style>
