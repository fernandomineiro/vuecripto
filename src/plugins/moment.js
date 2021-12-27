import moment from "moment";
import { getLocaleDateString } from "@/utils";
const Moment = {};

Moment.install = function(Vue) {
  Vue.prototype.$moment = moment;
  Vue.prototype.$localeDate = srvDate =>
    moment(srvDate).format(getLocaleDateString() + " HH:mm:ss");
};

export default Moment;
