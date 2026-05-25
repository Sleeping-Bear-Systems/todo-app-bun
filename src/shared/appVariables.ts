import type { Logger } from "winston";
import type { AppConfig } from "./appConfig.ts";
import type { ValidatedJwtPayload } from "./authentication.ts";
import type { Clock } from "./clock.ts";

export type AppVariables = {
  clock: Clock;
  appConfig: AppConfig;
  logger: Logger;
};

export type AuthenticatedAppVariables = AppVariables & {
  jwtPayload: unknown;
  validatedJwtPayload: ValidatedJwtPayload;
};
