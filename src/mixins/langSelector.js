import "flag-icon-css/css/flag-icon.min.css";
import { mapState, mapActions } from "vuex";

/**
 * @description Provides working logic for a language selector
 */
export default {
  data() {
    return {
      currentLang: { name: "...", flag: "un" },
      isInited: false
    };
  },
  computed: {
    ...mapState({
      languages: state => state.Languages.languages,
      lang: state => state.Settings.lang,
      currency: state => state.Settings.currency,
      userLang: state => state.UserPreferences.userLang,
      userCurrency: state => state.UserPreferences.userCurrency,
      preferencesId: state => state.UserPreferences.preferencesId
    })
  },
  methods: {
    ...mapActions({
      setLang: "Settings/setLang",
      getLang: "Settings/getLang",
      getLangById: "Languages/getById",
      getLangByCode: "Languages/getByCode",
      createPreferences: "UserPreferences/createPreferences",
      updatePreferences: "UserPreferences/updatePreferences"
    }),
    /**
     * @description Changes app language
     * @param {Object} lang Language object
     */
    changeLang(lang) {
      if (this.userLang) {
        this.updatePreferences({
          preferences_id: this.preferencesId,
          currency_id: Number(this.currency),
          language_id: lang.id
        }).then(res => {
          this.$store.dispatch(
            "UserPreferences/updateLang",
            res.data.language_id
          );
        });
      } else {
        this.createPreferences({
          currency_id: Number(this.currency),
          language_id: lang.id || process.env.VUE_APP_DEFAULT_LANGUAGE_ID
        }).then(res => {
          this.$store.dispatch("UserPreferences/setUserLang", { lang: lang });
          this.$store.dispatch(
            "UserPreferences/setUserCurrency",
            Number(this.currency)
          );
          this.$store.dispatch("UserPreferences/setPrefencesId", res.data.id);
        });
      }

      this.setLang({ lang, i18n: this.$i18n });
    },

    /**
     * @description Gets current language
     */
    async getCurrentLang() {
      return await this.getLangById(this.lang);
    },
    async init() {
      // Currencies and settings must be loaded bbefore initializing the
      // component
      if (!(this.languages && this.languages.length)) {
        setTimeout(this.init, 100);
      } else {
        this.isInited = true;
        // If there's a currency set up, use it as the selected value, if not,
        // use default
        this.currentLang = await this.getCurrentLang();
      }
    }
  },
  watch: {
    async lang() {
      this.currentLang = await this.getCurrentLang();
    }
  },
  async created() {
    this.init();
  }
};
