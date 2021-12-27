import Vue from "vue";
import VueRouter from "vue-router";
import DashboardPlugin from "./material-dashboard";
import store from "./store";
import VueTheMask from "vue-the-mask";
import VMoney from "v-money";
import { Validator } from "vee-validate";
import Cryptoicon from "vue-cryptoicon";
import icons from "vue-cryptoicon/src/icons";
import EvaIcons from 'vue-eva-icons';

// Plugins
import App from "./App.vue";
import Chartist from "chartist";
import Browser from "@/plugins/browser";
import Moment from "@/plugins/moment";
import Ion from "@/plugins/ion";
import Tawk from "@/plugins/tawk";

// router setup
import routes from "./routes/routes";

// Internationalization setup
import i18n from "./i18n";

import VueClipboard from "vue-clipboard2";

// Crypto address validation
import cryptoValidator from "@/utils/validator/cryptoAddr";
Validator.extend("crypto", cryptoValidator);

// CPF and CNPJ validation
import cpfValidator from "@/utils/validator/cpf";
import cnpjValidator from "@/utils/validator/cnpj";
Validator.extend("cpf", cpfValidator);
Validator.extend("cnpj", cnpjValidator);

import "vue-tel-input/dist/vue-tel-input.css";
// plugin setup
Vue.use(VueRouter);
Vue.use(DashboardPlugin);
Vue.use(VueTheMask);
Vue.use(VMoney);
Vue.use(Browser);
Vue.use(Moment);
Vue.use(Ion);
Vue.use(Tawk);
Vue.use(EvaIcons);

VueClipboard.config.autoSetContainer = true; // add this line
Vue.use(VueClipboard);

Cryptoicon.add(icons);
Vue.use(Cryptoicon);

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkExactActiveClass: "nav-item active"
});

// global library setup
Object.defineProperty(Vue.prototype, "$Chartist", {
  get() {
    return this.$root.Chartist;
  }
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: h => h(App),
  router,
  i18n,
  store,
  data: {
    Chartist: Chartist
  }
});
