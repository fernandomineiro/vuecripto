import Cookie from "js-cookie";

const state = {
  refUser:
    Cookie.get("user-referral") || localStorage.getItem("user-referral") || ""
};

const actions = {
  setReferral({ commit }, ref) {
    commit("SET_REF", ref);
  }
};

const mutations = {
  SET_REF(state, ref) {
    state.refUser = ref;
    Cookie.set("user-referral", ref, {
      expires: 365
    });
    localStorage.setItem("user-referral", ref);
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
