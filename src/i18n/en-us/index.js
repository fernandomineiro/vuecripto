import accSettings from "./accSettings";
import api from "./api";
import cookies from "./cookies";
import configurations from "./configurations";
import common from "./common";
import dashboard from "./dashboard";
import disclaimer from "./disclaimer";
import downloadModal from "./downloadModal";
import footer from "./footer";
import invoices from "./invoices";
import login from "./login";
import navbar from "./navbar";
import otc from "./otc";
import pages from "./pages";
import password from "./password";
import profile from "./profile";
import recover from "./recover";
import register from "./register";
import statuses from "./statuses";
import trade from "./trade";
import twoFa from "./twoFa";
import wallets from "./wallets";
import wizard from "./wizard";
import exchange from "./exchange";

export const enUs = {
  accSettings,
  api,
  cookies,
  configurations,
  ...common,
  crypto: {
    address: "Withdraw address",
    fee: "Withdraw fee",
    total: "Total amount (Withdraw + Fee)"
  },
  dashboard,
  exchange,
  disclaimer,
  downloadModal,
  footer,
  invoices,
  login,
  modal: {
    forgotPassword: {
      submit: "Start password recovery"
    }
  },
  navbar,
  otc,
  pages,
  password,
  profile,
  recover,
  register,
  statuses,
  trade,
  twoFa,
  wallets,
  wizard
};
