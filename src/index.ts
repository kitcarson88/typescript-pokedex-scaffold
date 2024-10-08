// src/index.js
import dotenv from "dotenv";
import express, { Express } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import examplesRoutes from "./api/example.api";
import overridedRoutes from "./api/overrides.api";
import { wsUrls } from "./constants";
import { logger, logRequestAndResponse } from "./services/logger";

const morgan = require("morgan");
const path = require("path");
const fs = require("fs");

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

/************ INITIALIZE LOGGER *******************/
// Request and response logs
app.use(logRequestAndResponse);

const logDirectory = path.join(__dirname, "logs");
if (!fs.existsSync(logDirectory))
  fs.mkdirSync(logDirectory);

app.use(
  morgan(":remote-addr - :remote-user \":method :url HTTP/:http-version\" :status :res[content-length] \":referrer\" \":user-agent\"",
  { stream: logger.stream })
);
/*************************************************/

app.use(express.json());
app.use("/examples", examplesRoutes);
app.use("/", overridedRoutes);

const envProxy = createProxyMiddleware({
  target: wsUrls.POKEAPI,
  changeOrigin: true,
  ws: true,
});
app.use("/", envProxy);

app.use((err: any, _req: any, res: any, next: any) => {
  logger.error("Internal Server Error");
  res.status(err.status || 500).send("Internal Server Error");
  next();
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
app.on("error", (error: any) => logger.error(error));