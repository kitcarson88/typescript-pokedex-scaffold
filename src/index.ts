// src/index.js
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
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

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
app.on("error", (error: any) => logger.error(error));