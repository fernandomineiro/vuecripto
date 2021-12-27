<template>
  <md-toolbar
    md-elevation="0"
    class="md-transparent"
    :class="{
      'md-toolbar-absolute md-white md-fixed-top': $route.meta.navbarAbsolute
    }"
  >
    <div class="md-toolbar-row">
      <div class="md-toolbar-section-start">
        <h3 class="md-title">{{ this.$t("pages." + this.$route.name) }}</h3>
      </div>
      <div
        class="md-toolbar-section-start indicators"
        v-if="$device == 'desktop'"
      >
        <indicators-marquee />
      </div>
      <div class="md-toolbar-section-end" id="TopMenu">
        <md-button
          class="md-just-icon md-round md-simple md-toolbar-toggle"
          :class="{ toggled: $sidebar.showSidebar }"
          @click="toggleSidebar"
        >
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </md-button>

        <!-- Top menu -->
        <div class="md-collapse">
          <update-entry-disclaimer v-if="!hasJob" />
          <!-- <div class="md-autocomplete">
            <md-autocomplete
              class="search"
              v-model="selectedEmployee"
              :md-options="employees"
              :md-open-on-focus="false"
            >
              <label v-if="$route.meta.rtlActive">بحث...</label>
              <label v-else>Search...</label>
            </md-autocomplete>
          </div> -->
          <!-- Currency selector -->
          <currency-selector />
          <!-- Language selector -->
          <lang-selector />

          <drop-down class="user-menu" direction="down">
            <md-button
              slot="title"
              class="user-info md-simple md-info md-sm dropdown-toggle"
              data-toggle="dropdown"
            >
              <!-- User avatar -->
              <Avatar v-if="user.id" :user="user" class="my-auto" />

              <!-- Username -->
              <span class="user-name">{{ username }}</span>
            </md-button>
            <ul class="dropdown-menu dropdown-menu-right">
              <li>
                <router-link to="/profile">
                  <i class="material-icons">person</i>
                  {{ $t("navbar.profile") }}
                </router-link>
              </li>
              <li>
                <router-link to="/configurations">
                  <i class="material-icons">settings</i>
                  {{ $t("navbar.options") }}
                </router-link>
              </li>
              <li>
                <a href="#" @click.prevent="showPasswordModal">
                  <i class="fas fa-key"></i>
                  {{ $t("changePassword") }}
                </a>
              </li>
              <li>
                <a href="#" @click.prevent="logout">
                  <i class="material-icons">highlight_off</i>
                  {{ $t("navbar.logout") }}
                </a>
              </li>
            </ul>
          </drop-down>
        </div>
      </div>
    </div>
  </md-toolbar>
</template>

<script>
import updateJobDisclaimer from "@/mixins/updateJobDisclaimer";
import {
  Avatar,
  LangSelector,
  CurrencySelector,
  UpdateEntryDisclaimer,
  IndicatorsMarquee
} from "@/components";
import { mapState, mapActions } from "vuex";
import getUsernameFromEmail from "@/utils/getUsernameFromEmail";

export default {
  mixins: [updateJobDisclaimer],
  components: {
    Avatar,
    LangSelector,
    CurrencySelector,
    UpdateEntryDisclaimer,
    IndicatorsMarquee
  },
  computed: {
    ...mapState({
      user: state => state.User
    }),

    /**
     * The username used to iddentify the user of the session
     *
     * Consists of the part before the at of the user's e-mail
     */
    username() {
      return getUsernameFromEmail(this.user.email);
    }
  },
  methods: {
    ...mapActions({
      showPasswordModal: "Modals/launchChangePassword",
      alertUser: "Alerts/alertUser",
      hideAlert: "Alerts/hide"
    }),
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
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
    }
  }
};
</script>

<style lang="scss">
.user-menu {
  display: flex;
  & .dropdown-menu li i {
    margin-right: 0.5rem;
  }
}
.user-info {
  align-self: center;
}
.user-name {
  margin-left: 0.5rem;
}
.indicators {
  flex-basis: auto;
  flex-shrink: 1;
  overflow: hidden;
}
#TopMenu {
  min-width: max-content;
}
</style>
