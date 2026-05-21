import { createMiddleware } from "hono/factory";
import { jwt } from "hono/jwt";
import type { AppVariables } from "./appVariables.ts";

export const pageJwtMiddleware = createMiddleware<{ Variables: AppVariables }>(
  async (c, next) => {
    const appConfig = c.var.appConfig;
    return await jwt({
      secret: appConfig.jwt.secret,
      cookie: appConfig.jwt.cookieName,
      alg: "HS256",
    })(c, next);
  },
);
