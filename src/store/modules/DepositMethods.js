import method from "@/api/method";

const state = {
  status: "pristine", // "pristine"| "empty" | "set" | "fetching"| "error"
  loading: false,
  methods: {},
  count: 0,
  lastError: null
};

const getters = {
  isEmpty: state => state.status == "empty",
  isIntialized: state => state.status == "pristine"
};

const actions = {
  fetchMethods({ commit }) {
    commit("fetching");
    return method
      .GetAll()
      .then(methods => {
        if (methods.length) {
          // Convert to object with id as index to help searching
          let methodsObj = {};
          for (const method of methods) {
            methodsObj[method.id] = method;
          }
          commit("setMethods", methodsObj);
          return methods;
        } else {
          commit("empty");
          return [];
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
  clearStore({ commit }) {
    commit("clear");
  }
};

const mutations = {
  setMethods(state, methods) {
    state.methods = methods;
    state.count = methods.length;
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
  clear(state) {
    state.status = "pristine";
    state.loading = false;
    state.methods = {};
    state.count = 0;
    state.lastError = null;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
