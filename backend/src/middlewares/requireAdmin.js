const { ForbiddenError } = require("../utils/errors");

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return next(new ForbiddenError());
  }

  return next();
};

module.exports = requireAdmin;
