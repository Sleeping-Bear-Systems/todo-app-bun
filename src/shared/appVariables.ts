import type winston from "winston";
import type { AppConfig } from "./appConfig.ts";
import type { Clock } from "./clock.ts";

export type AppVariables = {
  clock: Clock;
  appConfig: AppConfig;
  logger: winston.Logger;
};
