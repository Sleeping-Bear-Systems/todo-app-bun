import { Hono } from "hono";

export const pingApi = new Hono().get("/", (c) => {
  return c.json({}, 200);
});
