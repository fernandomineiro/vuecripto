import Vue from "vue";
import Vuex from "vuex";
//import createLogger from "vuex/dist/logger";

// Import modules
import ActiveSession from "./modules/ActiveSession";
import Alerts from "./modules/Alerts";
import Profiles from "./modules/Profiles";
import User from "./modules/User";
import Wallets from "./modules/Wallets";
import Currencies from "./modules/Currencies";
import Banks from "./modules/Banks";
import OTC from "./modules/OTC";
import Status from "./modules/Status";
import Referral from "./modules/Referral";
import Types from "./modules/Types";
import DepositMethods from "./modules/DepositMethods";
import Pairs from "./modules/Pairs";
import Indicators from "./modules/Indicators";
import Settings from "./modules/Settings";
import Languages from "./modules/Languages";
import CryptoAddr from "./modules/CryptoAddr";
import Modals from "./modules/Modals";
import UserPreferences from "./modules/UserPreferences";
import Exchange from "./modules/Exchange";
import TwoFactor from "./modules/TwoFactor";
import Avatar from "./modules/Avatar";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    initialized: false
  },
  actions: {
    init({ dispatch, commit }, vm) {
      dispatch("User/fetchUser");
      dispatch("Avatar/fetchAvatar");
      dispatch("Currencies/fetchCurrencies");
      dispatch("Banks/fetchBanks");
      dispatch("OTC/fetchRequests");
      dispatch("Status/fetchStatuses");
      dispatch("Languages/fetchLanguages").then(() => {
        dispatch("UserPreferences/fetchUserPreferences", vm.$i18n);
      });
      dispatch("Types/fetchTypes");
      dispatch("DepositMethods/fetchMethods");
      dispatch("Pairs/fetchPairs");
      dispatch("Wallets/fetchWallets");
      commit("INIT_STORE");
    },
    clearStore({ dispatch }) {
      dispatch("Avatar/clearStore");
      dispatch("Profiles/clearStore");
      dispatch("User/clearStore");
      dispatch("Banks/clearStore");
      dispatch("OTC/clearStore");
      dispatch("Status/clearStore");
      dispatch("Types/clearStore");
      dispatch("DepositMethods/clearStore");
      dispatch("Wallets/clearStore");
    }
  },
  mutations: {
    INIT_STORE(state) {
      state.initialized = true;
    }
  },
  modules: {
    ActiveSession,
    Alerts,
    Avatar,
    Profiles,
    User,
    Wallets,
    Currencies,
    Banks,
    OTC,
    Status,
    Referral,
    Types,
    DepositMethods,
    Pairs,
    Indicators,
    Settings,
    Languages,
    CryptoAddr,
    Modals,
    UserPreferences,
    Exchange,
    TwoFactor
  }
  //plugins: process.env.NODE_ENV !== "production" ? [createLogger()] : []
});
