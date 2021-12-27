<template>
  <div class="md-layout">
    <div class="md-layout-item md-small-size-100 md-size-66 mx-auto">
      <user-settings-card />
    </div>
    <!-- User Preferences -->
    <div
      class="md-layout-item md-small-size-100 md-size-66 mx-auto"
      v-if="$device == 'mobile'"
    >
      <user-preferences />
    </div>
  </div>
</template>

<script>
import UserPreferences from "./UserPreferences";
import UserSettingsCard from "@/components/Cards/UserSettingsCard";

export default {
  components: {
    UserPreferences,
    UserSettingsCard
  }
};
</script>
