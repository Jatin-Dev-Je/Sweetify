require("dotenv").config();

const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://localhost:27017/sweetify";

let server;

async function startServer() {
  await connectDB(MONGO_URI);
  console.log("MongoDB connected");

  server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`Sweetify backend listening on port ${PORT}`);
  });

  return server;
}

async function stopServer() {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
    server = null;
  }
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
}

// Export app for Vercel serverless
module.exports = app;
module.exports.startServer = startServer;
module.exports.stopServer = stopServer;
