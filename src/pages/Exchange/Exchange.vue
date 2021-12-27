<template>
  <div class="md-layout">
    <div class="md-layout-item md-size-100 pd-0">
      <md-card class="pd-0">
        <md-card-header class="md-card-header-primary md-card-header-blue flex">
          <h4>{{ $t("exchangeTitle") }} BTC/R$</h4>
          <balance-desktop pair-id="1" class="pair-balance desktop-balance" />
        </md-card-header>
        <md-card-content>
          <exchange-card />
        </md-card-content>
      </md-card>
      <order-history-card />
    </div>
  </div>
</template>

<script>
import ExchangeCard from "./ExchangeCard";
import OrderHistoryCard from "./OrderHistoryCard";
import BalanceDesktop from "./BalanceDesktop";

export default {
  components: {
    ExchangeCard,
    OrderHistoryCard,
    BalanceDesktop
  }
};
</script>

<style lang="scss">
.pair-balance {
  color: #fff;
}
.pair-balance p {
  margin: 0 1rem;
  display: inline;
}
.flex {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.desktop-balance {
  display: none;
}

@media (min-width: 961px) {
  .desktop-balance {
    display: block;
  }
}
</style>
