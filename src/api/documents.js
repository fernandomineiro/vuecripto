import ApiError from "./ApiError";
import api from "./ApiHeaderV2";

export default {
  GetDocumentTypes() {
    let status, message;

    return api
      .get(`documents/types`)
      .then(res => res.data)
      .catch(err => {
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
  AddNew(formData) {
    let status, message;

    return api
      .post("documents", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      .then(res => res.data)
      .catch(err => {
        switch (err.response.status) {
          case 400: // Bad request
            status = "addNewBadRequest";
            message = "Invalid data";
            break;
          case 401: // Unauthorized
            status = "addNewUnauthorized";
            message = "You are not authenticated";
            break;
          case 404: // Not found
            status = "addNewNotFound";
            message = "Document type not found";
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
  UpdateDocument(id, formData) {
    let status, message;

    formData.append("_method", "PUT");
    return api
      .post(`documents/${id}`, formData)
      .then(res => res.data)
      .catch(err => {
        switch (err.response.status) {
          case 400: // Bad request
            status = "updateDocumentBadRequest";
            message = "Invalid data";
            break;
          case 401: // Unauthorized
            status = "updateDocumentUnauthorized";
            message = "You are not authenticated";
            break;
          case 404: // Not found
            status = "updateDocumentNotFound";
            message = "Document type not found";
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
  GetAll() {
    let status, message;

    return api
      .get("documents")
      .then(res => res.data)
      .catch(err => {
        switch (err.response.status) {
          case 401: // Unauthorized
            status = "getAllUnauthorized";
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
