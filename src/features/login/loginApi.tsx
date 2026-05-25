import { zValidator } from "@hono/zod-validator";
import type { AppVariables } from "@shared/appVariables.ts";
import { sseRedirect } from "@shared/datastar.ts";
import { pageRoutes } from "@shared/routes.ts";
import { getUserByUsername } from "@shared/user.ts";
import { addDays } from "date-fns";
import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { sign } from "hono/jwt";
import z from "zod";

const loginRequestSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const loginApi = new Hono<{ Variables: AppVariables }>().post(
  "/",
  zValidator("form", loginRequestSchema, (result, _c) => {
    if (!result.success) {
      throw new HTTPException(400, { message: "Invalid credentials" });
    }
  }),
  async (c) => {
    const appConfig = c.var.appConfig;
    const now = c.var.clock.now();
    const { username, password } = c.req.valid("form");
    const user = getUserByUsername(username);
    if (user === undefined) {
      throw new HTTPException(401, { message: "Invalid credentials" });
    }
    const isPasswordValid = await Bun.password.verify(
      password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new HTTPException(401, { message: "Invalid credentials" });
    }
    const token = await sign(
      {
        sub: user.id,
        preferred_username: user.username,
        role: "admin",
        iss: "todo-app",
        exp: Math.floor(addDays(now, 1).getTime() / 1000),
        iat: Math.floor(now.getTime() / 1000),
      },
      appConfig.jwt.secret,
      "HS256",
    );
    setCookie(c, appConfig.jwt.cookieName, token, {
      httpOnly: true,
      sameSite: "Strict",
      secure: appConfig.environment !== "development",
      expires: addDays(now, 1),
    });
    return await sseRedirect(c, pageRoutes.HOME);
  },
);
