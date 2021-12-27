import axios from "axios";
import ApiError from "./ApiError";

const api = axios.create({
  baseURL: `${process.env.VUE_APP_API_URL}/otc`,
  timeout: 15000
});

export default {
  CreateRequest(pair_id, price, amount, otc_type_id, expire_at, token) {
    let status, message;

    return api
      .post(
        "",
        { pair_id, price, amount, otc_type_id, expire_at },
        { headers: { token } }
      )
      .then(res => res.data)
      .catch(err => {
        if (err.code && err.code == "ECONNABORTED") {
          return Promise.reject(
            new ApiError(408, "timeout", "The connection timed out")
          );
        }

        switch (err.response.status) {
          case 400: // Bad request
            status = "createRequestBadRequest";
            message = "Invalid data";
            break;
          case 401: // Unauthorized
            status = "createRequestUnauthorized";
            message = "You are not authenticated";
            break;
          case 402: // No funds
            status = "createRequestNoFunds";
            message = "Your funds are insuficient for the operation";
            break;
          case 403: // Forbidden
            status = "createRequestForbidden";
            message = "You are not allowed to do this request";
            break;
          case 404: // Not found
            status = "createRequestNotFound";
            message = "OTC pair not found";
            break;
          case 500:
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
  GetOtc(id, token) {
    let status, message;

    return api
      .get(`/${id}`, { headers: { token } })
      .then(res => res.data)
      .catch(err => {
        if (err.code && err.code == "ECONNABORTED") {
          return Promise.reject(
            new ApiError(408, "timeout", "The connection timed out")
          );
        }

        switch (err.response.status) {
          case 401: // Unauthorized
            status = "getOtcUnauthorized";
            message = "You are not authenticated";
            break;
          case 404: // Not found
            status = "getOtcNotFound";
            message = "OTC not found";
            break;
          case 500:
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
  ListAll(token) {
    let status, message;

    return api
      .get("", { headers: { token } })
      .then(res => res.data)
      .catch(err => {
        if (err.code && err.code == "ECONNABORTED") {
          return Promise.reject(
            new ApiError(408, "timeout", "The connection timed out")
          );
        }

        switch (err.response.status) {
          case 401: // Unauthorized
            status = "listAllUnauthorized";
            message = "You are not authenticated";
            break;
          case 500:
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
  UpdateOtc(id, status_id, amount, price, token) {
    let status, message;

    return api
      .put(`/${id}`, { status_id, amount, price }, { headers: { token } })
      .then(res => res.data)
      .catch(err => {
        if (err.code && err.code == "ECONNABORTED") {
          return Promise.reject(
            new ApiError(408, "timeout", "The connection timed out")
          );
        }

        switch (err.response.status) {
          case 400: // Bad request
            status = "updateOtcBadRequest";
            message = "Invalid data";
            break;
          case 401: // Unauthorized
            status = "updateOtcUnauthorized";
            message = "You are not authenticated";
            break;
          case 402: // No funds
            status = "updateOtcNoFunds";
            message = "Your funds are insuficient for the operation";
            break;
          case 403: // Forbidden
            status = "updateOtcForbidden";
            message = "You are not allowed to do this request";
            break;
          case 404: // Not found
            status = "updateOtcNotFound";
            message = "OTC pair not found";
            break;
          case 499:
            status = "updateOtcExpired";
            message = "This offer has expired";
            break;
          case 500:
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
  DeleteOtc(id, token) {
    let status, message;

    return api
      .delete(`/${id}`, { headers: { token } })
      .then(res => res.data)
      .catch(err => {
        if (err.code && err.code == "ECONNABORTED") {
          return Promise.reject(
            new ApiError(408, "timeout", "The connection timed out")
          );
        }

        switch (err.response.status) {
          case 401: // Unauthorized
            status = "deleteOtcUnauthorized";
            message = "You are not authenticated";
            break;
          case 404: // Not found
            status = "deleteOtcNotFound";
            message = "OTC not found";
            break;
          case 499:
            status = "deleteOtcExpired";
            message = "This offer has expired";
            break;
          case 500:
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
  GetSettings() {
    let status, message;

    return api
      .get("/settings")
      .then(res => res.data)
      .catch(err => {
        if (err.code && err.code == "ECONNABORTED") {
          return Promise.reject(
            new ApiError(408, "timeout", "The connection timed out")
          );
        }

        switch (err.response.status) {
          case 500:
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
