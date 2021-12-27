import preferences from "@/api/preferences";

const state = {
  userLang: null,
  userCurrency: null,
  preferencesId: null
};

const actions = {
  fetchUserPreferences({ dispatch, rootState }, i18n) {
    preferences.getPreferences(rootState.ActiveSession.token).then(res => {
      if (res.data) {
        const chosenLang = rootState.Languages.languages.find(
          x => x.id == res.data.language_id
        );
        dispatch(
          "Settings/setLang",
          { lang: chosenLang, i18n },
          { root: true }
        );
        dispatch("Settings/setCurrency", res.data.currency_id, { root: true });
        dispatch("setUserLang", { lang: chosenLang });
        dispatch("setUserCurrency", res.data.currency_id);
        dispatch("setPrefencesId", res.data.id);
      }
    });
  },
  setUserLang({ commit }, payload) {
    commit("SET_USER_LANG", payload);
  },
  updateLang({ commit }, payload) {
    commit("UPDATE_LANGUAGE", payload);
  },
  setUserCurrency({ commit }, cur) {
    commit("SET_USER_CURRENCY", cur);
  },
  setPrefencesId({ commit }, code) {
    commit("SET_PREFERENCES_CODE", code);
  },
  createPreferences({ rootState }, { currency_id, language_id }) {
    return preferences.createPreferences(
      Number(currency_id),
      Number(language_id),
      rootState.ActiveSession.token
    );
  },
  updatePreferences(
    { rootState },
    { preferences_id, currency_id, language_id }
  ) {
    return preferences.updatePreferences(
      preferences_id,
      currency_id,
      language_id,
      rootState.ActiveSession.token
    );
  },
  clearStore({ commit }) {
    commit("CLEAR_STORE");
  }
};

const mutations = {
  SET_USER_LANG(state, { lang }) {
    state.userLang = lang.id;
    localStorage.setItem("user-lang", lang.id);
  },
  UPDATE_LANGUAGE(state, langId) {
    state.userLang = langId;
  },
  SET_USER_CURRENCY(state, cur) {
    state.userCurrency = cur;
    localStorage.setItem("user-currency", cur);
  },
  SET_PREFERENCES_CODE(state, code) {
    state.preferencesId = code;
  },
  CLEAR_STORE(state) {
    state.userLang = null;
    state.userCurrency = null;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
