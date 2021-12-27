<template>
  <div class="update-entry-disclaimer" @click="gotoProfile">
    <badge type="danger">
      {{ $t("addJobInfo") }}
    </badge>
  </div>
</template>

<script>
import { Badge } from "@/components";

export default {
  name: "update-entry-disclaimer",
  components: {
    Badge
  },
  methods: {
    gotoProfile() {
      this.$router.push("/profile");
    }
  }
};
</script>

<style lang="scss" scoped>
.update-entry-disclaimer {
  padding-left: 1rem;
  height: min-content;
  margin: auto 0;
  cursor: pointer;
}
</style>
