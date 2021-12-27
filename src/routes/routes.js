// Layouts
import DashboardLayout from "@/layouts/DashboardLayout";
import AuthLayout from "@/layouts/AuthLayout";

// User area pages
import Affiliate from "@/pages/Affiliate";
import Dashboard from "@/pages/Dashboard";
import Wallets from "@/pages/Wallets";
import Ledger from "@/pages/Ledger";
import Settings from "@/pages/Settings";
import Otc from "@/pages/OTC";
import TurboSwap from "@/pages/Turboswap";
import Profile from "@/pages/Profile";
import Marketing from "@/pages/Marketing";

// Error pages
import NotFound from "@/pages/NotFound";

// Auth pages
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import PwdRecovery from "@/pages/PwdRecovery";

// import Wizard from "@/pages/Wizard";
import Wizard from "@/pages/Wizard";
import DocumentStep from "@/pages/Wizard/DocumentsStep";

// Mobile Wizards
import MWOtc from "@/pages/MobileWizard/Otc";
import MWSwap from "@/pages/MobileWizard/Swap";
import MWWithdraw from "@/pages/MobileWizard/Withdraw";
import MWAddFiatAccount from "@/pages/MobileWizard/AddFiatAccount";

import Tos from "@/pages/Tos";

let authPages = {
  path: "/",
  component: AuthLayout,
  name: "Authentication",
  children: [
    {
      path: "/login",
      name: "Login",
      component: Login,
      props: function(route) {
        return { reference: route.query.alert };
      }
    },
    {
      path: "/register",
      name: "Register",
      component: Register,
      props: function(route) {
        return { referral: route.query.ref };
      }
    },
    {
      path: "/recover",
      name: "PasswordRecovery",
      component: PwdRecovery,
      props: function(route) {
        return { reference: route.query.ref };
      }
    }
  ]
};

const routes = [
  {
    path: "/",
    redirect: "/dashboard",
    name: "Home"
  },
  {
    path: "/tos",
    name: "Tos",
    components: { default: Tos }
  },
  authPages,
  {
    path: "/",
    component: DashboardLayout,
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        components: { default: Dashboard }
      },
      {
        path: "complete-registration",
        name: "Wizard",
        component: Wizard
      },
      {
        path: "wizard-document",
        name: "DocumentStep",
        component: DocumentStep
      },
      {
        path: "profile",
        name: "Profile",
        components: { default: Profile }
      },
      {
        path: "wallets",
        name: "Wallets",
        components: { default: Wallets }
      },
      {
        path: "invoices/:page?",
        name: "Invoices",
        components: { default: Ledger }
      },
      {
        path: "configurations",
        name: "Configurations",
        components: { default: Settings }
      },
      {
        path: "otc",
        name: "OTC",
        components: { default: Otc }
      },
      {
        path: "turboswap",
        name: "TurboSwap",
        components: { default: TurboSwap }
      },
      {
        path: "marketing",
        name: "Marketing",
        components: { default: Marketing }
      },
      {
        path: "affiliate",
        name: "Affiliate",
        components: { default: Affiliate }
      },
      {
        path: "/mobile-wizard/otc",
        name: "MobileWizardOTC",
        components: { default: MWOtc }
      },
      {
        path: "/mobile-wizard/swap",
        name: "MobileWizardSwap",
        components: { default: MWSwap }
      },
      {
        path: "/mobile-wizard/withdraw",
        name: "MobileWizardWithdraw",
        components: { default: MWWithdraw }
      },
      {
        path: "/mobile-wizard/add-fiat-account",
        name: "MobileWizardAddFiatAccount",
        components: { default: MWAddFiatAccount }
      },
      {
        path: "*",
        name: "NotFound",
        components: { default: NotFound }
      }
    ]
  }
];

export default routes;
