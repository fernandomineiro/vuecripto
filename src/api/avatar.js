import ApiError from "./ApiError";
import api from "./ApiHeaderV2";

export default {
  async getAvatarByUserId(userId) {
    let status, message;

    try {
      const res = await api.get(`/avatars/${userId}`);
      return res;
    } catch (err) {
      if (err.code && err.code == "ECONNABORTED") {
        return Promise.reject(
          new ApiError(408, "timeout", "The connection timed out")
        );
      }

      switch (err.response.status) {
        case 400:
          status = "BadRequest";
          message = "Invalid request params";
          break;
        case 401:
          status = "GetAvatarUnauthorized";
          message = "You are not authenticated";
          break;
        case 404:
          status = "AvatarNotFound";
          message = "Avatar not found";
          break;
        case 422:
          status = "BadRequest";
          message = "Invalid request inputs";
          break;
        case 500:
          return Promise.reject(ApiError.error500());
        default:
          status = "otherError";
          message = "Unexpected error";
          break;
      }

      return Promise.reject(new ApiError(err.response.status, status, message));
    }
  },
  async upload(file) {
    let status, message;

    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const res = await api.post("avatars", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return res;
    } catch (err) {
      switch (err.response.status) {
        case 400:
          status = "BadRequest";
          message = "Invalid request params";
          break;
        case 401:
          status = "Unauthorized";
          message = "You are not authenticated";
          break;
        case 422:
          status = "UnprocessableEntity";
          message = "Invalid request inputs";
          break;
        case 500:
          return Promise.reject(ApiError.error500());
        default:
          status = "otherError";
          message = "Unexpected error";
          break;
      }

      return Promise.reject(new ApiError(err.response.status, status, message));
    }
  }
};
