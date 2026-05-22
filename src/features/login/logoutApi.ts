import type { AppVariables } from "@shared/appVariables.ts";
import { pageRoutes } from "@shared/pageRoutes.ts";
import { Hono } from "hono";
import { deleteCookie } from "hono/cookie";

export const logoutApi = new Hono<{ Variables: AppVariables }>().post(
  "/",
  (c) => {
    const appConfig = c.var.appConfig;
    deleteCookie(c, appConfig.jwt.cookieName);
    return c.redirect(pageRoutes.LOGIN);
  },
);
