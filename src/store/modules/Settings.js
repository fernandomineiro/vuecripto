const state = {
  lang: localStorage.getItem("user-lang") || null,
  currency:
    localStorage.getItem("user-currency") ||
    process.env.VUE_APP_DEFAULT_CURRENCY_ID
};

const actions = {
  setLang({ commit }, payload) {
    commit("SET_LANG", payload);
  },
  setCurrency({ commit }, currency_id) {
    commit("SET_CURRENCY", currency_id);
  }
};

const mutations = {
  SET_LANG(state, { lang, i18n }) {
    state.lang = lang.id;
    i18n.locale = lang.code;
    localStorage.setItem("user-lang", lang.id);
  },
  SET_CURRENCY(state, currency_id) {
    state.currency = currency_id;
    localStorage.setItem("user-currency", currency_id);
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
