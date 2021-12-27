import user from "@/api/user";

const state = {
  status: "pristine", // "pristine" | "set" | "fetching"| "error"
  loading: false,
  id: null,
  username: null,
  email: null,
  user_type_id: null,
  percent: 0,
  reffer: null,
  my_broker: null,
  lastError: null
};

const actions = {
  fetchUser({ commit, rootState }) {
    commit("fetching");
    return user
      .GetUser(rootState.ActiveSession.uid)
      .then(user => {
        commit("setUser", user);
        return user;
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
  setUser(state, user) {
    state.id = user.id;
    state.username = user.username;
    state.email = user.email;
    state.user_type_id = user.user_type_id;
    state.percent = user.percent;
    state.reffer = user.reffer;
    state.my_broker = user.my_broker;
    state.moving_limit = user.moving_limit;

    state.status = "set";
  },
  fetching(state) {
    state.status = "fetching";
    state.loading = true;
  },
  notFetching(state) {
    state.loading = false;
  },
  error(state, error) {
    state.status = "error";
    state.lastError = error;
  },
  clear(state) {
    state.status = "pristine";
    state.loading = false;
    state.id = null;
    state.username = null;
    state.email = null;
    state.user_type_id = null;
    state.percent = 0;
    state.reffer = null;
    state.my_broker = null;
    state.lastError = null;
    state.moving_limit = 10000;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
