import { describe, expect, test } from "bun:test";
import { createClockMiddleware } from "@shared/clockMiddleware.ts";
import { Hono } from "hono";
import type { AppVariables } from "./appVariables.ts";
import { createFixedClock } from "./clock.ts";

describe("createClockMiddleware", () => {
  test("injects the clock into the request context", async () => {
    const fixed = new Date("2026-01-01T00:00:00.000Z");
    const clock = createFixedClock(fixed);

    const app = new Hono<{ Variables: AppVariables }>()
      .use("*", createClockMiddleware(clock))
      .get("/", (c) => {
        const injected = c.var.clock;
        return c.json({ now: injected.now().toISOString() }, 200);
      });

    const response = await app.fetch(new Request("http://localhost/"));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ now: fixed.toISOString() });
  });

  test("calls next so the route handler is reached", async () => {
    const clock = createFixedClock(new Date("2026-01-01T00:00:00.000Z"));
    let handlerReached = false;

    const app = new Hono<{ Variables: AppVariables }>()
      .use("*", createClockMiddleware(clock))
      .get("/", (c) => {
        handlerReached = true;
        return c.json({}, 200);
      });

    await app.fetch(new Request("http://localhost/"));

    expect(handlerReached).toBe(true);
  });
});
