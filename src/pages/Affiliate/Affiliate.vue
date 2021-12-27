<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-small-size-100 md-size-50 mx-auto">
        <referrals-card />
      </div>
      <div class="md-layout-item md-small-size-100 md-size-50 mx-auto">
        <referrals-count-card />
      </div>
    </div>
  </div>
</template>

<script>
import ReferralsCard from "@/components/Cards/ReferralsCard";
import ReferralsCountCard from "@/components/Cards/ReferralsCountCard";

export default {
  components: {
    ReferralsCard,
    ReferralsCountCard
  }
};
</script>

<style lang="scss"></style>
