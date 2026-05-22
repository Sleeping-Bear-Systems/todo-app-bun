import type { MiddlewareHandler } from "hono";
import type { Logger } from "winston";
import type { AppVariables } from "./appVariables.ts";

export function createLoggerMiddleware(
  logger: Logger,
): MiddlewareHandler<{ Variables: AppVariables }> {
  return async (c, next) => {
    c.set("logger", logger);
    await next();
  };
}
