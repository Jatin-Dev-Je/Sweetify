const { HttpError } = require("./apiResponse");

class ConflictError extends HttpError {
  constructor(message = "Conflict") {
    super(409, message);
  }
}

class AuthenticationError extends HttpError {
  constructor(message = "Authentication failed") {
    super(401, message);
  }
}

class ValidationError extends HttpError {
  constructor(message = "Validation failed", errors = undefined) {
    super(400, message, errors);
  }
}

class NotFoundError extends HttpError {
  constructor(message = "Resource not found") {
    super(404, message);
  }
}

class ForbiddenError extends HttpError {
  constructor(message = "Forbidden") {
    super(403, message);
  }
}

class OutOfStockError extends HttpError {
  constructor(message = "Sweet is out of stock") {
    super(400, message);
  }
}

module.exports = {
  ConflictError,
  AuthenticationError,
  ValidationError,
  NotFoundError,
  ForbiddenError,
  OutOfStockError,
};
