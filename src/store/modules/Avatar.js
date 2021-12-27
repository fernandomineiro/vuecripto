import avatar from "@/api/avatar";

const state = {
  loading: false,
  url: "/img/user.png"
};

const actions = {
  fetchAvatar({ commit, rootState }) {
    commit("LOADING");
    const { uid } = rootState.ActiveSession;
    return avatar
      .getAvatarByUserId(uid)
      .then(res => {
        commit("SET_DATA", res.data);
      })
      .finally(() => {
        commit("LOADING");
      });
  },
  clearStore({ commit }) {
    commit("CLEAR");
  }
};

const mutations = {
  SET_DATA(state, data) {
    state.url = data.url;
  },
  CLEAR(state) {
    state.loading = false;
    state.url = "/img/user.png";
  },
  LOADING(state) {
    state.loading = !state.loading;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
