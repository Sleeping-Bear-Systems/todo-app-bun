import type { AuthenticatedAppVariables } from "@shared/appVariables.ts";
import { Hono } from "hono";

export const addToDoApi = new Hono<{
  Variables: AuthenticatedAppVariables;
}>().post("/", (c) => {
  return c.json({}, 200);
});
