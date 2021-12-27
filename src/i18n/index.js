import Vue from "vue";
import VueI18n from "vue-i18n";

import { ptBr } from "./pt-br";
import { enUs } from "./en-us";
import locale from "./settings";
Vue.use(VueI18n);

export default new VueI18n({
  locale,
  messages: {
    "pt-br": ptBr,
    "en-us": enUs
  }
});
