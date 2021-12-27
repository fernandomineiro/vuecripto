import ApiError from "./ApiError";
import api from "./ApiHeaderV2";

export default {
  GetAll(code, currency_id, bank_id) {
    let status, message, filter;

    filter = code ? "?filter[bank.code]=" + code : "";
    filter = currency_id ? filter + "&[bank.currency_id]=" + currency_id : "";
    filter = bank_id ? filter + "&[bank_id]=" + bank_id : "";

    return api
      .get("deposit-methods" + filter)
      .then(res => res.data.data)
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
