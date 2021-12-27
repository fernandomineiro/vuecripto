import ApiError from "./ApiError";
import api from "./ApiHeaderV2";

export default {
  WithdrawCrypto(otp, currency_id, amount, address, token) {
    let status, message;

    const headers = {
      token
    };
    if (otp) {
      headers.otp = otp;
    }

    return api
      .post("/withdraws", { currency_id, amount, address }, { headers })
      .then(res => res.data)
      .catch(err => {
        if (err.code && err.code == "ECONNABORTED") {
          return Promise.reject(
            new ApiError(408, "timeout", "The connection timed out")
          );
        }

        switch (err.response.status) {
          case 400:
            status = "withdrawCryptoBadRequest";
            message = "Invalid request";
            break;
          case 401:
            status = "withdrawCryptoUnauthorized";
            message = "You are not authenticated";
            break;
          case 402:
            status = "withdrawCryptoNoFunds";
            message = "The wallet funds are not enough for the transaction";
            break;
          case 403: // Forbidden - incomplete compliance
            status = "withdrawForbidden";
            message = "You have not verified your identity";
            break;
          case 404:
            status = "withdrawCryptoNotFound";
            message = "Currency not found";
            break;
          case 406:
            status = "withdrawNotAccepted";
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
  },
  WithdrawFiat(otp, currency_id, amount, bank_account_id) {
    let status, message;

    const headers = {};
    if (otp) {
      headers.otp = otp;
    }

    return api
      .post("/withdraws", { currency_id, amount, bank_account_id }, { headers })
      .then(res => res.data)
      .catch(err => {
        if (err.code && err.code == "ECONNABORTED") {
          return Promise.reject(
            new ApiError(408, "timeout", "The connection timed out")
          );
        }

        switch (err.response.status) {
          case 400:
            status = "withdrawFiatBadRequest";
            message = "Invalid request";
            break;
          case 401:
            status = "withdrawFiatUnauthorized";
            message = "You are not authenticated";
            break;
          case 402:
            status = "withdrawFiatNoFunds";
            message = "The wallet funds are not enough for the transaction";
            break;
          case 403: // Forbidden - incomplete compliance
            status = "withdrawForbidden";
            message = "You have not verified your identity";
            break;
          case 404:
            status = "withdrawFiatNotFound";
            message = "Currency not found";
            break;
          case 406:
            status = "withdrawNotAccepted";
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
