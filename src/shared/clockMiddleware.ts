import type { MiddlewareHandler } from "hono";
import type { AppVariables } from "./appVariables.ts";
import type { Clock } from "./clock.ts";

export function createClockMiddleware(
  clock: Clock,
): MiddlewareHandler<{ Variables: AppVariables }> {
  return async (c, next) => {
    c.set("clock", clock);
    await next();
  };
}
