import type { AppVariables } from "@shared/appVariables.ts";
import { Hono } from "hono";

export const addToDoApi = new Hono<{ Variables: AppVariables }>().post(
  "/",
  (c) => {
    return c.json({}, 200);
  },
);
