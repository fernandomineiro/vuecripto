import ApiError from "./ApiError";
import api from "./ApiHeaderV2";

export default {
  DepositCrypto(otp, currency_id) {
    let status, message;

    const headers = {};

    if (otp) {
      headers.otp = otp;
    }

    return api
      .post("/deposits", { currency_id }, { headers })
      .then(res => res.data)
      .catch(err => {
        if (err.code && err.code == "ECONNABORTED") {
          return Promise.reject(
            new ApiError(408, "timeout", "The connection timed out")
          );
        }

        switch (err.response.status) {
          case 401:
            status = "depositCryptoUnauthorized";
            message = "You are not authenticated";
            break;
          case 403:
            status = "depositCryptoForbidden";
            message = "You have not verified your identity";
            break;
          case 404:
            status = "depositCryptoNotFound";
            message = "Currency not found";
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
  DepositFiat(otp, currency_id, amount, bank_account_id) {
    let status, message;

    const headers = {};
    if (otp) {
      headers.otp = otp;
    }

    return api
      .post("deposits", { currency_id, amount, bank_account_id }, { headers })
      .then(res => res.data)
      .catch(err => {
        if (err.code && err.code == "ECONNABORTED") {
          return Promise.reject(
            new ApiError(408, "timeout", "The connection timed out")
          );
        }

        switch (err.response.status) {
          case 401:
            status = "depositFiatUnauthorized";
            message = "You are not authenticated";
            break;
          case 403: // Forbidden - incomplete compliance
            status = "depositFiatForbidden";
            message = "You have not verified your identity";
            break;
          case 404:
            status = "depositFiatNotFound";
            message = "Currency not found";
            break;
          case 406:
            status = "depositFiatNotAccepted";
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
  UploadReceipt(id, file) {
    let status, message;
    const formData = new FormData();
    formData.append("file", file);
    return api
      .post(`deposits/${id}/receipt`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      .then(res => res.data)
      .catch(err => {
        if (err.code && err.code == "ECONNABORTED") {
          return Promise.reject(
            new ApiError(408, "timeout", "The connection timed out")
          );
        }

        switch (err.response.status) {
          case 400: // Bad request
            status = "uploadReceiptBadRequest";
            message = "Invalid data";
            break;
          case 401: // Unauthorized
            status = "uploadReceiptUnauthorized";
            message = "You are not authenticated";
            break;
          case 403: // Forbidden
            status = "uploadReceiptForbidden";
            message = "Receipt already sent";
            break;
          case 404: // Not found
            status = "uploadReceiptNotFound";
            message = "Document type not found";
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
