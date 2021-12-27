import wallet from "@/api/wallet";

const state = {
  status: "pristine", // "pristine"| "empty" | "set" | "fetching"| "error"
  loading: false,
  wallets: [],
  count: 0,
  lastError: null
};

const getters = {
  isEmpty: state => state.status == "empty",
  isInitialized: state => state.status != "pristine"
};

const actions = {
  fetchWallets({ commit, rootState }) {
    commit("fetching");
    return wallet
      .GetAllWallets(rootState.ActiveSession.token)
      .then(wallets => {
        if (wallets.length) {
          commit("setWallets", wallets);
          return wallets;
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
  setWallets(state, wallets) {
    state.wallets = wallets;
    state.count = wallets.length;
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
    state.wallets = [];
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
