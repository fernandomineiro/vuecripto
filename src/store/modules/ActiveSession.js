import user from "@/api/user";

const state = {
  uid: sessionStorage.getItem("user-id") || "",
  token: sessionStorage.getItem("user-token") || "",
  access_token: sessionStorage.getItem("access_token") || "",
  refresh_token: sessionStorage.getItem("refresh_token") || "",
  two_factor_method: sessionStorage.getItem("two-factor-method") || null,
  country_code: sessionStorage.getItem("country-code") || null,
  status: "",
  error: {}
};

const getters = {
  isAuthenticated: state => !!state.access_token
};

const actions = {
  authenticate({ commit, dispatch }, payload) {
    commit("requesting");
    const { email, password } = payload;

    return user
      .GetToken(email, password)
      .then(data => {
        sessionStorage.setItem("user-id", data.user_id);
        sessionStorage.setItem("user-token", data.token);
        sessionStorage.setItem("access_token", data.access_token);
        sessionStorage.setItem("refresh_token", data.refresh_token);
        sessionStorage.setItem(
          "two-factor-method",
          data.two_factor_method || ""
        );
        sessionStorage.setItem("country-code", data.country_code);
        commit("success", data);
        dispatch("User/fetchUser", null, { root: true }).catch(err =>
          console.error(err)
        );
        return data;
      })
      .catch(err => {
        commit("error", err);
        return Promise.reject(err);
      });
  },
  setSession({ commit }, payload) {
    commit("success", payload);
  },
  validateToken({ state, getters, dispatch }) {
    if (getters.isAuthenticated) {
      return user
        .GetUser(state.uid)
        .then(() => null)
        .catch(() => {
          dispatch("logout");
          return Promise.reject("expired");
        });
    } else {
      return Promise.reject("unauthorized");
    }
  },
  // refreshToken({ state, getters, dispatch }) {
  //   if (getters.isAuthenticated) {
  //     return user
  //       .RefreshToken(state.refresh_token)
  //       .then(data => {
  //         utils.clearJWTTokensOfLocalStorage();
  //         sessionStorage.setItem("access_token", data.access_token);
  //         sessionStorage.setItem("refresh_token", data.refresh_token);
  //         state.refresh_token = data.refresh_token;
  //         state.access_token = data.access_token;
  //       })
  //       .catch(() => {
  //         dispatch("logout");
  //         return Promise.reject("expired");
  //       });
  //   } else {
  //     return Promise.reject("unauthorized");
  //   }
  // },
  setTwoFaMethod({ commit }, value) {
    sessionStorage.setItem("two-factor-method", value || "");
    commit("SET_TWO_FACTOR_METHOD", value);
  },
  logout({ commit, dispatch }) {
    utils.clearUserPreferencesOfLocalStorage();
    utils.clearStoreUserTokenOfLocalStorage();
    dispatch("Profiles/clearStore", null, { root: true });
    dispatch("UserPreferences/clearStore", null, { root: true });
    commit("logout");
  }
};

const mutations = {
  requesting(state) {
    state.status = "requesting";
  },
  success(state, data) {
    state.status = "success";
    state.uid = data.user_id;
    state.token = data.token;
    state.access_token = data.access_token;
    state.two_factor_method = data.two_factor_method;
    state.country_code = data.country_code;
  },
  error(state, error) {
    state.status = "error";
    state.error = error;
  },
  logout(state) {
    state.uid = null;
    state.token = null;
    state.access_token = null;
    state.status = "unauthorized";
    state.two_factor_method = "";
    state.country_code = null;
  },
  SET_TWO_FACTOR_METHOD(state, value) {
    state.two_factor_method = value;
  }
};

const utils = {
  clearUserPreferencesOfLocalStorage() {
    localStorage.removeItem("user-lang");
    localStorage.removeItem("user-currency");
  },
  clearStoreUserTokenOfLocalStorage() {
    sessionStorage.removeItem("user-id");
    sessionStorage.removeItem("user-token");
    sessionStorage.removeItem("two-factor-method");
    sessionStorage.removeItem("country-code");
  },
  clearJWTTokensOfLocalStorage() {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
