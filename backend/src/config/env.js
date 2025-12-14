const path = require("path");
const dotenv = require("dotenv");

const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const config = {
  env: process.env.NODE_ENV || "development",
  port: toNumber(process.env.PORT, 5000),
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sweetify",
  jwtSecret: process.env.JWT_SECRET || "change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  bcryptSaltRounds: toNumber(process.env.BCRYPT_SALT_ROUNDS, 10),
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5173"
};

module.exports = { config };
