import { zValidator } from "@hono/zod-validator";
import { appConfig } from "@shared/appConfig.ts";
import type { AppVariables } from "@shared/appVariables.ts";
import { pageRoutes } from "@shared/pageRoutes.ts";
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
  zValidator("json", loginRequestSchema, (result, _c) => {
    if (!result.success) {
      throw new HTTPException(400, { message: "Invalid credentials" });
    }
  }),
  async (c) => {
    const now = c.get("clock").now();
    const { username, password } = c.req.valid("json");
    const user = getUserByUsername(username);
    if (user === undefined) {
      throw new HTTPException(401, { message: "Invalid credentials" });
    }
    const isPasswordValid = await Bun.password.verify(
      password,
      user?.passwordHash,
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
    );
    setCookie(c, appConfig.jwt.cookie, token, {
      httpOnly: true,
      sameSite: "Strict",
      secure: true,
      expires: addDays(now, 1),
    });
    return c.redirect(pageRoutes.HOME);
  },
);
