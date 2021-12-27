import invoice from "@/api/invoice";

const state = {
  status: "pristine", // "pristine"| "empty" | "set" | "fetching"| "error"
  loading: false,
  invoice: {},
  lastError: null
};

const getters = {
  isEmpty: state => state.status == "empty",
  isIntialized: state => state.status == "pristine"
};

const actions = {
  fetchTypes({ commit }) {
    commit("fetching");
    return invoice
      .GetInvoiceTypes()
      .then(types => {
        if (types.length) {
          // Convert to object with id as index to help searching
          let typesObj = {};
          for (const type of types) {
            typesObj[type.id] = type;
          }
          commit("setTypes", { invoice: typesObj });
          return types;
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
  setTypes(state, types) {
    state.invoice = types.invoice;
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
    state.invoice = {};
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
