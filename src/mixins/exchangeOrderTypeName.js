import types from "@/utils/types";

const { ORDER_LIMIT } = types;

const exchangeOrderTypeName = {
  methods: {
    /**
     * @description Gets internationalized order type name by order type ID
     * @param {number} orderTypeId
     * @returns {string}
     */
    getExchangeOrderTypeName(orderTypeId) {
      switch (orderTypeId) {
        case ORDER_LIMIT:
          return this.$t("exchange.orderType.limit");
        default:
          return "";
      }
    }
  }
};

export default exchangeOrderTypeName;
