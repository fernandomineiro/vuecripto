import axios from "axios";
import ApiError from "./ApiError";

const api = axios.create({
  baseURL: `${process.env.VUE_APP_API_URL}/cryptocurrency_address`,
  timeout: 15000
});

export default {
  GetAllAddresses(token) {
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
            status = "getAllAddressesUnauthorized";
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
  getById(address_id, token) {
    let status, message;

    return api
      .get(`/${address_id}`, { headers: { token } })
      .then(res => res.data)
      .catch(err => {
        if (err.code && err.code == "ECONNABORTED") {
          return Promise.reject(
            new ApiError(408, "timeout", "The connection timed out")
          );
        }

        switch (err.response.status) {
          case 401: // Unauthorized
            status = "getAddressByIdUnauthorized";
            message = "You are not authenticated";
            break;
          case 404: // Not found
            status = "getAddressByIdNotFound";
            message = "Address not found";
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
