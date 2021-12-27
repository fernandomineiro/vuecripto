<template>
  <v-select
    :options="languages"
    label="name"
    :clearable="false"
    :searchable="false"
    class="lang-selector"
    :value="currentLang"
    @input="changeLang"
    v-click-outside="onClickAway"
    ref="langSelector"
    v-if="isInited"
  >
    <template slot="selected-option" slot-scope="option">
      <span class="flag-icon" :class="`flag-icon-${option.flag}`"></span>
    </template>
    <template slot="option" slot-scope="option">
      <span class="flag-icon" :class="`flag-icon-${option.flag}`"></span>
      {{ option.name }}
    </template>
  </v-select>
</template>

<script>
import langSelector from "@/mixins/langSelector";
import "vue-select/dist/vue-select.css";
import vSelect from "vue-select";

export default {
  name: "lang-selector",
  mixins: [langSelector],
  components: {
    vSelect
  },
  methods: {
    onClickAway() {
      this.$refs.langSelector.open = false;
    }
  }
};
</script>

<style lang="scss">
.lang-selector {
  display: flex;
  align-content: center;
  margin-left: 0.5rem;

  .vs__dropdown-toggle {
    border: none;
  }

  .vs__search {
    display: none;
  }

  &.vs--open .vs__selected {
    position: static;
  }
}
</style>
