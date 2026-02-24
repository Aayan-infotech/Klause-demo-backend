import { t } from "../i18n/index.js";

class ApiError extends Error {
  constructor(
    statusCode,
    messageKey = "SERVER_ERROR",
    lang = "en",
    params = {},  
    error = [],   
    stack = ""
  ) {
    super(messageKey);

    this.statusCode = statusCode;
    this.data       = null;
    this.errorCode  = messageKey;
    this.message    = t(lang, messageKey, params); // ← pass params to t()
    this.success    = false;
    this.errors     = error;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };