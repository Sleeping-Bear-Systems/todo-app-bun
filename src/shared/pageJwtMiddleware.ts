import { createMiddleware } from "hono/factory";
import { jwt } from "hono/jwt";
import type { AppVariables } from "./appVariables";

export const pageJwtMiddleware = createMiddleware<{ Variables: AppVariables }>(
  async (c, next) => {
    const appConfig = c.get("appConfig");
    return await jwt({
      secret: appConfig.jwt.secret,
      cookie: appConfig.jwt.cookieName,
      alg: "HS256",
    })(c, next);
  },
);
