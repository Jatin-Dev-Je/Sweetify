require("dotenv").config();
const app = require("./src/app");

// Vercel serverless function export
module.exports = app;
