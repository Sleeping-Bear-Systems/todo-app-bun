import { createMiddleware } from "hono/factory";
import { jwt } from "hono/jwt";
import type { AuthenticatedAppVariables } from "./appVariables.ts";
import { jwtPayloadSchema } from "./authentication.ts";
import { pageRoutes } from "./pageRoutes.ts";

export const pageJwtMiddleware = createMiddleware<{
  Variables: AuthenticatedAppVariables;
}>(async (c, next) => {
  const appConfig = c.var.appConfig;
  const verifyJwt = jwt({
    secret: appConfig.jwt.secret,
    cookie: appConfig.jwt.cookieName,
    alg: "HS256",
  });

  try {
    await verifyJwt(c, async () => {});
    const validatedJwtPayload = jwtPayloadSchema.parse(c.var.jwtPayload);
    c.set("validatedJwtPayload", validatedJwtPayload);
  } catch (e) {
    console.log(e);
    return c.redirect(pageRoutes.LOGIN);
  }

  await next();
  return;
});
