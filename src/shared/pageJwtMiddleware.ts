import { addDays } from "date-fns";
import { createMiddleware } from "hono/factory";
import { jwt } from "hono/jwt";
import z from "zod";
import type { AppVariables } from "./appVariables.ts";
import { pageRoutes } from "./pageRoutes.ts";

const jwtPayloadSchema = z.object({
  sub: z.string(),
  preferred_username: z.string(),
  role: z.string(),
  iss: z.string(),
  exp: z.number(),
  iat: z.number(),
});

export type JwtPayload = z.infer<typeof jwtPayloadSchema>;

export function createTodoJwtPayload(
  userId: string,
  username: string,
  role: string,
  now: Date,
): JwtPayload {
  const iat: number = Math.floor(now.getTime() / 1000);
  return {
    sub: userId,
    preferred_username: username,
    role,
    iss: "todo-app",
    exp: Math.floor(addDays(now, 1).getTime() / 1000),
    iat,
  };
}

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
      const jwtPayload = jwtPayloadSchema.parse(c.var.jwtPayload);
      c.set("validJwtPayload", jwtPayload);
    } catch {
      return c.redirect(pageRoutes.LOGIN);
    }

    await next();
    return;
  },
);
