import { mapState, mapActions } from "vuex";

// Fiat currency type ID
const CURRENCY_FIAT = 2;

// Default currency ID
const CURRENCY_DEFAULT = process.env.VUE_APP_DEFAULT_CURRENCY_ID || 11;

/**
 * @description Provides currency selector behaviour to component
 */
export default {
  data() {
    return {
      currentCur: { id: 0, name: "Currency", title: "..." },
      isInited: false
    };
  },
  computed: {
    ...mapState({
      lang: state => state.Settings.lang,
      currencies: state => state.Currencies.currencies,
      currency: state => state.Settings.currency,
      userLang: state => state.UserPreferences.userLang,
      userCurrency: state => state.UserPreferences.userCurrency,
      preferencesId: state => state.UserPreferences.preferencesId
    }),
    fiatCurs() {
      // Container for FIAT currencies
      let curs = [];

      // Iterate through all currencies, selecting those with the said type id
      for (const key in this.currencies) {
        if (this.currencies.hasOwnProperty(key)) {
          const cur = this.currencies[key];

          if (cur.currency_type_id == CURRENCY_FIAT) {
            curs.push(cur);
          }
        }
      }

      return curs;
    }
  },
  methods: {
    ...mapActions({
      setCurrency: "Settings/setCurrency",
      createPreferences: "UserPreferences/createPreferences",
      updatePreferences: "UserPreferences/updatePreferences"
    }),
    /**
     * @description Changes user default currency
     * @param {Object} cur Currency type object
     */
    changeCur(cur) {
      if (this.userCurrency) {
        this.updatePreferences({
          preferences_id: this.preferencesId,
          currency_id: cur.id,
          language_id: this.userLang
        }).then(res => {
          this.$store.dispatch(
            "UserPreferences/setUserCurrency",
            res.data.currency_id
          );
        });
      } else {
        this.createPreferences({
          currency_id: cur.id || process.env.VUE_APP_DEFAULT_CURRENCY_ID,
          language_id: this.lang || process.env.VUE_APP_DEFAULT_LANGUAGE_ID
        }).then(res => {
          this.$store.dispatch("UserPreferences/updateLang", this.lang);
          this.$store.dispatch("UserPreferences/setUserCurrency", cur.id);
          this.$store.dispatch("UserPreferences/setPrefencesId", res.data.id);
        });
      }
      this.setCurrency(cur.id);
    },
    /**
     * @description Initializes component data
     */
    init() {
      // Currencies and settings must be loaded bbefore initializing the
      // component
      if (!Object.keys(this.currencies).length) {
        setTimeout(this.init, 100);
      } else {
        this.isInited = true;
        // If there's a currency set up, use it as the selected value, if not,
        // use default
        this.currentCur =
          localStorage.getItem("user-currency") ||
          this.currencies[this.currency] ||
          this.currencies[CURRENCY_DEFAULT];
      }
    }
  },
  watch: {
    currency() {
      this.currentCur = this.currencies[this.currency];
    }
  },
  created() {
    this.init();
  }
};
