<template>
  <div class="md-content">
    <div class="md-layout">
      <div class="md-layout-item">
        <md-card>
          <md-card-header class="md-card-header md-card-header-blue">
            <h4>{{ $t("pages.Wallets") }}</h4>
          </md-card-header>
          <md-card-content>
            <md-table v-model="data" table-header-color="green">
              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell :md-label="$t('coin')">
                  <cryptoicon class="md-just-icon" :symbol="item.currency.title" size="16" :generic="item.currency.currency_type_id === 2" />
                    {{ item.currency.name }}
                </md-table-cell>
                <md-table-cell :md-label="$t('wallets.balance')">
                  {{ formatCurrencyValue(item.balance, item.currency_id) }}
                </md-table-cell>
                <md-table-cell :md-label="$t('action')">
                  <button
                    class="btn-wallet"
                    @click="$emit('deposit', item.currency_id)"
                  >
                    {{ $t("wallets.deposit.deposit") }}
                  </button>
                  <button
                    class="btn-wallet"
                    @click="$emit('withdraw', item.currency_id)"
                  >
                    {{ $t("wallets.withdraw.withdraw") }}
                  </button>
                  <button
                    class="btn-wallet"
                    @click="$emit('transfer', { currency_id: item.currency_id, wallet_id: item.id })"
                  >
                    {{ $t("wallets.transfer.transfer") }}
                  </button>
                </md-table-cell>
              </md-table-row>
            </md-table>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import currencyDecimalFormat from "@/mixins/currencyDecimalFormat";

export default {
  name: "WalletTable",
  mixins: [currencyDecimalFormat],
  props: {
    data: { type: Array, required: true }
  }
};
</script>

<style lang="scss" scoped>
.btn-wallet {
  cursor: pointer;
  background: linear-gradient(60deg, #ff5266, #fd693b);
  color: #fff;
  border: none;
  padding: 0.6rem;
  text-transform: uppercase;
  margin: 0 0.7rem;
  border-radius: 3px;
}

.crypto-icon {
  padding-top: -4px;
}

@media (max-width: 662px) {
  .btn-wallet {
    width: 100%;
    margin: 1rem 0;
    font-size: 0.6rem;
  }
}
</style>
