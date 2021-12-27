import ApiError from "./ApiError";
import apiAdm from "./ApiHeaderV2";

export default {
  /**
   * Get all pairs can be traded
   * GET: ${process.env.VUE_APP_API_URL}/trade/pair
   * @returns {Promise<Array<Object>|ApiError>}
   */
  GetAllPairs(filter = "") {
    let status, message;
    let path = filter == "" ? "/pairs" : `/pairs${filter}`;

    return apiAdm
      .get(path)
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
  },
  SendRequest(otp, pair_id, amount, side, token) {
    let status, message;

    const headers = {
      token
    };
    if (otp) {
      headers["otp"] = otp;
    }

    return apiAdm
      .post("/trades", { pair_id, amount, side }, { headers })
      .then(res => res.data)
      .catch(err => {
        if (err.code && err.code == "ECONNABORTED") {
          return Promise.reject(
            new ApiError(408, "timeout", "The connection timed out")
          );
        }

        switch (err.response.status) {
          case 422: // Bad request
            status = "sendRequestBadRequest";
            message = "Invalid data";
            break;
          case 401: // Unauthorized
            status = "sendRequestUnauthorized";
            message = "You are not authenticated";
            break;
          case 402: // No funds
            status = "sendRequestNoFunds";
            message = "Your funds are insuficient for the operation";
            break;
          case 403: // Forbidden - incomplete compliance
            status = "sendRequestForbidden";
            message = "You have not verified your identity";
            break;
          case 404: // Not found
            status = "sendRequestNotFound";
            message = "Trading pair not found";
            break;
          case 406: // Not accepted - Daily limit exceeded
            status = "sendRequestNotAccepted";
            message = "You have exceeded your daily limit";
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
  }
};
