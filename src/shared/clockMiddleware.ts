import type { AppVariables } from "@shared/appVariables.ts";
import type { Clock } from "@shared/clock.ts";
import type { MiddlewareHandler } from "hono";

export function createClockMiddleware(
  clock: Clock,
): MiddlewareHandler<{ Variables: AppVariables }> {
  return async (c, next) => {
    c.set("clock", clock);
    await next();
  };
}
