import ApiError from "./ApiError";
import api from "./ApiHeaderV2";
export default {
  Transfer(otp, wallet_id, amount, email) {
    let status, message;

    const headers = {};
    if (otp) {
      headers.otp = otp;
    }

    return api
      .post("internal_transfers", { wallet_id, amount: Number(amount), email }, { headers })
      .then(res => res.data)
      .catch(err => {
        if (err.code && err.code == "ECONNABORTED") {
          return Promise.reject(
            new ApiError(408, "timeout", "The connection timed out")
          );
        }

        switch (err.response.status) {
          case 400:
            status = "transferBadRequest";
            message = "Invalid form data";
            break;
          case 401:
            status = "transferUnauthorized";
            message = "You are not authenticated";
            break;
          case 402:
            status = "transferNoFunds";
            message = "Insuficient funds";
            break;
          case 403: // Forbidden - incomplete compliance
            status = "transferForbidden";
            message = "You have not verified your identity";
            break;
          case 404:
            status = "transferNotFound";
            message = "E-mail not found";
            break;
          case 406:
            status = "transferNotAccepted";
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
