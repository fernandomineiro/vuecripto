import accSettings from "./accSettings";
import api from "./api";
import cookies from "./cookies";
import configurations from "./configurations";
import common from "./common";
import dashboard from "./dashboard";
import disclaimer from "./disclaimer";
import downloadModal from "./downloadModal";
import exchange from "./exchange";
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

export const ptBr = {
  accSettings,
  api,
  cookies,
  configurations,
  ...common,
  crypto: {
    address: "Endereço de saque",
    fee: "Taxa de Saque",
    total: "Valor a ser debitado (Valor do Saque + Taxa)"
  },
  dashboard,
  disclaimer,
  downloadModal,
  exchange,
  footer,
  invoices,
  login,
  modal: {
    forgotPassword: {
      submit: "Iniciar recuperação de senha"
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
