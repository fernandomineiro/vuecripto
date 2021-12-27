<template>
  <md-field>
    <md-select v-model="selectedId">
      <md-option v-if="!isInited" selected>{{ $t("loading") }}...</md-option>
      <template v-else>
        <md-option
          v-for="currency in fiatCurs"
          :key="currency.id"
          :value="currency.id"
        >
          {{ currency.name }} ({{ currency.symbol }})
        </md-option>
      </template>
    </md-select>
  </md-field>
</template>

<script>
import currencySelector from "@/mixins/currencySelector";

export default {
  name: "currency-form-select",
  mixins: [currencySelector],
  data() {
    return {
      selectedId: 0
    };
  },
  methods: {
    /**
     * @description Syncs select model with user currency Vuex state
     */
    syncModel() {
      this.selectedId = this.userCurrency;
    }
  },
  watch: {
    isInited(val) {
      if (val) {
        this.syncModel();
      }
    },
    userCurrency() {
      this.syncModel();
    },

    /**
     * @description Watches for changes on the model to trigger the setting
     * update
     */
    selectedId(val) {
      if (!this.isInited) {
        return;
      }

      const currency = this.fiatCurs.find(x => x.id == val);

      // ERROR!
      if (!currency) {
        return;
      }

      this.changeCur(currency);
    }
  },
  created() {
    if (this.isInited) {
      this.syncModel();
    }
  }
};
</script>
