const bcrypt = require("bcrypt");
const { config } = require("../config/env");

const hashPassword = async (plainPassword) => {
  return bcrypt.hash(plainPassword, config.bcryptSaltRounds);
};

const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = { hashPassword, comparePassword };
