<template>
  <router-view></router-view>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  computed: {
    ...mapState({
      languages: state => state.Languages.languages,
      lang: state => state.Settings.lang
    })
  },
  methods: {
    ...mapActions({
      setLang: "Settings/setLang",
      getLang: "Settings/getLang",
      getLangById: "Languages/getById",
      getLangByCode: "Languages/getByCode"
    }),
    changeLang(lang) {
      this.setLang({ lang, i18n: this.$i18n });
    },
    async getChosenLang() {
      return await this.getLangById(this.lang);
    },
    async initI18n() {
      if (!this.lang) {
        this.setLang({
          lang: await this.getLangByCode(this.$i18n.locale),
          i18n: this.$i18n
        });
      } else {
        this.$i18n.locale = (await this.getLangById(this.lang)).code;
      }
    }
  },
  watch: {
    languages() {
      if (!this.i18nInited) {
        this.initI18n();
        this.i18nInited = true;
      }
    }
  },
  created() {
    if (this.languages) {
      this.initI18n();
      this.i18nInited = true;
    }
  }
};
</script>
