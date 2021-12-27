const Tawk = {};

Tawk.install = Vue =>
  Object.defineProperty(Vue.prototype, "$tawk", {
    get: () => window.Tawk_Api || false
  });

export default Tawk;
