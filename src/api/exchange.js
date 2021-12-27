import axios from "axios";
import ApiError from "./ApiError";
import types from "@/utils/types";

const { ORDER_LIMIT } = types;

/**
 * @description API instance
 * @type {import("axios").AxiosInstance}
 */
const api = axios.create({
  baseURL: `${process.env.VUE_APP_API_URL}/exchange`,
  timeout: 15000
});

/**
 * @description Base function for order data validation
 * @param {Array<{ param: string, type: string }>} params
 * @param {object} data
 */
const validateOrder = params => data =>
  params.every(
    ({ param, type }) =>
      data.hasOwnProperty(param) && (typeof data[param]) == type
  );

/**
 * @description Validates parameters of Limit Order
 * @type {(data: object) => boolean}
 */
const validateLimitOrder = validateOrder([
  { param: "pair_id", type: "number" },
  { param: "amount", type: "number" },
  { param: "price", type: "number" },
  { param: "side_id", type: "number" }
]);

export default {
  /**
   * @description Requests to create a new exchange trade order
   * @param {number} order_type_id
   * @param {object} data
   * @param {string} token
   * @returns {Promise}
   */
  createOrder(order_type_id, data, token) {
    // Select validation function according to order_type_id
    switch (order_type_id) {
      case ORDER_LIMIT:
        if (!validateLimitOrder(data)) {
          return Promise.reject(
            new TypeError("data does not have the required parameters")
          );
        }
        break;
      default:
        return Promise.reject(new TypeError("order_type_id is not recognized"));
    }

    return api
      .post("/order", { order_type_id, ...data }, { headers: { token } })
      .catch(err => {
        if (err.code && err.code == "ECONNABORTED") {
          return Promise.reject(
            new ApiError(408, "timeout", "The connection timed out")
          );
        }

        let status, message;

        switch (err.response.status) {
          case 400: // Bad request
            status = "createOrderBadRequest";
            message = "Invalid data";
            break;
          case 401: // Unauthorized
            status = "createOrderUnauthorized";
            message = "You are not authenticated";
            break;
          case 402: // No funds
            status = "createOrderNoFunds";
            message = "You do not have required funds";
            break;
          case 403: // Forbidden
            status = "createOrderForbidden";
            message = "You do not have permission to do this";
            break;
          case 500: // Internal server error
            return Promise.reject(ApiError.error500());
          default:
            status = "otherError";
            message = "Unexpected error";
            break;
        }

        return Promise.reject(
          new ApiError(err.response.status, status, message)
        );
      });
  },

  /**
   * @description Gets user order history
   * @param {string} token
   * @returns {Promise}
   */
  getOrderHistory(token) {
    return api
      .get("/order", { headers: { token } })
      .then(res => res.data)
      .catch(err => {
        if (err.code && err.code == "ECONNABORTED") {
          return Promise.reject(
            new ApiError(408, "timeout", "The connection timed out")
          );
        }

        let status, message;

        switch (err.response.status) {
          case 400: // Bad Request
            status = "getOrderHistoryBadRequest";
            message = "Invalid request";
            break;
          case 401: // Unauthorized
            status = "getOrderHistoryUnauthorized";
            message = "You are not authenticated";
            break;
          case 403: // Forbidden
            status = "getOrderHistoryForbidden";
            message = "You do not have permission to do this";
            break;
          case 500: // Internal server error
            return Promise.reject(ApiError.error500());
          default:
            status = "otherError";
            message = "Unexpected error";
            break;
        }

        return Promise.reject(
          new ApiError(err.response.status, status, message)
        );
      });
  },

  /**
   * @description Gets the orderbook for a given pair
   * @param {number} pair_id
   * @returns {Promise}
   */
  getOrderbook(pair_id) {
    return api
      .get(`/orderbook/${pair_id}`)
      .then(res => res.data)
      .catch(err => {
        if (err.code && err.code == "ECONNABORTED") {
          return Promise.reject(
            new ApiError(408, "timeout", "The connection timed out")
          );
        }

        let status, message;

        switch (err.response.status) {
          case 404: // Not found
            status = "getOrderbookNotFound";
            message = "Orderbook pair not found";
            break;
          case 500: // Internal server error
            return Promise.reject(ApiError.error500());
          default:
            status = "otherError";
            message = "Unexpected error";
            break;
        }

        return Promise.reject(
          new ApiError(err.response.status, status, message)
        );
      });
  },
  cancelOrder(orderId, token) {
    return api
      .delete(`/order/${orderId}`, { headers: { token } })
      .then(res => res.data)
      .catch(err => {
        let status, message;

        switch (err.response.status) {
          case 400: // Bad Request
            status = "cancelOrderBadRequest";
            message = "Invalid request";
            break;
          case 401: // Unauthorized
            status = "cancelOrderUnauthorized";
            message = "You are not authenticated";
            break;
          case 403: // Forbidden
            status = "cancelOrderForbidden";
            message = "You do not have permission to do this";
            break;
          case 404: // Not found
            status = "cancelOrderNotFound";
            message = "Order not found";
            break;
          case 500: // Internal server error
            return Promise.reject(ApiError.error500());
          default:
            status = "otherError";
            message = "Unexpected error";
            break;
        }

        return Promise.reject(
          new ApiError(err.response.status, status, message)
        );
      });
  }
};
