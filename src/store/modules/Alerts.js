const state = {
  title: "Alert",
  message: "This is an alert",
  onClose: null,
  show: false
};

const getters = {
  alert: state => state
};

const actions = {
  alertUser({ commit }, data) {
    const { title, message } = data;
    let onClose = null;
    if (data.onClose) {
      onClose = data.onClose;
    }
    commit("setAlert", { title, message, onClose });
  },
  hide({ commit, state }) {
    commit("hideAlert");
    if (state.onClose) {
      state.onClose();
    }
  }
};

const mutations = {
  setAlert(state, data) {
    const { title, message, onClose } = data;
    state.title = title;
    state.message = message;
    state.onClose = onClose;
    state.show = true;
  },
  hideAlert(state) {
    state.show = false;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
