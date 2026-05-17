import type { AppConfig } from "@shared/appConfig.ts";
import type { AppVariables } from "@shared/appVariables.ts";
import type { MiddlewareHandler } from "hono";

export function createAppConfigMiddleware(
  appConfig: AppConfig,
): MiddlewareHandler<{ Variables: AppVariables }> {
  return async (c, next) => {
    c.set("appConfig", appConfig);
    await next();
  };
}
