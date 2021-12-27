// TODO: Check for all possible error codes
import ApiError from "./ApiError";
import api from "./ApiHeaderV2";

const makeCreateRequest = template => (data) => {
  let status, message;
  return api
    .post(`/profiles/${template}`, data)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      if (err.code && err.code == "ECONNABORTED") {
        return Promise.reject(
          new ApiError(408, "timeout", "The connection timed out")
        );
      }

      switch (err.response.status) {
        case 400: // Bad Request
          status = "createBadRequest";
          message = "Invalid form data";
          break;
        case 401: // Unauthorized
          status = "createUnauthorized";
          message = "You are not logged in";
          break;
        case 409: // Conflict
          status = "createConflict";
          message = "A profile already exists";
          break;
        case 422: // Unprocessable Entity
          status = "createBadRequest";
          message = "Invalid form data";
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

const makeEditRequest = template => (id, data) => {
  let status, message;
  return api
    .put(`/profiles/${template}/${id}`, data)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      if (err.code && err.code == "ECONNABORTED") {
        return Promise.reject(
          new ApiError(408, "timeout", "The connection timed out")
        );
      }

      switch (err.response.status) {
        case 400: // Bad Request
          status = "editBadRequest";
          message = "Invalid form data";
          break;
        case 401: // Unauthorized
          status = "editUnauthorized";
          message = "You are not logged in";
          break;
        case 404: // Not found
          status = "editNotFound";
          message = "Profile not found";
          break;
        case 422: // Bad Request
          status = "editBadRequest";
          message = "Invalid form data";
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
  /**
   * Create a new profile
   * POST: ${process.env.VUE_APP_API_URL}/infouser
   * @param {Object} data Profile details
   * @param {String} token Authentication token
   * @returns {Promise<Boolean|ApiError>}
   */
  CreateNational: makeCreateRequest("national"),
  CreateForeign: makeCreateRequest("foreign"),
  /**
   * Edit an existing profile (address only)
   * PUT: ${process.env.VUE_APP_API_URL}/infouser/:id
   * @param {Number} id Profile ID
   * @param {Object} data Profile details
   * @param {String} token Authentication token
   * @returns {Promise<Boolean|ApiError>}
   */
  EditNational: makeEditRequest("national"),
  EditForeign: makeEditRequest("foreign"),
  /**
   * Get profile by ID
   * GET: ${process.env.VUE_APP_API_URL}/infouser/:id
   * @param {Number} id Profile ID
   * @param {String} token Authentication token
   * @returns {Promise<Object|ApiError>}
   */
  Get(id) {
    let status, message;
    return api
      .get(`/profiles/${id}`)
      .then(resp => resp.data)
      .catch(err => {
        if (err.code && err.code == "ECONNABORTED") {
          return Promise.reject(
            new ApiError(408, "timeout", "The connection timed out")
          );
        }

        switch (err.response.status) {
          case 401: // Unauthorized
            status = "getUnauthorized";
            message = "You are not logged in";
            break;
          case 404: // Not found
            status = "getNotFound";
            message = "Profile not found";
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
   * Get all profiles
   * GET: ${process.env.VUE_APP_API_URL}/infouser
   * @param {String} token Authentication token
   * @returns {Promise<Object|ApiError>}
   */
  GetByUserId(userId) {
    let status, message;
    return api
      .get(`/profiles/${userId}`)
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
            status = "getAllUnauthorized";
            message = "You are not logged in";
            break;
          case 404: // No profile found
            return null;
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
