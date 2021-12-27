import ApiError from "./ApiError";
import api from "./ApiHeaderV2";

export default {
  /**
   * Get all wallets
   * GET: ${process.env.VUE_APP_API_URL}/wallet
   * @param {String} token
   * @returns {Promise<Array<Object>|ApiError>}
   */
  GetAllWallets(token) {
    let status, message;

    return api
      .get("/wallets", { headers: { token } })
      .then(res => res.data)
      .catch(err => {
        if (err.code && err.code === "ECONNABORTED") {
          return Promise.reject(
            new ApiError(408, "timeout", "The connection timed out")
          );
        }

        switch (err.response.status) {
          case 401: // Unauthorized
            status = "getAllWalletsUnauthorized";
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
  }
};
