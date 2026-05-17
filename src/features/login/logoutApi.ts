import { appConfig } from "@shared/appConfig.ts";
import type { AppVariables } from "@shared/appVariables.ts";
import { pageRoutes } from "@shared/pageRoutes.ts";
import { Hono } from "hono";
import { deleteCookie } from "hono/cookie";

export const logoutApi = new Hono<{ Variables: AppVariables }>().post(
  "/",
  (c) => {
    deleteCookie(c, appConfig.jwt.cookie);
    return c.redirect(pageRoutes.LOGIN);
  },
);
