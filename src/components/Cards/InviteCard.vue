<template>
  <div class="content">
    <div class="md-layout md-alignment-top-center">
      <div class="md-layout-item md-small-size-100 md-size-50">
        <md-card>
          <md-card-header class="md-card-header-icon md-card-header-blue">
            <div class="card-icon">
              <i class="fas fa-envelope-open-text"></i>
            </div>
            <h4 class="title">{{ $t("configurations.inviteFriend") }}</h4>
          </md-card-header>
          <md-card-content>
            <div class="md-layout md-alignment-top-center">
              <vue-qrcode :value="referralUrl"></vue-qrcode>
            </div>
            <div class="md-layout md-alignment-center-center">
              <md-field class="input-noedit">
                <label>{{ $t("accSettings.inviteLink") }}</label>
                <md-input v-model="referralUrl" readonly></md-input>
              </md-field>
              <a @click="copyToClipboard()" href="#">
                <md-icon>file_copy</md-icon>
              </a>
            </div>
          </md-card-content>
          <md-card-actions class="md-layout md-alignment-top-center">
            <div class="md-layout-item md-size-100">
              <div class="md-layout" :class="`md-alignment-top-center`">
                <h5 class="title">{{ $t("accSettings.shareReferral") }}</h5>
              </div>
              <div class="md-layout" :class="`md-alignment-top-center`">
                <ShareNetwork
                  class="share-network"
                  v-for="network in networks"
                  :network="network.network"
                  :key="network.network"
                  :style="{ backgroundColor: network.color }"
                  :title="$t('accSettings.qrCodeTitle')"
                  :description="$t('accSettings.qrCodeDescription')"
                  :url="referralUrl"
                >
                  <i :class="network.icon"></i>
                </ShareNetwork>
              </div>
              <!-- <md-button class="md-raised md-primary" @click="tooltipActive = !tooltipActive">Toggle Tooltip</md-button> -->
            </div>
          </md-card-actions>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import { ShareNetwork } from "vue-social-sharing";
import VueQrcode from "@chenfengyuan/vue-qrcode";
import { mapState } from "vuex";

export default {
  name: "invite-card",
  data() {
    return {
      tooltipActive: false,
      networks: [
        {
          network: "whatsapp",
          name: "Whatsapp",
          icon: "fab fah fa-2x fa-whatsapp",
          color: "#25d366"
        },
        {
          network: "telegram",
          name: "Telegram",
          icon: "fab fah fa-2x fa-telegram-plane",
          color: "#0088cc"
        },
        {
          network: "twitter",
          name: "Twitter",
          icon: "fab fah fa-2x fa-twitter",
          color: "#1da1f2"
        },
        {
          network: "facebook",
          name: "Facebook",
          icon: "fab fah fa-2x fa-facebook-f",
          color: "#1877f2"
        },
        {
          network: "linkedin",
          name: "LinkedIn",
          icon: "fab fah fa-2x fa-linkedin",
          color: "#007bb5"
        },
        {
          network: "skype",
          name: "Skype",
          icon: "fab fah fa-2x fa-skype",
          color: "#00aff0"
        },
        {
          network: "email",
          name: "Email",
          icon: "far fah fa-2x fa-envelope",
          color: "#333333"
        },
        {
          network: "sms",
          name: "SMS",
          icon: "far fah fa-2x fa-comment-dots",
          color: "#333333"
        }
      ]
    };
  },
  components: {
    ShareNetwork,
    VueQrcode
  },
  computed: {
    ...mapState({
      username: state => state.User.username
    }),
    referralUrl: {
      get() {
        const baseUrl = process.env.VUE_APP_FRONT_URL;
        return `${baseUrl}/#/register/?ref=${this.username}`;
      },
      set(url) {
        return url;
      }
    }
  },
  methods: {
    copyToClipboard: function() {
      this.$copyText(this.referralUrl);
      this.$notify({
        message: this.$t("accSettings.copiedReferrals"),
        icon: "add_alert",
        verticalAlign: "top",
        horizontalAlign: "center"
      });
    }
  }
};
</script>
<style lang="scss">
.text-right {
  display: flex;
}

.copy-button {
  // margin: 2px 2px 2px 2px;
  min-height: 36px;
  min-width: 46px;
  text-align: center;
}

.share-network {
  margin: 2px 2px 2px 2px;
  min-height: 36px;
  min-width: 42px;
  text-align: center;
}

.share-network i {
  color: #ffffff;
  line-height: 1.5;
  display: inline-block;
  vertical-align: middle;
}

.input-noedit {
  max-width: 500px;
  margin-right: 10px;
}

@media screen and (max-width: 1580px) {
  .input-noedit {
    max-width: 300px;
    margin-right: 10px;
  }
}

@media screen and (max-width: 1180px) {
  .input-noedit {
    max-width: 150px;
    margin-right: 40px;
  }
}

@media screen and (max-width: 992px) {
  .input-noedit {
    max-width: 300px;
    margin-right: 10px;
  }
}

@media screen and (max-width: 600px) {
  .input-noedit {
    max-width: 150px;
    margin-right: 40px;
  }
}
</style>
