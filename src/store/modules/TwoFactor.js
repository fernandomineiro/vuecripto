import deposit from "@/api/deposit";
import internalTransfer from "@/api/internalTransfer";
import trade from "@/api/trade";
import twoFactor from "@/api/twoFactor";
import user from "@/api/user";
import withdraw from "@/api/withdraw";

const state = {
  show: false,
  description: null,
  resolveCallback: null,
  rejectCallback: null
};

const actions = {
  /**
   * Make API calls for endpoints that use 2FA
   *
   * Launches modal to get the pin or other kind of 2FA token if 2FA is enabled.
   * Rejection may happen if user cancels input - in this case the string
   * 'cancelled' is thwon - or if the request fails somehow.
   *
   * @param {*} context
   * @param {object} payload
   * @param {string} payload.resource API resource name
   * @param {Array} payload.args API call arguments
   * @param {function} [payload.onCloseModal] Callback that runs when the modal is closed
   */
  async request({ rootState, state, commit }, payload) {
    if (!payload.resource) {
      throw new Error("Resource not provided");
    }

    if (!Object.keys(endpoints).includes(payload.resource)) {
      throw new Error("Resource not found");
    }

    const endpoint = endpoints[payload.resource];

    if (rootState.ActiveSession.two_factor_method) {
      // This promise is required to enable this method to wait for the user input
      const otpPromise = new Promise((resolve, reject) => {
        // Resolve and reject must be a state to be visible by the modal
        commit("SET_RESOLVE_CALLBACK", resolve);
        commit("SET_REJECT_CALLBACK", reject);
      });
      commit("SET_DESCRIPTION", endpoint.description);
      commit("SET_SHOW", true);

      try {
        const otp = await otpPromise;

        commit("SET_SHOW", false);
        if (payload.onCloseModal) {
          payload.onCloseModal();
        }
        return await endpoint.twoFa(otp, ...payload.args);
      } catch (error) {
        if (error === "cancelled" && payload.onCloseModal) {
          payload.onCloseModal();
        }
        throw error;
      } finally {
        if (state.show) {
          commit("SET_SHOW", false);
        }
        commit("SET_DESCRIPTION", null);
        // Resolve and reject callbacks must be unset to avoid leaking
        commit("CLEAR_CALLBACKS");
      }
    } else {
      return await endpoint.simple(...payload.args);
    }
  }
};

const mutations = {
  SET_SHOW(state, value) {
    state.show = value;
  },
  SET_DESCRIPTION(state, value) {
    state.description = value;
  },
  SET_RESOLVE_CALLBACK(state, callback) {
    state.resolveCallback = callback;
  },
  SET_REJECT_CALLBACK(state, callback) {
    state.rejectCallback = callback;
  },
  CLEAR_CALLBACKS(state) {
    state.resolveCallback = null;
    state.rejectCallback = null;
  }
};

const endpoints = {
  "deposit/depositCrypto": {
    twoFa: deposit.DepositCrypto,
    simple: (...args) => deposit.DepositCrypto(null, ...args),
    description: "depositCrypto"
  },
  "deposit/depositFiat": {
    twoFa: deposit.DepositFiat,
    simple: (...args) => deposit.DepositFiat(null, ...args),
    description: "depositFiat"
  },
  "internalTransfer/transfer": {
    twoFa: internalTransfer.Transfer,
    simple: (...args) => internalTransfer.Transfer(null, ...args),
    description: "internalTransfer"
  },
  "trade/sendRequest": {
    twoFa: trade.SendRequest,
    simple: (...args) => trade.SendRequest(null, ...args),
    description: "trade"
  },
  "twoFactor/updatePin": {
    twoFa: twoFactor.UpdatePin,
    description: "updatePin"
  },
  "twoFactor/removePin": {
    twoFa: twoFactor.RemovePin,
    description: "removePin"
  },
  "user/changePassword": {
    twoFa: user.ChangePassword,
    simple: (...args) => user.ChangePassword(null, ...args),
    description: "changePassword"
  },
  "withdraw/withdrawCrypto": {
    twoFa: withdraw.WithdrawCrypto,
    simple: (...args) => withdraw.WithdrawCrypto(null, ...args),
    description: "withdrawCrypto"
  },
  "withdraw/withdrawFiat": {
    twoFa: withdraw.WithdrawFiat,
    simple: (...args) => withdraw.WithdrawFiat(null, ...args),
    description: "withdrawFiat"
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
