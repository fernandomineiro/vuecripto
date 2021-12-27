import cryptoAddress from "@/api/cryptoAddress";

const state = {
  status: "pristine", // "pristine"| "empty" | "set" | "fetching"| "error"
  loading: false,
  addresses: [],
  count: 0,
  lastError: null
};

const getters = {
  isEmpty: state => state.status == "empty",
  isInitialized: state => state.status != "pristine"
};

const actions = {
  fetchAddresses({ commit, rootState }) {
    commit("fetching");
    return cryptoAddress
      .GetAllAddresses(rootState.ActiveSession.token)
      .then(addresses => {
        if (addresses.length) {
          commit("setAddresses", addresses);
          return addresses;
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
  setAddresses(state, addresses) {
    state.addresses = addresses;
    state.count = addresses.length;
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
    state.addresses = [];
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
