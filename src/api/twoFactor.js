import axios from "axios";
import ApiError from "./ApiError";

const api = axios.create({
  baseURL: `${process.env.VUE_APP_API_URL}/user/two_factors`,
  timeout: 15000
});

export default {
  /**
   * Create new PIN if one does not exist
   * @param {string} pin
   * @param {string} token
   */
  CreatePin(pin, token) {
    let status, message;

    return api
      .post("", { otp: pin }, { headers: { token } })
      .then(res => res.data)
      .catch(err => {
        if (err.code && err.code == "ECONNABORTED") {
          return Promise.reject(
            new ApiError(408, "timeout", "The connection timed out")
          );
        }

        switch (err.response.status) {
          case 400: // Bad Request
            status = "createPinBadRequest";
            message = "Invalid data";
            break;
          case 401: // Unauthorized
            status = "createPinUnauthorized";
            message = "You must be authenticated to create a PIN";
            break;
          case 409: // Conflict
            status = "createPinConflict";
            message = "A PIN already exists";
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

  UpdatePin(currentPin, newPin, newPinConfirmation, token) {
    let status, message;

    return api
      .put(
        "",
        {
          new_otp: newPin,
          new_otp_confirmation: newPinConfirmation
        },
        { headers: { token, otp: currentPin } }
      )
      .then(res => res.data)
      .catch(err => {
        if (err.code && err.code == "ECONNABORTED") {
          return Promise.reject(
            new ApiError(408, "timeout", "The connection timed out")
          );
        }

        switch (err.response.status) {
          case 400: // Bad Request
            status = "updatePinBadRequest";
            message = "Invalid data";
            break;
          case 401: // Unauthorized
            status = "updatePinUnauthorized";
            message = "You must be authenticated to update a PIN";
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

  RemovePin(pin, token) {
    let status, message;

    return api
      .delete("", { headers: { token, otp: pin } })
      .then(res => res.data)
      .catch(err => {
        if (err.code && err.code == "ECONNABORTED") {
          return Promise.reject(
            new ApiError(408, "timeout", "The connection timed out")
          );
        }

        switch (err.response.status) {
          case 400: // Bad Request
            status = "removePinBadRequest";
            message = "Invalid data";
            break;
          case 401: // Unauthorized
            status = "removePinUnauthorized";
            message = "You must be authenticated to remove a PIN";
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
