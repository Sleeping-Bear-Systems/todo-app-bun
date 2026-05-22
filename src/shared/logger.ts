import { SeqTransport } from "@datalust/winston-seq";
import winston from "winston";
import type { AppConfig } from "./appConfig.ts";

export function createLogger(appConfig: AppConfig): winston.Logger {
  // add console logging
  const transports: winston.transport[] = [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ];

  // check Seq configuration
  if (appConfig.seq.apiKey !== undefined && appConfig.seq.url !== undefined) {
    // add Seq logging
    transports.push(
      new SeqTransport({
        serverUrl: appConfig.seq.url,
        apiKey: appConfig.seq.apiKey,
        onError: (e) => {
          console.error(e);
        },
        handleExceptions: true,
        handleRejections: true,
      }),
    );
  }

  return winston.createLogger({
    level: "info",
    format: winston.format.combine(
      // This is required to get errors to log with stack traces. See https://github.com/winstonjs/winston/issues/1498
      winston.format.errors({ stack: true }),
      winston.format.json(),
    ),
    defaultMeta: {
      application: "todo-app",
    },
    transports,
  });
}
