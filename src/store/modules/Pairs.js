import pair from "@/api/pair";
import trade from "@/api/trade";
import otc from "@/api/otc";

const state = {
  pairs: [],
  tradePairs: [],
  otcSettings: []
};

const getters = {
  otcPairs(state) {
    if (!(Boolean(state.pairs.length) && Boolean(state.otcSettings.length))) {
      return [];
    }

    const getPairIds = otcSettings => otcSettings.map(x => x.pair_id);

    const filterOtcPairs = pairs => otcPairIds =>
      pairs.filter(x => otcPairIds.includes(x.id));

    return filterOtcPairs(state.pairs)(getPairIds(state.otcSettings));
  }
};

const actions = {
  fetchPairs({ commit }) {
    return pair
      .GetAllPairs()
      .then(res => commit("SET_PAIRS", res))
      .catch(err => Promise.reject(err));
  },
  fetchTradePairs({ commit }) {
    return trade
      .GetAllPairs()
      .then(res => commit("SET_TRADE_PAIRS", res))
      .catch(err => Promise.reject(err));
  },
  fetchOtcSettings({ commit }) {
    return otc
      .GetSettings()
      .then(res => commit("SET_OTC_SETTINGS", res))
      .catch(err => Promise.reject(err));
  }
};

const mutations = {
  SET_PAIRS(state, pairs) {
    state.pairs = pairs;
  },
  SET_TRADE_PAIRS(state, tradePairs) {
    state.tradePairs = tradePairs;
  },
  SET_OTC_SETTINGS(state, settings) {
    state.otcSettings = settings;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
