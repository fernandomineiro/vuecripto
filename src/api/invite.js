import axios from "axios";
import ApiError from "./ApiError";

const api = axios.create({
  baseURL: `${process.env.VUE_APP_API_URL}/invite`,
  timeout: 15000
});

/**
 * @description Generates submit methods for different types of invite
 * @param {'email' | 'phone'} type
 * @return {(data: Array<string>, token: string) => Promise}
 */
const inviteTemplate = type => (data, token) => {
  // Constraint types to one of accepted
  if (!(type == "email" || type == "phone")) {
    throw new TypeError("Invite type must be one of the accepted types");
  }

  // Constraint data to an array
  if (!(data instanceof Array)) {
    throw new TypeError("Data must be an array");
  }

  // Capitalized type name
  const typeName = type.replace(/^./, x => x.toUpperCase());

  // Set correct data field name to the type
  const formData = {};
  formData[`${type}s`] = data;

  return api
    .post(`/${type}`, formData, { headers: { token } })
    .then(res => res.data)
    .catch(err => {
      let status, message;

      if (err.code && err.code == "ECONNABORTED") {
        return Promise.reject(
          new ApiError(408, "timeout", "The connection timed out")
        );
      }

      switch (err.response.status) {
        case 400:
          status = `invite${typeName}sBadRequest`;
          message = "Invalid form data";
          break;
        case 401:
          status = `invite${typeName}sUnauthorized`;
          message = "You are not authenticated";
          break;
        case 403:
          status = `invite${typeName}sForbidden`;
          message = "You cannot do this";
          break;
        case 406:
          status = `invite${typeName}sNotAccepted`;
          message = "You have exceeded your daily limit";
          break;
        case 500:
          return Promise.reject(ApiError.error500());
        default:
          status = "otherError";
          message = "Unexpected error";
          break;
      }

      return Promise.reject(new ApiError(err.response.status, status, message));
    });
};

export default {
  inviteEmails: inviteTemplate("email"),
  invitePhones: inviteTemplate("phone")
};
