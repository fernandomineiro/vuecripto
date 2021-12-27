import indicators from "@/api/indicators";

const state = {
  indicators: null
};

const actions = {
  fetchIndicators({ commit }) {
    return indicators
      .getLatest()
      .then(res => {
        commit("SET_INDICATORS", res.data);
        return res.data;
      })
      .catch(err => console.error(err));
  }
};

const mutations = {
  SET_INDICATORS(state, indicators) {
    state.indicators = indicators;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
