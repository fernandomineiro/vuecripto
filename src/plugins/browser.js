import { detect } from "detect-browser";
const Browser = {};

const mobileOSs = ["iOS", "Android OS"];

Browser.install = function(Vue) {
  Object.defineProperties(Vue.prototype, {
    $browser: {
      get: () => detect()
    },
    $device: {
      get: () => {
        const { os } = detect();
        return mobileOSs.some(x => x == os) ? "mobile" : "desktop";
      }
    },
    $os: {
      get: () => {
        const { os } = detect();
        return os;
      }
    }
  });
};

export default Browser;
