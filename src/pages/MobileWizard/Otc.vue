<template>
  <div class="md-layout">
    <div class="md-layout-item md-size-100">
      <div class="text-center mt-4" v-if="!isStoreLoaded">
        <sync-loader color="#999999" />
      </div>
      <div class="text-center" v-else-if="success">
        <i class="far fa-check-circle text-success" id="success-icon"></i>
        <h3>{{ $t("otc.request.success") }}</h3>
        <md-card>
          <md-card-content>
            <invoice-table />
          </md-card-content>
        </md-card>
        <router-link to="/otc">
          <md-button class="md-danger md-lg md-raised">
            {{ $t("otc.request.returnToOtc") }}
          </md-button>
        </router-link>
      </div>
      <md-card v-else-if="pair">
        <md-card-content>
          <div>
            {{ $t("balance", { cur: pair.coin_base }) }}:
            <pulse-loader
              class="field-spinner"
              color="#999999"
              size="8px"
              v-if="!(wallets || wallets.length)"
            />
            <template v-else>
              {{ walletBase.balance }}
            </template>
          </div>
          <div>
            {{ $t("balance", { cur: pair.coin_quote }) }}:
            <pulse-loader
              class="field-spinner"
              color="#999999"
              size="8px"
              v-if="!(wallets || wallets.length)"
            />
            <template v-else>
              {{ Number(walletQuote.balance).toFixed(2) }}
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
              id="MWOtc-op-select"
              :md-done.sync="stepsDone.opSelect"
              :md-label="$t('otc.request.buyOrSell')"
            >
              {{ $t("otc.request.iWantTo") }}
              <div class="side-options mt-4">
                <md-button class="md-success" @click="setSide(1)">
                  {{ $t("buy") }}
                </md-button>
                <md-button class="md-danger" @click="setSide(2)">
                  {{ $t("sell") }}
                </md-button>
              </div>
            </md-step>
            <md-step
              id="MWOtc-amount"
              :md-done.sync="stepsDone.amount"
              :md-label="$t('otc.request.amountAndPrice')"
            >
              {{
                $t("otc.request.iWantToX", {
                  do:
                    requestForm.otc_type_id == 1
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
                  v-validate="`required|decimal|min_value:${minAmount}`"
                  name="amount"
                />
                <span class="md-suffix">{{ pair.coin_base }}</span>
              </md-field>
              {{ $t("otc.request.atTheUnitaryPriceOf") }}
              <md-field :class="{ 'md-error': errors.has('price') }">
                <label>{{ $t("price") }}</label>
                <md-input
                  type="number"
                  step="0.01"
                  v-model="requestForm.price"
                  v-validate="
                    'required|decimal|' +
                      (requestForm.otc_type_id == 1
                        ? 'min_value:' + minBuyPrice
                        : 'max_value:' + maxSellPrice)
                  "
                  name="price"
                />
                <span class="md-suffix">{{ pair.coin_quote }}</span>
              </md-field>
              {{ $t("otc.request.before") }}
              <md-field
                :class="{
                  'md-error': errors.has('expire_at') || warning.timeOffBounds
                }"
              >
                <label>{{ $t("otc.request.expiresAt") }}</label>
                <datetime-input
                  type="time"
                  step="60"
                  v-model="requestForm.expire_at"
                  v-validate="'required'"
                  name="expire_at"
                />
              </md-field>

              <!-- Form warnings -->
              <div v-if="warning.timeOffBounds">
                <md-icon class="text-warning">warning</md-icon>
                {{ $t("otc.request.timeOffBounds") }}
              </div>
              <div v-if="warning.minAmount">
                <md-icon class="text-warning">warning</md-icon>
                {{ minAmountWarning }}
              </div>
              <div v-if="warning.minTotal">
                <md-icon class="text-warning">warning</md-icon>
                {{ minTotalWarning }}
              </div>
              <div v-if="warning.minBuyPrice">
                <md-icon class="text-warning">warning</md-icon>
                {{ minBuyPriceWarning }}
              </div>
              <div v-if="warning.maxSellPrice">
                <md-icon class="text-warning">warning</md-icon>
                {{ maxSellPriceWarning }}
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
              id="MWOtc-confirm"
              :md-done.sync="stepsDone.confirm"
              :md-label="$t('otc.request.review')"
            >
              <h4>
                {{
                  requestForm.otc_type_id == 1
                    ? $t("otc.request.buying")
                    : $t("otc.request.selling")
                }}
              </h4>
              <h3>{{ requestForm.amount }} {{ pair.coin_base }}</h3>
              <h4>{{ $t("otc.request.for") }}</h4>
              <h3>{{ total }} {{ pair.coin_quote }}</h3>
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
        <h3>{{ $t("otc.request.pairNotFound") }}</h3>
        <md-button class="md-danger md-lg md-raised" @click="$router.back">
          {{ $t("otc.request.return") }}
        </md-button>
      </div>
    </div>
  </div>
</template>

<script>
import otcRequest from "@/mixins/otcRequest";
import InvoiceTable from "@/components/Tables/InvoiceTable";
import SyncLoader from "vue-spinner/src/SyncLoader";
import RiseLoader from "vue-spinner/src/RiseLoader";
import PulseLoader from "vue-spinner/src/PulseLoader";
import otc from "@/api/otc";
import { mapState, mapActions } from "vuex";
import { DatetimeInput } from "@/components";

export default {
  mixins: [otcRequest],
  provide() {
    const provision = {};

    // Makes reactive
    Object.defineProperties(provision, {
      invoiceType: { value: "OTC/Request" },
      tableContents: {
        enumerable: true,
        get: () => this.invoice
      },
      pair: {
        enumerable: true,
        get: () => this.pair
      }
    });

    return provision;
  },
  components: {
    InvoiceTable,
    SyncLoader,
    RiseLoader,
    PulseLoader,
    DatetimeInput
  },
  data() {
    return {
      requestForm: {
        pair_id: this.$route.query.pair
      },
      step: "MWOtc-op-select",
      stepsDone: {
        opSelect: false,
        amount: false,
        confirm: false
      },
      confirmDisabled: true,
      loading: false,
      success: false,
      invoice: null
    };
  },
  computed: {
    ...mapState({
      token: state => state.ActiveSession.token
    })
  },
  methods: {
    ...mapActions({
      alertUser: "Alerts/alertUser"
    }),
    setSide(side) {
      this.requestForm.otc_type_id = side;
      this.setDone("MWOtc-amount", "opSelect");
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
      this.setDone("MWOtc-confirm", "amount");
    },
    submit() {
      const { pair_id, price, amount, otc_type_id } = this.requestForm;

      this.loading = true;
      otc
        .CreateRequest(
          pair_id,
          price,
          amount,
          otc_type_id,
          this.expireAtFmt,
          this.token
        )
        .then(res => {
          this.invoice = res;
          this.success = true;
        })
        .catch(err =>
          this.alertUser({
            title: this.$t("error"),
            message: this.$t(`api.otc.${err.statusString}`)
          })
        )
        .finally(() => (this.loading = false));
    }
  },
  watch: {
    total() {
      this.resetConfirm();
    }
  },
  beforeRouteUpdate(to) {
    this.requestForm.pair_id = to.query.pair;
  }
};
</script>

<style>
#success-icon,
#error-icon {
  font-size: 10rem;
}
.side-options {
  display: flex;
  justify-content: space-between;
}

.field-spinner {
  display: inline-block;
}
</style>
