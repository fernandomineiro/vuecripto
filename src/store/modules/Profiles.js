import profile from "@/api/profile";

const state = {
  status: "pristine", // "pristine"| "empty" | "set" | "fetching"| "error"
  loading: false,
  profile: null,
  skipWizard: sessionStorage.getItem("skipWizard") || false,
  count: 0,
  lastError: null
};

const getters = {
  isEmpty: state => state.status == "empty"
};

const actions = {
  fetchProfiles({ commit, rootState }) {
    commit("fetching");
    return profile
      .GetByUserId(rootState.ActiveSession.uid)
      .then(profile => {
        if (profile) {
          commit("setProfile", profile);
          return profile;
        } else {
          commit("empty");
          return null;
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
  skipWizard({ commit }) {
    commit("SKIP_WIZARD");
    sessionStorage.setItem("skipWizard", true);
  },
  clearStore({ commit }) {
    commit("clear");
    sessionStorage.setItem("skipWizard", false);
  }
};

const mutations = {
  setProfile(state, profile) {
    state.profile = profile;
    state.count = 1;
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
  SKIP_WIZARD(state) {
    state.skipWizard = true;
  },
  clear(state) {
    state.status = "pristine";
    state.loading = false;
    state.profile = null;
    state.count = 0;
    state.lastError = null;
    state.skipWizard = false;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
