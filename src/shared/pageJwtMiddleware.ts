import { createMiddleware } from "hono/factory";
import { jwt } from "hono/jwt";
import type { AppVariables } from "./appVariables.ts";
import { pageRoutes } from "./pageRoutes.ts";

export const pageJwtMiddleware = createMiddleware<{ Variables: AppVariables }>(
  async (c, next) => {
    const appConfig = c.var.appConfig;
    const verifyJwt = jwt({
      secret: appConfig.jwt.secret,
      cookie: appConfig.jwt.cookieName,
      alg: "HS256",
    });

    try {
      await verifyJwt(c, async () => {});
    } catch {
      return c.redirect(pageRoutes.LOGIN);
    }

    await next();
    return;
  },
);
