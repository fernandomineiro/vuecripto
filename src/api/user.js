import ApiError from "./ApiError";
import axios from "axios";
import api from "./ApiHeaderV2";

const apiOld = axios.create({
  baseURL: `${process.env.VUE_APP_API_URL}/user`,
  timeout: 15000
});

export default {
  GetToken(email, password) {
    return api
      .post("/auth", { email, password, grant_type: "password" })
      .then(res => res.data)
      .catch(err => {
        if (err.code && err.code == "ECONNABORTED") {
          return Promise.reject(
            new ApiError(408, "timeout", "The connection timed out")
          );
        }

        let status, message;
        switch (err.response.status) {
          case 422:
            status = "getTokenBadRequest";
            message = "Form data is invalid";
            break;
          case 401:
            status = "getTokenNotAuthorized";
            message = err.response.data.message;
            break;
          case 403:
            status = "getTokenForbidden";
            message = err.response.data.reason;
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
  RefreshToken(token) {
    return api
      .post("/auth/refresh", { refresh_token: token })
      .then(res => res.data)
      .catch(err => {
        if (err.code && err.code == "ECONNABORTED") {
          return Promise.reject(
            new ApiError(408, "timeout", "The connection timed out")
          );
        }

        let status, message;
        switch (err.response.status) {
          case 422:
            status = "getTokenBadRequest";
            message = "Form data is invalid";
            break;
          case 401:
            status = "getTokenNotAuthorized";
            message = err.response.data.message;
            break;
          case 403:
            status = "getTokenForbidden";
            message = err.response.data.reason;
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
  CreateUser(
    country_code,
    email,
    password,
    password_confirmation,
    referral = null
  ) {
    let form = {
      country_code,
      email,
      password,
      password_confirmation
    };

    if (referral) {
      form.reffer = referral;
    }

    return api
      .post("/users", form)
      .then(res => res.data)
      .catch(err => {
        if (err.code && err.code == "ECONNABORTED") {
          return Promise.reject(
            new ApiError(408, "timeout", "The connection timed out")
          );
        }

        let status,
          data = {};
        if (err.response.data.email) {
          data.email = err.response.data.email;
        }
        if (err.response.data.password) {
          data.password = err.response.data.password;
        }
        data.message = err.response.data.message;
        switch (err.response.status) {
          case 409: // Conflict
            status = "createUserConflict";
            break;
          case 400: // Bad Request
            status = "createUserBadRequest";
            break;
          case 422: // Unprocessable Entity
            status = "createUserUnprocessable";
            break;
          case 500:
            return Promise.reject(ApiError.error500());
          default:
            status = "otherError";
            data.message = "Unexpected error";
            break;
        }
        return Promise.reject(
          new ApiError(err.response.status, status, data)
        );
      });
  },
  ResetPassword(email) {
    let status, message;

    return api
      .delete(`/forgot-password/${email}`)
      .then(res => res.status)
      .catch(function(err) {
        if (err.code && err.code == "ECONNABORTED") {
          return Promise.reject(
            new ApiError(408, "timeout", "The connection timed out")
          );
        }

        switch (err.response.status) {
          case 400: // Bad Request
            status = "resetPasswordBadRequest";
            message = "Invalid e-mail";
            break;
          default:
            return Promise.reject(ApiError.error500());
        }
        return Promise.reject(
          new ApiError(err.response.status, status, message)
        );
      });
  },
  RecoverPassword(code, password, passwordConfirmation) {
    let status, message;
    const form = {
      password,
      password_confirmation: passwordConfirmation
    };

    return api
      .put(`/recover-password/${code}`, form)
      .then(res => res.status)
      .catch(err => {
        if (err.code && err.code == "ECONNABORTED") {
          return Promise.reject(
            new ApiError(408, "timeout", "The connection timed out")
          );
        }

        switch (err.response.status) {
          case 400: // Bad Request
            status = "recoverPasswordBadRequest";
            message = "Invalid form data";
            break;
          case 404: // Not found
            status = "recoverPasswordTokenNotFound";
            message = "Token not found";
            break;
          case 410: // Gone
            status = "recoverPasswordTokenExpired";
            message = "Token has expired";
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

  /**
   * Fetch user info
   * @param {Number} id User ID
   * @param {String} token Authorization token
   */
  GetUser(id) {
    let status, message;
    return api
      .get(`/users/${id}`)
      .then(resp => {
        return resp.data;
      })
      .catch(err => {
        if (err.code && err.code == "ECONNABORTED") {
          return Promise.reject(
            new ApiError(408, "timeout", "The connection timed out")
          );
        }

        switch (err.response.status) {
          case 401: // Unauthorized
            status = "getUserUnauthorized";
            message = "You are not logged in";
            break;
          // TODO: other possible codes: 403?, 404
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
  ChangePassword(otp, id, old_password, password, repeat_password) {
    let status, message;
    const form = {
      old_password,
      password,
      password_confirmation: repeat_password
    };

    const headers = {};

    if (otp) {
      headers.otp = otp;
    }

    return api
      .put(`/users/password`, form, { headers })
      .then(res => res.data)
      .catch(err => {
        if (err.code && err.code == "ECONNABORTED") {
          return Promise.reject(
            new ApiError(408, "timeout", "The connection timed out")
          );
        }

        switch (err.response.status) {
          case 400: // Bad request
            status = "addNewBadRequest";
            message = "Invalid data";
            break;
          case 401: // Unauthorized
            status = "getUserUnauthorized";
            message = "You are not logged in";
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
  getReferrals(token) {
    let status, message;
    return apiOld
      .get(`/referrals`, { headers: { token: token } })
      .then(resp => {
        return resp.data;
      })
      .catch(err => {
        if (err.code && err.code == "ECONNABORTED") {
          return Promise.reject(
            new ApiError(408, "timeout", "The connection timed out")
          );
        }

        switch (err.response.status) {
          case 401: // Unauthorized
            status = "getUserUnauthorized";
            message = "You are not logged in";
            break;
          // TODO: other possible codes: 403?, 404
          case 500:
            return Promise.reject(ApiError.error500());

          case 403:
            status = "userIsTrader";
            message = "You are a trader";
            break;
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
  RequestUpgrade(user_type_id) {
    let status, message;

    return api
      .post("/request_upgrade", { user_type_id })
      .then(res => res.data)
      .catch(err => {
        if (err.code && err.code == "ECONNABORTED") {
          return Promise.reject(
            new ApiError(408, "timeout", "The connection timed out")
          );
        }

        switch (err.response.status) {
          case 400: // Bad Request
            status = "requestUpgradeBadRequest";
            message = "Invalid data";
            break;
          case 401: // Unauthorized
            status = "requestUpgradeUnauthorized";
            message = "You are not logged in";
            break;
          case 403: // Forbidden
            status = "requestUpgradeForbidden";
            message = "You cannot request a upgrade";
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

  /**
   * Get user's referral count by level
   * @param {string} token
   * @throws {ApiError}
   * @returns {object}
   */
  getReferralsCount() {
    let status, message;

    return api
      .get("/referrals/count")
      .then(res => res.data.data)
      .catch(err => {
        if (err.code && err.code == "ECONNABORTED") {
          return Promise.reject(
            new ApiError(408, "timeout", "The connection timed out")
          );
        }

        switch (err.response.status) {
          case 401: // Unauthorized
            status = "getReferralsCountUnauthorized";
            message = "You are not logged in";
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
  getUserTypes() {
    let status, message;

    return api
      .get("/users/types")
      .then(res => res.data.data)
      .catch(err => {
        if (err.code && err.code == "ECONNABORTED") {
          return Promise.reject(
            new ApiError(408, "timeout", "The connection timed out")
          );
        }

        switch (err.response.status) {
          case 401: // Unauthorized
            status = "getUserTypesUnauthorized";
            message = "You are not logged in";
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
