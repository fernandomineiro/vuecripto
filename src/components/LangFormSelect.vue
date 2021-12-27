<template>
  <md-field>
    <md-select v-model="selectedId" :disabled="!isInited">
      <md-option v-if="!isInited" selected>{{ $t("loading") }}...</md-option>
      <template v-else>
        <md-option v-for="lang in languages" :key="lang.id" :value="lang.id">
          {{ lang.name }}
        </md-option>
      </template>
    </md-select>
  </md-field>
</template>

<script>
import langSelector from "@/mixins/langSelector";

export default {
  name: "lang-form-select",
  mixins: [langSelector],
  data() {
    return {
      selectedId: 0
    };
  },
  methods: {
    /**
     * @description Syncs select model with user lang Vuex state
     */
    syncModel() {
      this.selectedId = this.userLang;
    }
  },
  watch: {
    isInited(val) {
      if (val) {
        this.syncModel();
      }
    },
    userLang() {
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

      const language = this.languages.find(x => x.id == val);

      // ERROR!
      if (!language) {
        return;
      }

      this.changeLang(language);
    }
  },
  created() {
    if (this.isInited) {
      this.syncModel();
    }
  }
};
</script>
