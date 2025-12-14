class HttpError extends Error {
  constructor(statusCode, message, errors = undefined) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

const successResponse = (res, statusCode, data) => {
  return res.status(statusCode).json({
    success: true,
    data
  });
};

const errorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message
  });
};

const apiResponse = (data = {}, message = "OK") => ({
  success: true,
  message,
  data
});

const apiError = (message, statusCode = 400, errors = undefined) => ({
  success: false,
  message,
  statusCode,
  errors
});

module.exports = { apiResponse, apiError, HttpError, successResponse, errorResponse };
