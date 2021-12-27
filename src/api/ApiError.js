export default class ApiError {
  constructor(statusCode, statusString, message) {
    this.statusCode = statusCode;
    this.statusString = statusString;
    this.message = message;
  }

  static error500() {
    return new this(500, "serverError", "Internal server error");
  }
}
