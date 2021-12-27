/**
 * @file @plugins/ion.js
 * @description Wraps Ion.Sound plugin as a Vue global instance
 * @exports Ion
 */

import "ion-sound/js/ion.sound.min.js";

const Ion = {};

const sounds = [
  { name: "cash_register" },
  { name: "cash_machine", volume: 7.0 }
];
const soundsPath = "sound/";

Ion.install = function(Vue) {
  // Register ion as instance object
  Object.defineProperty(Vue.prototype, "$ion", {
    get: () => window.ion
  });

  // Creates sound library
  window.ion.sound({
    sounds,
    path: soundsPath
  });
};

export default Ion;
