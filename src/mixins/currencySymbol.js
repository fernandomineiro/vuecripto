const getCurrency = (vm, title) => {
  const currencies = Object.values(vm.$store.state.Currencies.currencies);
  return currencies.find(x => x.title === title);
};

const currencySymbol = {
  methods: {
    /**
     * Get currency symbol
     * @param {string} title
     */
    getCurrencySymbol(title) {
      const currency = getCurrency(this, title);
      return currency ? currency.symbol || currency.title : title;
    },
    getCurrencyName(title) {
      const currency = getCurrency(this, title);
      return currency ? currency.name : null;
    }
  }
};

export default currencySymbol;
