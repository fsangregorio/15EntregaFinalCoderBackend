
import pino from "pino";
import pinoHttp from "pino-http";
import fs from "fs";

const logDirectory = "logs";
const isProduction = process.env.NODE_ENV === "production";
const logLevel = process.env.LOG_LEVEL || (isProduction ? "info" : "debug");

const devTransport = {
  target: "pino-pretty",
  options: {
    colorize: true,
  },
};

const prodTransport = {
  targets: [
    {
      level: "error",
      target: "pino/file",
      options: {
        destination: `${logDirectory}/error.log`,
      },
    },
  ],
};

const transport = pino.transport(isProduction ? prodTransport : devTransport);

const logger = pino(
  {
    level: logLevel,
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  transport
);

const httpLogger = pinoHttp({
  logger: logger,
});

export { logger, httpLogger };
