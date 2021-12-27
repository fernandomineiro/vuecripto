<template>
  <div class="md-layout">
    <div class="md-layout-item md-size-100">
      <div class="text-center mt-4" v-if="!isStoreLoaded">
        <sync-loader color="#999999" />
      </div>
      <div class="text-center" v-else-if="success">
        <i class="far fa-check-circle text-success" id="success-icon"></i>
        <h3>{{ $t("trade.request.success") }}</h3>
        <md-card>
          <md-card-content>
            <invoice-table />
          </md-card-content>
        </md-card>
        <router-link to="/turboswap">
          <md-button class="md-danger md-lg md-raised">
            {{ $t("trade.request.returnToSwap") }}
          </md-button>
        </router-link>
      </div>
      <md-card v-else-if="tradePair">
        <md-card-content>
          <div>
            {{ $t("balance", { cur: getCurrencySymbol(baseCurrencyTitle) }) }}:
            <pulse-loader
              class="field-spinner"
              color="#999999"
              size="8px"
              v-if="!(wallets || wallets.length)"
            />
            <template v-else>
              {{ baseBalance }}
            </template>
          </div>
          <div>
            {{ $t("balance", { cur: getCurrencySymbol(quoteCurrencyTitle) }) }}:
            <pulse-loader
              class="field-spinner"
              color="#999999"
              size="8px"
              v-if="!(wallets || wallets.length)"
            />
            <template v-else>
              {{ quoteBalance }}
            </template>
          </div>

          <md-steppers
            class="text-center"
            md-vertical
            md-linear
            md-dynamic-height
            :md-active-step.sync="step"
          >
            <md-step
              id="MWSwap-op-select"
              :md-done.sync="stepsDone.opSelect"
              :md-label="$t('trade.request.buyOrSell')"
            >
              {{ $t("trade.request.iWantTo") }}
              <div class="side-options mt-4">
                <md-button class="md-success" @click="setSide('buy')">
                  {{ $t("buy") }}
                </md-button>
                <md-button class="md-danger" @click="setSide('sell')">
                  {{ $t("sell") }}
                </md-button>
              </div>
            </md-step>
            <md-step
              id="MWSwap-amount"
              :md-done.sync="stepsDone.amount"
              :md-label="$t('otc.request.amountAndPrice')"
            >
              {{
                $t("trade.request.iWantToX", {
                  do:
                    requestForm.side == "buy"
                      ? $t("buy").toLowerCase()
                      : $t("sell").toLowerCase()
                })
              }}
              <md-field :class="{ 'md-error': errors.has('amount') }">
                <label>{{ $t("amount") }}</label>
                <md-input
                  type="number"
                  step="0.00000001"
                  v-model="requestForm.amount"
                  v-validate="'decimal'"
                  name="amount"
                  @focus="() => (requestForm.total = null)"
                />
                <span class="md-suffix">
                  <currency-symbol :currency="baseCurrencyTitle" />
                </span>
              </md-field>

              <md-field :class="{ 'md-error': errors.has('total') }">
                <label>{{ $t("total") }}</label>
                <md-input
                  type="number"
                  step="0.01"
                  v-model="requestForm.total"
                  v-validate="'decimal'"
                  name="total"
                  @focus="() => (requestForm.amount = null)"
                />
                <span class="md-suffix">
                  <currency-symbol :currency="quoteCurrencyTitle" />
                </span>
              </md-field>

              {{ $t("trade.request.atTheUnitaryPriceOf") }}
              <h4>
                {{ price }}
                <currency-symbol :currency="quoteCurrencyTitle" />
              </h4>

              <!-- Form warnings -->
              <div v-if="warning.minSellAmount">
                <md-icon class="text-warning">warning</md-icon>
                {{ minSellAmountWarning }}
              </div>
              <div v-if="warning.minBuyTotal">
                <md-icon class="text-warning">warning</md-icon>
                {{ minBuyTotalWarning }}
              </div>
              <div v-if="warning.maxBuyTotal">
                <md-icon class="text-warning">warning</md-icon>
                {{ maxBuyTotalWarning }}
              </div>
              <div v-if="warning.maxSellAmount">
                <md-icon class="text-warning">warning</md-icon>
                {{ maxSellAmountWarning }}
              </div>

              <md-button
                class="md-danger mt-4"
                :disabled="!formValid"
                @click="setValues"
              >
                {{ $t("next") }}
              </md-button>
            </md-step>

            <md-step
              id="MWSwap-confirm"
              :md-done.sync="stepsDone.confirm"
              :md-label="$t('trade.request.review')"
            >
              <h4>
                {{
                  requestForm.side == "buy"
                    ? $t("trade.request.buying")
                    : $t("trade.request.selling")
                }}
              </h4>
              <h3>
                {{ formatCurrencyValue(amount, baseCurrency.id) }}
                <currency-symbol :currency="baseCurrencyTitle" />
              </h3>
              <h4>{{ $t("for").toLowerCase() }}</h4>
              <h3>
                {{ formatCurrencyValue(total, quoteCurrency.id) }}
                <currency-symbol :currency="quoteCurrencyTitle" />
              </h3>
              <rise-loader
                class="mt-4"
                color="#4caf50"
                v-if="confirmDisabled"
              />
              <md-button
                class="md-success md-round md-block"
                @click="submit"
                v-else
              >
                {{ $t("confirm") }}
              </md-button>
            </md-step>
          </md-steppers>
        </md-card-content>
      </md-card>
      <div class="text-center" v-else>
        <i class="far fa-times-circle text-danger" id="error-icon"></i>
        <h3>{{ $t("trade.request.pairNotFound") }}</h3>
        <md-button class="md-danger md-lg md-raised" @click="$router.back">
          {{ $t("trade.request.return") }}
        </md-button>
      </div>
    </div>
  </div>
</template>

<script>
import swapRequest from "@/mixins/swapRequest";
import currencyDecimalFormat from "@/mixins/currencyDecimalFormat";
import SyncLoader from "vue-spinner/src/SyncLoader";
import PulseLoader from "vue-spinner/src/PulseLoader";
import RiseLoader from "vue-spinner/src/RiseLoader";
import InvoiceTable from "@/components/Tables/InvoiceTable";
import { mapActions, mapState } from "vuex";
import CurrencySymbolMixin from "@/mixins/currencySymbol";
import CurrencySymbol from "@/components/CurrencySymbol";

export default {
  mixins: [swapRequest, currencyDecimalFormat, CurrencySymbolMixin],
  components: {
    SyncLoader,
    PulseLoader,
    RiseLoader,
    InvoiceTable,
    CurrencySymbol
  },
  provide() {
    const provision = {};

    // Makes reactive
    Object.defineProperties(provision, {
      invoiceType: { value: "Swap/Request" },
      tableContents: {
        enumerable: true,
        get: () => this.invoice
      },
      pair: {
        enumerable: true,
        get: () => this.tradePair
      }
    });

    return provision;
  },
  data() {
    return {
      requestForm: {
        pair_id: this.$route.query.pair
      },
      step: "MWSwap-op-select",
      stepsDone: {
        opSelect: false,
        amount: false,
        confirm: false
      },
      confirmDisabled: true,
      success: false,
      invoice: null
    };
  },
  computed: {
    ...mapState({
      token: state => state.ActiveSession.token
    }),
    baseBalance() {
      return this.formatCurrencyValue(
        this.walletBase.balance,
        this.tradePair.coin_base_id
      );
    },
    quoteBalance() {
      return this.formatCurrencyValue(
        this.walletQuote.balance,
        this.tradePair.coin_quote_id
      );
    },
    baseCurrencyTitle() {
      return this.tradePair.coin_base;
    },
    quoteCurrencyTitle() {
      return this.tradePair.coin_quote;
    },
    price() {
      const price =
        this.requestForm.side === "buy" ? this.buyPrice : this.sellPrice;

      return this.formatCurrencyValue(price, this.tradePair.coin_quote_id);
    }
  },
  methods: {
    ...mapActions({
      alertUser: "Alerts/alertUser",
      twoFaRequest: "TwoFactor/request"
    }),
    setSide(side) {
      this.requestForm.side = side;
      this.setDone("MWSwap-amount", "opSelect");
      this.resetConfirm();
    },
    stepTo(step) {
      this.step = step;
    },
    setDone(to_id, from) {
      this.stepTo(to_id);
      this.stepsDone[from] = true;
    },
    resetConfirm() {
      this.confirmDisabled = true;
      this.stepsDone.amount = false;
    },
    setValues() {
      setTimeout(() => (this.confirmDisabled = false), 3000);
      this.setDone("MWSwap-confirm", "amount");
    },
    submit() {
      const { pair_id, side } = this.requestForm;

      this.loading = true;

      this.twoFaRequest({
        resource: "trade/sendRequest",
        args: [pair_id, this.amount, side, this.token]
      })
        .then(res => {
          this.invoice = res;
          this.success = true;
        })
        .catch(err => {
          if (err === "cancelled") {
            return;
          }
          this.alertUser({
            title: this.$t("error"),
            message: this.$t(`api.trade.${err.statusString}`)
          });
        })
        .finally(() => (this.loading = false));
    }
  }
};
</script>
