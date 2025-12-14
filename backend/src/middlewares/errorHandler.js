const { apiError } = require("../utils/apiResponse");

const notFoundHandler = (_req, res) => {
  res.status(404).json(apiError("Route not found", 404));
};

// Generic error handler to keep responses consistent
const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json(apiError(message, statusCode, err.errors));
};

module.exports = { notFoundHandler, errorHandler };
