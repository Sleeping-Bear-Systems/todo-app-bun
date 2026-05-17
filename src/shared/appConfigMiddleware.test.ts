import { describe, expect, test } from "bun:test";
import { createAppConfig } from "@shared/appConfig.ts";
import { createAppConfigMiddleware } from "@shared/appConfigMiddleware.ts";
import type { AppVariables } from "@shared/appVariables.ts";
import { Hono } from "hono";

describe("createAppConfigMiddleware", () => {
  test("injects app config into the request context", async () => {
    const appConfig = createAppConfig({
      PORT: "8080",
      JWT_SECRET: "12345678901234567890123456789012",
    });

    const app = new Hono<{ Variables: AppVariables }>()
      .use("*", createAppConfigMiddleware(appConfig))
      .get("/", (c) => {
        const injected = c.get("appConfig");
        return c.json(injected, 200);
      });

    const response = await app.fetch(new Request("http://localhost/"));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(appConfig);
  });

  test("calls next so the route handler is reached", async () => {
    const appConfig = createAppConfig({
      JWT_SECRET: "12345678901234567890123456789012",
    });
    let handlerReached = false;

    const app = new Hono<{ Variables: AppVariables }>()
      .use("*", createAppConfigMiddleware(appConfig))
      .get("/", (c) => {
        handlerReached = true;
        return c.json({}, 200);
      });

    await app.fetch(new Request("http://localhost/"));

    expect(handlerReached).toBe(true);
  });
});
