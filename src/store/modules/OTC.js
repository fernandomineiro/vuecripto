import otc from "@/api/otc";

const state = {
  status: "pristine", // "pristine"| "empty" | "set" | "fetching"| "error"
  loading: false,
  requests: [],
  request: null,
  count: 0,
  lastUpdated: null,
  lastError: null
};

const getters = {
  isEmpty: state => state.status == "empty",
  isInitialized: state => state.status != "pristine"
};

const actions = {
  fetchRequests({ commit, rootState }) {
    commit("fetching");
    return otc
      .ListAll(rootState.ActiveSession.token)
      .then(requests => {
        if (requests.length) {
          commit("setRequests", requests);
          return requests;
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
  fetchRequest({ commit, rootState }, request_id) {
    commit("fetching");
    return otc
      .GetOtc(request_id, rootState.ActiveSession.token)
      .then(request => {
        commit("setRequest", request);
        return request;
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
  setRequests(state, requests) {
    state.requests = requests;
    state.count = requests.length;
    state.status = "set";
  },
  setRequest(state, request) {
    state.request = request;
  },
  clearRequest(state) {
    state.request = null;
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
    state.requests = [];
    state.request = null;
    state.count = 0;
    state.lastUpdated = null;
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
