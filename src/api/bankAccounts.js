import ApiError from "./ApiError";
import accountTypes from "@/utils/accountTypes";
import api from "./ApiHeaderV2";

export default {
  GetByCurrency(currency_id) {
    let status, message;

    return api
      .get(`/bank_accounts?filter[bank.currency_id]=${currency_id}`)
      .then(res => res.data.data)
      .catch(err => {
        if (err.code && err.code == "ECONNABORTED") {
          return Promise.reject(
            new ApiError(408, "timeout", "The connection timed out")
          );
        }

        switch (err.response.status) {
          case 401:
            status = "getByCurrencyUnauthorized";
            message = "You are not authenticated";
            break;
          case 404:
            status = "getByCurrencyNotFound";
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
  AddAccount(bank_id, account_branch, account_number, account_type) {
    let status, message;
    account_type = this.getAccountTypeName(account_type);
    account_number = account_number.replace(/[^a-zA-Z0-9]/g, '');
    account_branch = account_branch.replace(/[^a-zA-Z0-9]/g, '');
    let data = { bank_id, account_branch, account_number, account_type };

    return api
      .post("/bank_accounts", data)
      .then(res => res.data)
      .catch(err => {
        if (err.code && err.code == "ECONNABORTED") {
          return Promise.reject(
            new ApiError(408, "timeout", "The connection timed out")
          );
        }

        switch (err.response.status) {
          case 400:
            status = "addBrlAccountBadRequest";
            message = "Invalid request";
            break;
          case 401:
            status = "addBrlAccountUnauthorized";
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
  getAccountTypeName(account_type) {
    if (account_type === accountTypes.CHECKING) return "checking";
    else if (account_type === accountTypes.PAYMENT) return "payment";
    else if (account_type === accountTypes.SAVINGS) return "savings";
  }
};
