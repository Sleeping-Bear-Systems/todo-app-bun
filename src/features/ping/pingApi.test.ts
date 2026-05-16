import { expect, test } from "bun:test";
import type { AppVariables } from "@shared/appVariables.ts";
import { type Clock, createFixedClock } from "@shared/clock.ts";
import { createClockMiddleware } from "@shared/clockMiddleware.ts";
import { Hono } from "hono";

import { pingApi } from "./pingApi.ts";

test("pingApi responds with the current time from the injected clock", async () => {
  const fixedNow = new Date("2026-01-01T12:34:56.000Z");
  const testClock: Clock = createFixedClock(fixedNow);

  const app = new Hono<{ Variables: AppVariables }>()
    .use("*", createClockMiddleware(testClock))
    .route("/", pingApi);

  const response = await app.fetch(new Request("http://localhost/"));

  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({
    now: fixedNow.toISOString(),
  });
});
