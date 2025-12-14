const { ValidationError } = require("../utils/errors");

const validateRequest = (schema, property = "body") => (req, res, next) => {
  const payload = property === "query" ? req.query : req.body;
  const { error, value } = schema.validate(payload, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const details = error.details.map((detail) => detail.message);
    return next(new ValidationError(details[0] ?? "Validation failed", details));
  }

  if (property === "query") {
    req.validatedQuery = value;
  } else {
    req.validatedBody = value;
  }

  return next();
};

module.exports = validateRequest;
