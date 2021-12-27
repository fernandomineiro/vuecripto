<template>
  <v-select
    :options="fiatCurs"
    label="name"
    :clearable="false"
    :searchable="false"
    class="currency-selector"
    :value="currentCur"
    @input="changeCur"
    v-click-outside="onClickAway"
    ref="currencySelector"
  >
    <template slot="selected-option" slot-scope="option">
      {{ option.title }}
    </template>
    <template slot="option" slot-scope="option">
      {{ option.name }} ({{ option.symbol }})
    </template>
  </v-select>
</template>

<script>
import currencySelector from "@/mixins/currencySelector";
import "vue-select/dist/vue-select.css";
import VSelect from "vue-select";

export default {
  name: "currency-selector",
  mixins: [currencySelector],
  components: {
    VSelect
  },
  methods: {
    onClickAway() {
      this.$refs.currencySelector.open = false;
    }
  }
};
</script>

<style lang="scss">
.currency-selector {
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
