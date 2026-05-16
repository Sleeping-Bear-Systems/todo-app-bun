import type { AppVariables } from "@shared/appVariables.ts";
import { Hono } from "hono";

export const pingApi = new Hono<{ Variables: AppVariables }>().get("/", (c) => {
  const now = c.get("clock").now().toISOString();
  return c.json({ now }, 200);
});
