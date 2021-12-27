import currency from "@/api/currency";

const state = {
  status: "pristine", // "pristine"| "empty" | "set" | "fetching"| "error"
  loading: false,
  currencies: {},
  count: 0,
  lastError: null
};

const getters = {
  isEmpty: state => state.status == "empty",
  isIntialized: state => state.status == "pristine"
};

const actions = {
  fetchCurrencies({ commit }) {
    commit("fetching");
    return currency
      .GetAllCurrencies()
      .then(currencies => {
        if (currencies.length) {
          // Convert to object with id as index to help searching
          let curObj = {};
          for (const cur of currencies) {
            curObj[cur.id] = cur;
          }
          commit("setCurrencies", curObj);
          return currencies;
        } else {
          commit("empty");
          return [];
        }
      })
      .catch(err => {
        commit("error", err);
        return Promise.reject(err);
      })
      .finally(() => {
        commit("notFetching");
      });
  },
  clearStore({ commit }) {
    commit("clear");
  }
};

const mutations = {
  setCurrencies(state, currencies) {
    state.currencies = currencies;
    state.count = currencies.length;
    state.status = "set";
  },
  fetching(state) {
    state.status = "fetching";
    state.loading = true;
  },
  notFetching(state) {
    state.loading = false;
  },
  empty(state) {
    state.status = "empty";
  },
  error(state, error) {
    state.status = "error";
    state.lastError = error;
  },
  clear(state) {
    state.status = "pristine";
    state.loading = false;
    state.currencies = {};
    state.count = 0;
    state.lastError = null;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
