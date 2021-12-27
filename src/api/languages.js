import axios from "axios";
import ApiError from "./ApiError";

const api = axios.create({
  baseURL: `${process.env.VUE_APP_API_URL}/language`,
  timeout: 15000
});

export default {
  getPreferences() {
    let status, message;
    return api
      .get("")
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
  }
};
