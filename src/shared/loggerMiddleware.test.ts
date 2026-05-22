import { describe, expect, test } from "bun:test";
import { Hono } from "hono";
import winston from "winston";
import type { AppVariables } from "./appVariables.ts";
import { createLoggerMiddleware } from "./loggerMiddleware.ts";

describe("createLoggerMiddleware", () => {
  test("injects the logger into the request context", async () => {
    const logger = winston.createLogger({
      transports: [new winston.transports.Console({ silent: true })],
    });

    const app = new Hono<{ Variables: AppVariables }>()
      .use("*", createLoggerMiddleware(logger))
      .get("/", (c) => {
        const injected = c.var.logger;
        return c.json({ hasInfo: typeof injected.info === "function" }, 200);
      });

    const response = await app.fetch(new Request("http://localhost/"));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ hasInfo: true });
  });

  test("calls next so the route handler is reached", async () => {
    const logger = winston.createLogger({
      transports: [new winston.transports.Console({ silent: true })],
    });
    let handlerReached = false;

    const app = new Hono<{ Variables: AppVariables }>()
      .use("*", createLoggerMiddleware(logger))
      .get("/", (c) => {
        handlerReached = true;
        return c.json({}, 200);
      });

    await app.fetch(new Request("http://localhost/"));

    expect(handlerReached).toBe(true);
  });
});
