import type { AppConfig } from "@shared/appConfig.ts";
import type { Clock } from "@shared/clock.ts";

export type AppVariables = {
  clock: Clock;
  appConfig: AppConfig;
};
