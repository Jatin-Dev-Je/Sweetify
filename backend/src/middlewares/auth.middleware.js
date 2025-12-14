const { verifyToken } = require("../utils/jwt");
const { AuthenticationError } = require("../utils/errors");

const extractToken = (headerValue = "") => {
  const [scheme, token] = headerValue.split(" ");
  if (scheme !== "Bearer" || !token) {
    return null;
  }
  return token;
};

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = extractToken(authHeader);

  if (!token) {
    return next(new AuthenticationError("Authentication required"));
  }

  try {
    const decoded = verifyToken(token);
    req.user = {
      id: decoded.id || decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };
    return next();
  } catch (error) {
    return next(new AuthenticationError("Invalid or expired token"));
  }
};

module.exports = authMiddleware;
