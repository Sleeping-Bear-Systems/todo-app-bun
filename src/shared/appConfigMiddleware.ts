import type { MiddlewareHandler } from "hono";
import type { AppConfig } from "./appConfig.ts";
import type { AppVariables } from "./appVariables.ts";

export function createAppConfigMiddleware(
  appConfig: AppConfig,
): MiddlewareHandler<{ Variables: AppVariables }> {
  return async (c, next) => {
    c.set("appConfig", appConfig);
    await next();
  };
}
