<template>
  <div>
    <md-button class="md-info md-block" @click="setUserType(1)">
      {{ $t("wizard.personalAccount") }}
    </md-button>
    <md-button class="md-info md-block mt-4" @click="setUserType(2)">
      {{ $t("wizard.businessAccount") }}
    </md-button>
  </div>
</template>

<script>
export default {
  name: "profile-type-step",
  methods: {
    setUserType(type) {
      this.$emit("select", type);
    }
  }
};
</script>
