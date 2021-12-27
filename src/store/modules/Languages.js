import languages from "@/api/languages";

const state = {
  languages: null
};

const actions = {
  fetchLanguages({ commit }) {
    languages.getPreferences().then(langs => {
      commit("SET_LANGUAGES", langs);
    });
  },
  getById({ state }, id) {
    return state.languages.find(x => x.id == id);
  },
  getByCode({ state }, code) {
    return state.languages.find(x => x.code == code);
  }
};

const mutations = {
  SET_LANGUAGES(state, languages) {
    state.languages = languages;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
