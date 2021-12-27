/**
 * Provide password strength text
 */
const passwordStrength = {
  data() {
    return {
      passwordScore: null
    };
  },
  computed: {
    /**
     * i18n text for password strength
     */
    passwordStrength() {
      if (this.passwordScore === null) {
        return "";
      }

      const scale = ["veryWeak", "weak", "medium", "strong", "veryStrong"];
      const strength = scale[this.passwordScore];

      return (
        this.$t("password.passwordStrength") +
        ": " +
        this.$t(`password.strength.${strength}`)
      );
    }
  },
  methods: {
    setPasswordScore(score) {
      this.passwordScore = score;
    }
  }
};

export default passwordStrength;
