import types from "@/utils/types";

const { TRADE_SIDE_BUY, TRADE_SIDE_SELL } = types;

const tradeSideName = {
  methods: {
    /**
     * @description Gets internationalized name of trade side from side ID
     * @param {1 | 2} sideId
     * @returns {string}
     */
    getTradeSideName(sideId) {
      switch (sideId) {
        case TRADE_SIDE_BUY:
          return this.$t("exchange.side.buy");
        case TRADE_SIDE_SELL:
          return this.$t("exchange.side.sell");
        default:
          return "";
      }
    }
  }
};

export default tradeSideName;
