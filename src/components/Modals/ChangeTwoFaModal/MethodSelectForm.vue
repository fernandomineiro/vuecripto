<template>
  <div>
    {{ $t("profile.twoFa.chooseMethod") }}
    <md-button
      v-for="{ text, value } in methods"
      :key="value"
      class="md-button md-info md-block"
      @click="onSelectMethod(value)"
    >
      {{ text }}
    </md-button>
  </div>
</template>

<script>
export default {
  name: "method-select-form",
  data() {
    return {
      methods: [{ text: "PIN", value: "pin" }]
    };
  },
  methods: {
    onSelectMethod(value) {
      this.$emit("select", value);
    }
  }
};
</script>
