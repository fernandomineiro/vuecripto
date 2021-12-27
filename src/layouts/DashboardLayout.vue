<template>
  <div
    class="wrapper"
    :class="[
      { 'nav-open': $sidebar.showSidebar },
      { rtl: $route.meta.rtlActive }
    ]"
  >
    <tawk />
    <notifications></notifications>

    <!-- MODALS -->
    <alert
      :title="alert.title"
      :message="alert.message"
      v-if="alert.show"
      @click="hideAlert"
    />
    <change-password-modal
      @close="hidePasswordModal"
      v-if="passwordModalShow"
    />

    <two-fa-modal v-if="twoFaModalShow" />

    <change-two-fa-modal v-if="changeTwoFaModalShow" @close="hideTwoFaModal" />

    <qr-code-login-modal
      @close="hideQrCodeLoginModal"
      v-if="qrCodeLoginModalShow"
    />

    <!-- SIDEBAR -->
    <side-bar
      :active-color="sidebarBackground"
      :data-background-color="sidebarBackgroundColor"
      logo="./cda-icon-blue.png"
      :title="companyName"
    >
      <mobile-menu />
      <template slot="links">
        <sidebar-item
          :link="{
            name: $t('navbar.dashboard'),
            icon: 'dashboard',
            path: '/dashboard'
          }"
        ></sidebar-item>
        <sidebar-item
          :link="{
            name: $t('navbar.wallets'),
            icon: 'account_balance_wallet',
            path: '/wallets'
          }"
        ></sidebar-item>
        <sidebar-item
          :link="{ name: $t('navbar.ledger'), icon: 'list', path: '/invoices' }"
        ></sidebar-item>
        <sidebar-item
          :link="{
            name: $t('navbar.turboSwap'),
            icon: 'swap_horiz',
            path: '/turboswap'
          }"
        />
        <sidebar-item
          :link="{
            name: $t('navbar.marketing'),
            icon: 'share',
            path: '/marketing'
          }"
        />
        <sidebar-item
          :link="{
            name: $t('navbar.affiliate'),
            icon: 'supervisor_account',
            path: '/affiliate'
          }"
        />
        <li>
          <a href="#" class="nav-link" @click.prevent="launchQrCodeLoginModal">
            <i class="md-icon md-icon-font md-theme-default">phonelink</i>
            <p>{{ $t("navbar.qrCodeLogin") }}</p>
          </a>
        </li>
        <li>
          <a href="#" class="nav-link" @click.prevent="logout">
            <i class="md-icon md-icon-font md-theme-default">highlight_off</i>
            <p>{{ $t("navbar.logout") }}</p>
          </a>
        </li>
      </template>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>
      <div v-if="$device == 'mobile'">
        <indicators-marquee />
      </div>
      <div
        :class="{ content: !$route.meta.hideContent }"
        @click="toggleSidebar"
      >
        <zoom-center-transition :duration="200" mode="out-in">
          <!-- your content here -->
          <router-view></router-view>
        </zoom-center-transition>
      </div>
      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-new */
import mixinDocuments from "@/mixins/documents";
import mixinDepositListener from "@/mixins/wsDepositListener";
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import { mapActions, mapState } from "vuex";

function hasElement(className) {
  return document.getElementsByClassName(className).length > 0;
}

function initScrollbar(className) {
  if (hasElement(className)) {
    new PerfectScrollbar(`.${className}`);
  } else {
    // try to init it later in case this component is loaded async
    setTimeout(() => {
      initScrollbar(className);
    }, 100);
  }
}

import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import MobileMenu from "./Extra/MobileMenu.vue";
import Alert from "@/components/Modals/Alert.vue";
import Tawk from "@/components/Tawk.vue";
import ChangePasswordModal from "@/components/Modals/ChangePasswordModal.vue";
import IndicatorsMarquee from "@/components/IndicatorsMarquee";
import { ZoomCenterTransition } from "vue2-transitions";
import QrCodeLoginModal from "@/components/Modals/QrCodeLoginModal.vue";
import TwoFaModal from "@/components/Modals/TwoFaModal";
import ChangeTwoFaModal from "@/components/Modals/ChangeTwoFaModal";


export default {
  components: {
    TopNavbar,
    ContentFooter,
    MobileMenu,
    ZoomCenterTransition,
    Alert,
    Tawk,
    ChangePasswordModal,
    IndicatorsMarquee,
    QrCodeLoginModal,
    TwoFaModal,
    ChangeTwoFaModal
  },
  mixins: [mixinDocuments, mixinDepositListener],
  data() {
    return {
      sidebarBackgroundColor: "black",
      sidebarBackground: "azure",
      sidebarBackgroundImage: "./img/sidebar-2.jpg",
      sidebarMini: true,
      sidebarImg: true,
      sessionValidateInterval: null,

      /**
       * @description Flag for KYC check was executed
       */
      kycChecked: false
    };
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
    minimizeSidebar() {
      if (this.$sidebar) {
        this.$sidebar.toggleMinimize();
      }
    },
    logout() {
      this.$store.dispatch("ActiveSession/logout");
      this.alertUser({
        title: this.$t("alert"),
        message: this.$t("dashboard.loggedOut"),
        onClose: () => {
          window.location = process.env.VUE_APP_COMPANY_URL;
        }
      });
      setTimeout(() => {
        this.hideAlert();
      }, 5000);
    },
    validateSession() {
      this.$store
        .dispatch("ActiveSession/validateToken")
        .then(() => null)
        .catch(eType => {
          if (eType == "expired") {
            this.$router.push("/login?alert=sessionExpired");
          } else {
            this.$router.push("/login?alert=unauthorized");
          }
        });
    },

    /**
     * @description Checks if KYC is complete, redirects to KYC wizard if not
     */
    checkKyc() {
      this.$store.dispatch("Profiles/fetchProfiles").then(res => {
        if (
          !JSON.parse(this.skipWizard) &&
          !(
            res &&
            typeof res.fullname == "string" &&
            res.fullname.length &&
            ((typeof res.postal_code == "string" && res.postal_code.length) ||
              (typeof res.address_line_one == "string" &&
                res.address_line_one.length)) &&
            this.hasRequiredDocs
          )
        ) {
          this.$router.push("/complete-registration");
        }
      });
    },
    ...mapActions({
      alertUser: "Alerts/alertUser",
      hideAlert: "Alerts/hide",
      hidePasswordModal: "Modals/hideChangePassword",
      hideQrCodeLoginModal: "Modals/hideQrCodeLogin",
      launchQrCodeLoginModal: "Modals/launchQrCodeLogin",
      hideTwoFaModal: "Modals/hideChangeTwoFa"
    })
  },
  computed: {
    ...mapState({
      alert: state => state.Alerts,
      passwordModalShow: state => state.Modals.changePassword.show,
      qrCodeLoginModalShow: state => state.Modals.qrCodeLogin.show,
      twoFaModalShow: state => state.TwoFactor.show,
      changeTwoFaModalShow: state => state.Modals.changeTwoFa.show,
      skipWizard: state => state.Profiles.skipWizard
    }),
    companyName() {
      return process.env.VUE_APP_COMPANY_PARCIAL_NAME;
    }
  },
  mounted() {
    let docClasses = document.body.classList;
    let isWindows = navigator.platform.startsWith("Win");
    if (isWindows) {
      // if we are on windows OS we activate the perfectScrollbar function
      initScrollbar("sidebar");
      initScrollbar("sidebar-wrapper");
      initScrollbar("main-panel");

      docClasses.add("perfect-scrollbar-on");
    } else {
      docClasses.add("perfect-scrollbar-off");
    }
  },
  watch: {
    sidebarMini() {
      this.minimizeSidebar();
    },

    /**
     * @description Watches for documents loading to trigger KYC check
     */
    documents(value) {
      if (!this.kycChecked && value) {
        this.checkKyc();
        this.kycChecked = true;
      }
    }
  },
  created() {
    this.validateSession();

    // Check for token validity every minute
    this.sessionValidateInterval = setInterval(() => {
      this.validateSession();
    }, 10000);

    // Check if KYC is complete if documents and documentTypes are loaded
    if (!this.kycChecked && this.documents) {
      this.checkKyc();
      this.kycChecked = true;
    }

    // Get user info if not stored
    if (
      !this.$store.state.initialized &&
      this.$store.getters["ActiveSession/isAuthenticated"]
    ) {
      this.$store.dispatch("init", this);
    }
  },
  beforeDestroy() {
    clearInterval(this.sessionValidateInterval);
  }
};
</script>
<style lang="scss">
$scaleSize: 0.95;
@keyframes zoomIn95 {
  from {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
  to {
    opacity: 1;
  }
}
.main-panel .zoomIn {
  animation-name: zoomIn95;
}
@keyframes zoomOut95 {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
}
.main-panel .zoomOut {
  animation-name: zoomOut95;
}
.main-panel > .content {
  min-height: calc(100vh - 133px) !important;
}
</style>
