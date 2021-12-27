<template>
  <form autocomplete="off" @submit.prevent="requestOtc">
    <modal v-if="!alert">
      <template slot="header">
        <h4 class="modal-title">
          {{
            $t("otc.request.createPairOtcRequest", {
              base: pairInfo.coin_base,
              quote: pairInfo.coin_quote
            })
          }}
        </h4>
        <md-button
          class="md-simple md-just-icon md-round modal-default-button"
          @click="$emit('close')"
        >
          <md-icon>clear</md-icon>
        </md-button>
      </template>
      <template slot="body">
        <div class="md-layout">
          <div class="md-layout-item md-xsmall-100 md-size-50 md-caption">
            {{ $t("balance", { cur: pairInfo.coin_base }) }}: {{ baseBalance }}
          </div>
          <div class="md-layout-item md-xsmall-100 md-size-50 md-caption">
            {{ $t("balance", { cur: pairInfo.coin_quote }) }}:
            {{ quoteBalance }}
          </div>
        </div>
        <md-radio v-model="requestForm.otc_type_id" :value="1">
          {{ $t("buy") }}
        </md-radio>
        <md-radio v-model="requestForm.otc_type_id" :value="2">
          {{ $t("sell") }}
        </md-radio>
        <md-field :class="{ 'md-error': errors.has('amount') }">
          <label>{{ $t("otc.request.amountTo") }} {{ opType }}</label>
          <md-input
            type="number"
            min="0.00000001"
            step="0.00000001"
            v-model="requestForm.amount"
            @keyup="calcTotal"
            v-validate="'required'"
            name="amount"
          ></md-input>
          <span class="md-suffix">{{ pairInfo.coin_base }}</span>
        </md-field>
        <md-field :class="{ 'md-error': errors.has('price') }">
          <label>{{ $t("otc.request.priceForEach") }}</label>
          <md-input
            type="number"
            min="0.01"
            step="0.01"
            v-model="requestForm.price"
            @keyup="calcTotal"
            name="price"
            v-validate="price_validation"
          ></md-input>
          <span class="md-suffix">{{ pairInfo.coin_quote }}</span>
        </md-field>
        <md-field>
          <label>{{ $t("otc.request.totalTo") }} {{ actionType }}</label>
          <md-input
            type="number"
            min="0"
            v-model="formTotal"
            @keyup="calcAmount"
          >
          </md-input>
          <span class="md-suffix">{{ pairInfo.coin_quote }}</span>
          <span class="md-helper-text">
            {{ $t("minimum") }}: {{ minTotal }} {{ this.pairInfo.coin_quote }}
          </span>
        </md-field>

        <md-field :class="{ 'md-error': !isTimeValid }">
          <label>{{ $t("otc.request.expiresAt") }}</label>
          <datetime-input
            v-model="requestForm.expire_at"
            type="time"
            name="expireAt"
            :valid.sync="isTimeValid"
          />
        </md-field>

        <!-- Error's warnings -->
        <div v-if="warning.minTotal">
          <md-icon class="text-warning">warning</md-icon>
          {{ minTotalWarning }}
        </div>
        <template v-if="errors.has('price')">
          <div v-if="warning.minBuyPrice">
            <md-icon class="text-warning">warning</md-icon>
            {{ minBuyPriceWarning }}
          </div>
          <div v-if="warning.maxSellPrice">
            <md-icon class="text-warning">warning</md-icon>
            {{ maxSellPriceWarning }}
          </div>
        </template>
        <div v-if="warning.timeOffBounds">
          <md-icon class="text-warning">warning</md-icon>
          {{ $t("otc.request.timeOffBounds") }}
        </div>
      </template>
      <sync-loader color="#999999" slot="footer" v-if="loading" />
      <md-button class="md-danger" type="submit" slot="footer" v-else>
        {{ $t("otc.request.requestOtc") }}
      </md-button>
    </modal>
  </form>
</template>

<script>
import otcRequest from "@/mixins/otcRequest";
import { Modal, DatetimeInput } from "@/components";
import currencyDecimalFormat from "@/mixins/currencyDecimalFormat";
import SyncLoader from "vue-spinner/src/SyncLoader";
import otc from "@/api/otc";
import moment from "moment";
import { mapState } from "vuex";

export default {
  name: "request-modal",
  mixins: [otcRequest, currencyDecimalFormat],
  components: {
    Modal,
    DatetimeInput,
    SyncLoader
  },
  data() {
    return {
      requestForm: {
        pair_id: this.pairInfo.id,
        otc_type_id: 1,
        expire_at: null
      },
      formTotal: null,
      alert: false,
      loading: false,
      isTimeValid: true
    };
  },
  props: {
    pairInfo: {
      type: Object,
      default: () => ({
        id: 1,
        coin_base: "BTC",
        coin_quote: "BRL",
        coin_base_id: 5,
        coin_quote_id: 11
      })
    }
  },
  computed: {
    ...mapState({
      currencies: state => state.Currencies.currencies
    }),
    opType() {
      return (this.requestForm.otc_type_id == 1
        ? this.$t("buy")
        : this.$t("sell")
      ).toLowerCase();
    },
    actionType() {
      return (this.requestForm.otc_type_id == 1
        ? this.$t("spend")
        : this.$t("receive")
      ).toLowerCase();
    },
    price_validation() {
      return (
        "required|decimal|" +
        (this.requestForm.otc_type_id == 1
          ? `min_value:${this.minBuyPrice}`
          : `max_value:${this.maxSellPrice}`)
      );
    },

    /**
     * @description Gets formated balance of base currency wallet
     * @type {string}
     */
    baseBalance() {
      return this.formatCurrencyValue(
        this.walletBase.balance,
        this.walletBase.currency_id
      );
    },

    /**
     * @description Gets formated balance of quoted currency wallet
     * @type {string}
     */
    quoteBalance() {
      return this.formatCurrencyValue(
        this.walletQuote.balance,
        this.walletQuote.currency_id
      );
    },
    settings() {
      return this.otcSettings.find(x => x.id == this.pairInfo.id);
    }
  },
  methods: {
    calcTotal() {
      const amount = Number(this.requestForm.amount),
        price = Number(this.requestForm.price);

      this.formTotal =
        this.requestForm.amount && this.requestForm.price
          ? (amount * price).toFixed(2)
          : null;
    },
    calcAmount() {
      const total = Number(this.formTotal),
        price = Number(this.requestForm.price);

      this.requestForm.amount =
        this.formTotal && this.requestForm.price
          ? (total / price).toFixed(8)
          : null;
    },
    async requestOtc() {
      if ((await this.$validator.validate()) && this.isTimeValid) {
        this.loading = true;

        const expire_at =
          moment(new Date()).format("YYYY-MM-DD") +
          ` ${this.requestForm.expire_at}:00`;

        otc
          .CreateRequest(
            this.pairInfo.id,
            this.requestForm.price,
            this.requestForm.amount,
            this.requestForm.otc_type_id,
            expire_at,
            this.$store.state.ActiveSession.token
          )
          .then(() => {
            this.$store.dispatch("OTC/fetchRequests");
            this.$emit("close");
          })
          .catch(err => {
            this.alert = true;
            this.$store.dispatch("Alerts/alertUser", {
              title: this.$t("error"),
              message: this.$t(`api.otc.${err.statusString}`),
              onClose: () => (this.alert = false)
            });
          })
          .finally(() => (this.loading = false));
      } else {
        this.alert = true;
        this.$store.dispatch("Alerts/alertUser", {
          title: this.$t("error"),
          message: this.$t("verifyFormErrors"),
          onClose: () => (this.alert = false)
        });
      }
    }
  },
  created() {
    this.$store.dispatch("Wallets/fetchWallets");
  }
};
</script>
