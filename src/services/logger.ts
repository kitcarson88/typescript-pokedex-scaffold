const winston = require("winston");
const path = require("path");
const fs = require("fs");
const appRoot = require("app-root-path");

require("winston-daily-rotate-file");

import "../utils/extensions/date.extension";

import { configuration } from "../constants";
import { HttpMethods } from "../models/enum/http-methods.enum";

const logDirectory = path.resolve(`${appRoot}`, "logs");
if (!fs.existsSync(logDirectory))
  fs.mkdirSync(logDirectory);

const timestampFormat = () =>
  new Date().format(configuration.LOGGER_DATE_FORMAT);

const uppercaseLevelFormat = (info: any) => {
  info.level = info.level.toUpperCase();
  return info;
};

const fileFormat = winston.format.combine(
  winston.format(uppercaseLevelFormat)(),
  winston.format.simple(),
  winston.format.timestamp({
    format: timestampFormat,
  }),
  winston.format.printf((info: any) =>  `[${info.timestamp}] ${info.level}: ${info.message}`)
);

const consoleFormat = winston.format.combine(
  winston.format(uppercaseLevelFormat)(),
  winston.format.colorize(),
  winston.format.simple(),
  winston.format.timestamp({
    format: timestampFormat,
  }),
  winston.format.printf((info: any) =>  `[${info.timestamp}] ${info.level}: ${info.message}`)
);

// options for logger object
const options = {
  allLogs: {
    level: "debug",
    filename: `${logDirectory}/app-%DATE%.log`,
    datePattern: "DD-MM-YYYY",
    format: fileFormat,
    handleExceptions: true,
    json: true,
    zippedArchive: true,
    maxSize: 5242880, // 5MB
    maxFiles: "30d"
  },
  infoFile: {
    level: "info",
    filename: `${logDirectory}/info-%DATE%.log`,
    datePattern: "DD-MM-YYYY",
    format: fileFormat,
    handleExceptions: true,
    json: true,
    zippedArchive: true,
    maxSize: 5242880, // 5MB
    maxFiles: "30d"
  },
  errorFile: {
    level: "error",
    filename: `${logDirectory}/error-%DATE%.log`,
    datePattern: "DD-MM-YYYY",
    format: fileFormat,
    handleExceptions: true,
    json: true,
    zippedArchive: true,
    maxsize: 5242880, // 5MB
    maxFiles: "30d"
  },
  console: {
    level: "debug",
    format: consoleFormat,
    handleExceptions: true,
    json: false,
    colorize: true
  }
};

// logger object with above defined options
export const logger = winston.createLogger({
  transports: [
    new winston.transports.DailyRotateFile(options.allLogs),
    new winston.transports.DailyRotateFile(options.infoFile),
    new winston.transports.DailyRotateFile(options.errorFile),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false,
});

// writing file
logger.stream = {
  write: (message: string) => {
    logger.http(message);
  },
};


/******************** Logger utils ***************************/
function getMethodRequestToLog(callRequest: any, body: string | undefined) {
  const requestToLog: any = { };

  if (callRequest["headers"])
    requestToLog["headers"] = callRequest["headers"];
  if (callRequest["query"])
    requestToLog["queryParams"] = callRequest["query"];
  if (callRequest["params"])
    requestToLog["pathParams"] = callRequest["params"];

  switch (callRequest["method"].trim() as HttpMethods) {
    case HttpMethods.GET:
      break;
    case HttpMethods.POST:
      if (body)
        try {
          requestToLog["body"] = JSON.parse(body);
        } catch (error) {
          requestToLog["body"] = body;
        }
      break;
    case HttpMethods.PUT:
      if (body)
        try {
          requestToLog["body"] = JSON.parse(body);
        } catch (error) {
          requestToLog["body"] = body;
        }
      break;
    case HttpMethods.PATCH:
      break;
    case HttpMethods.DELETE:
      break;
  }

  return JSON.stringify(requestToLog);
}

export function logRequestAndResponse(req: any, res: any, next: any) {
  // Log request
  let originalUrl = req["originalUrl"];
  const indexOfQuery = originalUrl.indexOf("?");
  if (indexOfQuery >= 0)
    originalUrl = originalUrl.substring(0, indexOfQuery);

  const reqChunks: any = [];
  req.on("data", (chunk: any) => {
    reqChunks.push(chunk);
  });

  req.on("end", (chunk: any) => {
    if (chunk)
      reqChunks.push(chunk);

    const reqBody = Buffer.concat(reqChunks).toString("utf8");
    logger.info(`API Request ${originalUrl} ${req.method} =>\n\t${getMethodRequestToLog(req, reqBody)}`);
  });

  // Log response
  const oldWrite = res.write,
      oldEnd = res.end;
  const resChunks: any = [];

  res.write = function(chunk: any) {
    resChunks.push(chunk);
    return oldWrite.apply(res, arguments);
  };

  res.end = function(chunk: any) {
    if (chunk)
    resChunks.push(chunk);

    const body = Buffer.concat(resChunks).toString("utf8");
    if (res.statusCode === 200)
      logger.info(`API Response ${originalUrl} ${req.method} =>\n\t${body}`);
    else
      logger.error(`API Response ${originalUrl} ${req.method} =>\n\t${body}`);

    oldEnd.apply(res, arguments);
  };

  next();
}