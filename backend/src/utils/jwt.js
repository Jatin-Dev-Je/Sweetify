const jwt = require("jsonwebtoken");
const { config } = require("../config/env");

const generateToken = (payload, options = {}) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
    ...options,
  });
};

const verifyToken = (token) => jwt.verify(token, config.jwtSecret);

module.exports = { generateToken, verifyToken };
