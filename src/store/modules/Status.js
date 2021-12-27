import invoice from "@/api/invoice";

const state = {
  status: "pristine", // "pristine"| "empty" | "set" | "fetching"| "error"
  loading: false,
  statuses: {},
  count: 0,
  lastError: null
};

const getters = {
  isEmpty: state => state.status == "empty",
  isIntialized: state => state.status == "pristine"
};

const actions = {
  fetchStatuses({ commit }) {
    commit("fetching");
    return invoice
      .GetStatusTypes()
      .then(statuses => {
        if (statuses.length) {
          // Convert to object with id as index to help searching
          let statusObj = {};
          for (const status of statuses) {
            statusObj[status.id] = status;
          }
          commit("setStatus", statusObj);
          return statuses;
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
  setStatus(state, statuses) {
    state.statuses = statuses;
    state.count = statuses.length;
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
    state.statuses = {};
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
