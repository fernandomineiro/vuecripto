import exchange from "@/api/exchange";

const state = {
  /**
   * @description Whether order history is loading
   * @type {boolean}
   */
  loadingOrderHistory: false,

  /**
   * @description Whether order book is loading
   * @type {boolean}
   */
  loadingOrderbook: false,

  /**
   * @description Current pair of orderbook
   * @type {number | null}
   */
  currentOrderbookPair: null,

  /**
   * @description User's order history
   * @type {Array<object>}
   */
  orderHistory: [],

  /**
   * @description Order book
   * @type {object}
   */
  orderbook: {},
  openOrders: {},
  closeOrders: {},

  /**
   * @description Last API error
   * @type {import("../../api/ApiError").default | null}
   */
  lastError: null
};

const actions = {
  /**
   * @description Fetches and stores the orderbook
   * @param {number} pairId
   * @returns {Promise}
   */
  fetchOrderbook({ state, commit }, pairId) {
    // Store pair ID if it is set
    if (pairId) {
      commit("SET_CURRENT_ORDERBOOK_PAIR", pairId);
    }

    // Rejects request if no pair is set on store
    if (!state.currentOrderbookPair) {
      return Promise.reject("Orderbook pair not set");
    }

    commit("SET_ORDERBOOK_LOADING", true);
    return exchange
      .getOrderbook(state.currentOrderbookPair)
      .then(res => commit("SET_ORDERBOOK", res))
      .catch(err => commit("SET_ERROR", err))
      .finally(() => commit("SET_ORDERBOOK_LOADING", false));
  },

  /**
   * @description Fetches and stores user's order history
   * @returns {Promise}
   */
  fetchOrderHistory({ commit, rootState }) {
    commit("SET_ORDER_HISTORY_LOADING", true);
    return exchange
      .getOrderHistory(rootState.ActiveSession.token)
      .then(res => {
        let openOrders = res.filter(order => order.status_id == 1);
        let closeOrders = res.filter(order => order.status_id != 1);

        commit("SET_ORDER_HISTORY", res);
        commit("SET_OPEN_ORDERS", openOrders);
        commit("SET_CLOSE_ORDERS", closeOrders);
      })
      .catch(err => commit("SET_ERROR", err))
      .finally(() => commit("SET_ORDER_HISTORY_LOADING", false));
  }
};

const mutations = {
  /**
   * @description Stores request error instance
   * @param {*} state
   * @param {Error | import("../../api/ApiError").default } error
   */
  SET_ERROR(state, error) {
    state.lastError = error;
  },

  /**
   * @description Stores user's order history
   * @param {*} state
   * @param {object} orderHistory
   */
  SET_ORDER_HISTORY(state, orderHistory) {
    state.orderHistory = orderHistory;
  },
  SET_OPEN_ORDERS(state, openOrders) {
    state.openOrders = openOrders;
  },
  SET_CLOSE_ORDERS(state, closeOrders) {
    state.closeOrders = closeOrders;
  },
  /**
   * @description Sets whether user's order history is loading
   * @param {*} state
   * @param {boolean} loadingStatus
   */
  SET_ORDER_HISTORY_LOADING(state, loadingStatus) {
    state.loadingOrderHistory = loadingStatus;
  },
  /**
   * @description Stores orderbook
   * @param {*} state
   * @param {object} orderbook
   */
  SET_ORDERBOOK(state, orderbook) {
    state.orderbook = orderbook;
  },

  /**
   * @description Sets whether the orderbook is loading
   * @param {*} state
   * @param {boolean} loadingStatus
   */
  SET_ORDERBOOK_LOADING(state, loadingStatus) {
    state.loadingOrderbook = loadingStatus;
  },

  /**
   * @description Sets current pair shown in orderbook
   * @param {*} state
   * @param {number} pairId
   */
  SET_CURRENT_ORDERBOOK_PAIR(state, pairId) {
    state.currentOrderbookPair = pairId;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
