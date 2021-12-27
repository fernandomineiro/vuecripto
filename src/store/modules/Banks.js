import banksAPI from "@/api/banks";

const state = {
  status: "pristine", // "pristine"| "empty" | "set" | "fetching"| "error"
  loading: false,
  banks: {},
  count: 0,
  lastError: null
};

const getters = {
  isEmpty: state => state.status == "empty",
  isIntialized: state => state.status == "pristine"
};

const actions = {
  fetchBanks({ commit }) {
    commit("fetching");
    return banksAPI
      .GetAllBanks()
      .then(banks => {
        if (banks.length) {
          // Convert to object with id as index to help searching
          let bankObj = {};
          for (const bank of banks) {
            bankObj[bank.id] = bank;
          }
          commit("setCurrencies", bankObj);
          return banks;
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
  setCurrencies(state, banks) {
    state.banks = banks;
    state.count = banks.length;
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
    state.banks = {};
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
