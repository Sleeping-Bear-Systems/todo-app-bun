import type { Logger } from "winston";
import type { AppConfig } from "./appConfig.ts";
import type { Clock } from "./clock.ts";
import type { JwtPayload } from "./pageJwtMiddleware.ts";

export type AppVariables = {
  clock: Clock;
  appConfig: AppConfig;
  logger: Logger;
  jwtPayload: unknown;
  validJwtPayload: JwtPayload;
};
