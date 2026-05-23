import type { JwtVariables } from "hono/jwt";
import type { Logger } from "winston";
import type { AppConfig } from "./appConfig.ts";
import type { Clock } from "./clock.ts";

export type AppVariables = {
  clock: Clock;
  appConfig: AppConfig;
  logger: Logger;
} & JwtVariables;
