const state = {
  /**
   * @description Change Password modal state
   */
  changePassword: {
    /**
     * @description Whether Change Password modal is visible
     * @type {boolean}
     */
    show: false
  },

  changeTwoFa: {
    show: false
  },

  deposit: {
    currency_id: null,
    show: false
  },

  /**
   * @description QR Code Login modal state
   */
  qrCodeLogin: {
    /**
     * @description Whether QR Code Login modal is visible
     * @type {boolean}
     */
    show: false
  },

  tradePrecision: {
    data: null,
    show: false
  }
};

const actions = {
  /**
   * @description Sets Change Password modal to visible
   * @param {*} context
   */
  launchChangePassword({ commit }) {
    commit("SET_CHANGE_PASSWORD_SHOW", true);
  },

  /**
   * @description Sets Change Password modal to hidden
   * @param {*} context
   */
  hideChangePassword({ commit }) {
    commit("SET_CHANGE_PASSWORD_SHOW", false);
  },
  launchDeposit({ commit }, currency_id) {
    commit("SET_DEPOSIT_CURRENCY_ID", currency_id);
    commit("SET_DEPOSIT_SHOW", true);
  },
  hideDeposit({ commit }) {
    commit("SET_DEPOSIT_SHOW", false);
  },

  /**
   * @description Sets QR Code Login modal to visible
   * @param {*} context
   */
  launchQrCodeLogin({ commit }) {
    commit("SET_QRCODE_LOGIN_SHOW", true);
  },

  /**
   * @description Sets QR Code Login modal to hidden
   * @param {*} context
   */
  hideQrCodeLogin({ commit }) {
    commit("SET_QRCODE_LOGIN_SHOW", false);
  },

  launchTradePrecision({ commit }, data) {
    commit("SET_TRADE_PRECISION_DATA", data);
    commit("SET_TRADE_PRECISION_SHOW", true);
  },
  hideTradePrecision({ commit }) {
    commit("SET_TRADE_PRECISION_SHOW", false);
  },

  launchChangeTwoFa({ commit }) {
    commit("SET_CHANGE_TWO_FA_SHOW", true);
  },
  hideChangeTwoFa({ commit }) {
    commit("SET_CHANGE_TWO_FA_SHOW", false);
  }
};

const mutations = {
  SET_CHANGE_PASSWORD_SHOW(state, value) {
    state.changePassword.show = value;
  },
  SET_DEPOSIT_CURRENCY_ID(state, currency_id) {
    state.deposit.currency_id = currency_id;
  },
  SET_DEPOSIT_SHOW(state, value) {
    state.deposit.show = value;
  },

  /**
   * @description Sets QR Code Login modal visibility
   * @param {*} state
   * @param {boolean} value
   */
  SET_QRCODE_LOGIN_SHOW(state, value) {
    state.qrCodeLogin.show = value;
  },

  SET_TRADE_PRECISION_DATA(state, data) {
    state.tradePrecision.data = data;
  },
  SET_TRADE_PRECISION_SHOW(state, value) {
    state.tradePrecision.show = value;
  },
  SET_CHANGE_TWO_FA_SHOW(state, value) {
    state.changeTwoFa.show = value;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
