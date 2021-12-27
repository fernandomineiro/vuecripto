import axios from "axios";
import ApiError from "./ApiError";

const api = axios.create({
  baseURL: `${process.env.VUE_APP_API_URL}/user/preferences`,
  timeout: 15000
});

export default {
  getPreferences(token) {
    let status, message;

    return api
      .get("", { headers: { token } })
      .then(res => res)
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
  createPreferences(currency_id, language_id, token) {
    let status, message;
    return api
      .post("", { currency_id, language_id }, { headers: { token } })
      .catch(err => {
        if (err.code && err.code == "ECONNABORTED") {
          return Promise.reject(
            new ApiError(408, "timeout", "The connection timed out")
          );
        }

        switch (err.response.status) {
          case 400:
            status = "preferencesBadRequest";
            message = "Bad Request";
            break;
          case 401:
            status = "preferencesUnauthorized";
            message = "You are not authenticated";
            break;
          case 403:
            status = "preferencesForbidden";
            message = "You have not verified your identity";
            break;
          case 404:
            status = "preferencesNotFound";
            message = "Preferences not found";
            break;
          case 409:
            status = "preferencesAlreadyExists";
            message = "Preferences already exists";
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
  updatePreferences(preferences_id, currency_id, language_id, token) {
    let status, message;
    return api
      .put(
        `/${preferences_id}`,
        { currency_id, language_id },
        { headers: { token } }
      )
      .catch(err => {
        if (err.code && err.code == "ECONNABORTED") {
          return Promise.reject(
            new ApiError(408, "timeout", "The connection timed out")
          );
        }

        switch (err.response.status) {
          case 400:
            status = "preferencesBadRequest";
            message = "Bad Request";
            break;
          case 401:
            status = "preferencesUnauthorized";
            message = "You are not authenticated";
            break;
          case 403:
            status = "preferencesForbidden";
            message = "You have not verified your identity";
            break;
          case 404:
            status = "preferencesNotFound";
            message = "Preferences not found";
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
