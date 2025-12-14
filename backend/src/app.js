const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const { config } = require("./config/env");
const authRoutes = require("./routes/auth.routes");
const sweetsRoutes = require("./routes/sweets.routes");
const { swaggerSpec } = require("./docs/swagger");
const { notFoundHandler, errorHandler } = require("./middlewares/errorHandler");

const app = express();

app.disable("x-powered-by");
app.use(helmet());

const allowedOrigins = config.frontendOrigin.split(",").map((origin) => origin.trim());

app.use(
	cors({
		origin: allowedOrigins,
		credentials: true,
		optionsSuccessStatus: 204,
	})
);

app.use(express.json());
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
app.get("/api/docs.json", (_req, res) => {
	res.setHeader("Content-Type", "application/json");
	res.send(swaggerSpec);
});
app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetsRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
