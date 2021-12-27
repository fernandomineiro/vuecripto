<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-small-size-100 md-size-66 mx-auto">
        <edit-profile-form header-color="blue"></edit-profile-form>
      </div>
      <div class="md-layout-item md-small-size-100 md-size-33">
        <user-documents />
      </div>
      <div class="md-layout-item md-small-size-100 md-size-50">
        <general-settings-card />
      </div>
    </div>
  </div>
</template>

<script>
import EditProfileForm from "./EditProfileForm";
import GeneralSettingsCard from "@/components/Cards/GeneralSettingsCard";
import UserDocuments from "./UserDocuments";

export default {
  components: {
    EditProfileForm,
    GeneralSettingsCard,
    UserDocuments
  }
};
</script>
<style lang="scss">
.text-right {
  display: flex;
}
</style>
