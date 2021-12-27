<template>
  <md-card>
    <md-card-header class="md-card-header-danger">
      <h4>{{ $t("configurations.affiliatesSystem") }}</h4>
      <p class="md-card-category">{{ $t("configurations.subtitle") }}</p>
    </md-card-header>
    <md-card-content>
      <md-table md-fixed-header>
        <md-table-row>
          <md-table-head></md-table-head>
          <md-table-head class="text-center">Trader</md-table-head>
          <md-table-head class="text-center">Broker</md-table-head>
        </md-table-row>
        <md-table-row>
          <md-table-cell>
            {{ $t("configurations.referral_link") }}
          </md-table-cell>
          <md-table-cell class="text-center">
            <i class="fa fa-times text-danger"></i>
          </md-table-cell>
          <md-table-cell class="text-center">
            <i class="fa fa-check text-success"></i>
          </md-table-cell>
        </md-table-row>
        <md-table-row>
          <md-table-cell>
            {{ $t("configurations.directEarnins") }}
          </md-table-cell>
          <md-table-cell class="text-center">
            <i class="fa fa-times text-danger"></i>
          </md-table-cell>
          <md-table-cell class="text-center">15%</md-table-cell>
        </md-table-row>
        <md-table-row>
          <md-table-cell>{{ $t("configurations.support") }}</md-table-cell>
          <md-table-cell class="text-center">
            <i class="fa fa-times text-danger"></i>
          </md-table-cell>
          <md-table-cell class="text-center">
            <i class="fa fa-times text-danger"></i>
          </md-table-cell>
        </md-table-row>
        <md-table-row>
          <md-table-cell>{{ $t("configurations.price") }}</md-table-cell>
          <md-table-cell class="text-center">
            {{ $t("configurations.free") }}
          </md-table-cell>
          <md-table-cell class="text-center">
            {{ $t("configurations.contactUs") }}
          </md-table-cell>
        </md-table-row>
        <md-table-row>
          <md-table-cell></md-table-cell>
          <md-table-cell>
            <md-button :class="btnClass(1)" :disabled="userType == 1">
              Atual
            </md-button>
          </md-table-cell>
          <md-table-cell>
            <sync-loader color="#999999" v-if="loading" />
            <md-button :class="btnClass(2)" @click="upgrade(2)" v-else>
              {{ $t("configurations.contactUs") }}
            </md-button>
          </md-table-cell>
        </md-table-row>
      </md-table>
    </md-card-content>
  </md-card>
</template>

<script>
import { mapState } from "vuex";
import user from "@/api/user";
import SyncLoader from "vue-spinner/src/SyncLoader";

export default {
  name: "affiliates-plans",
  components: {
    SyncLoader
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    ...mapState({
      userType: state => state.User.user_type_id
    })
  },
  methods: {
    btnClass(userType) {
      return {
        "md-simple": userType == this.userType,
        "md-danger": userType != this.userType
      };
    },
    upgrade(user_type_id) {
      this.loading = true;
      user
        .RequestUpgrade(user_type_id, this.$store.state.ActiveSession.token)
        .then(() =>
          this.$store.dispatch("Alerts/alertUser", {
            title: this.$t("success"),
            message: this.$t("configurations.requestUpgradeSuccess")
          })
        )
        .catch(err =>
          this.$store.dispatch("Alerts/alertUser", {
            title: this.$t("error"),
            message: this.$t(`api.user.${err.statusString}`)
          })
        )
        .finally(() => (this.loading = false));
    }
  }
};
</script>

<style scoped>
.md-card-header > h4 {
  font-weight: 700;
  margin-top: 10px;
  margin-bottom: 10px;
}
.md-card-header {
  color: #fff;
}
.md-card-header > h4 {
  font-weight: 700;
  margin-top: 10px;
  margin-bottom: 10px;
}
.md-table-head {
  font-size: 1.063rem;
}
.md-table-cell-container .md-button {
  width: 100%;
  height: 36px;
}
</style>
