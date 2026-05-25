import { describe, expect, test } from "bun:test";
import type { AppVariables } from "@shared/appVariables.ts";
import { createFixedClock } from "@shared/clock.ts";
import { createClockMiddleware } from "@shared/clockMiddleware.ts";
import { createValidTestJwtPayload } from "@shared/testJwt.ts";
import { Hono, type MiddlewareHandler } from "hono";
import { createApiRoutes, createAuthenticatedApiRoutes } from "./apiRoutes.ts";

describe("createApiRoutes", () => {
  test("registers ping endpoint", async () => {
    const fixedNow = new Date("2026-01-01T00:00:00.000Z");
    const app = new Hono<{ Variables: AppVariables }>()
      .use("*", createClockMiddleware(createFixedClock(fixedNow)))
      .route("/api", createApiRoutes());

    const response = await app.fetch(new Request("http://localhost/api/ping"));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ now: fixedNow.toISOString() });
  });

  test("does not expose authenticated add-todo endpoint", async () => {
    const app = new Hono<{ Variables: AppVariables }>().route(
      "/api",
      createApiRoutes(),
    );

    const response = await app.fetch(
      new Request("http://localhost/api/auth/add-todo", { method: "POST" }),
    );

    expect(response.status).toBe(404);
  });
});

describe("createAuthenticatedApiRoutes", () => {
  test("allows add-todo when jwt payload is valid", async () => {
    const jwtMiddleware: MiddlewareHandler = async (c, next) => {
      c.set("jwtPayload", createValidTestJwtPayload());
      await next();
    };

    const app = new Hono<{ Variables: AppVariables }>().route(
      "/api",
      createAuthenticatedApiRoutes(jwtMiddleware),
    );

    const response = await app.fetch(
      new Request("http://localhost/api/auth/add-todo", { method: "POST" }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({});
  });

  test("returns 401 when jwt payload is invalid", async () => {
    const jwtMiddleware: MiddlewareHandler = async (c, next) => {
      c.set("jwtPayload", { preferred_username: "admin" });
      await next();
    };

    const app = new Hono<{ Variables: AppVariables }>().route(
      "/api",
      createAuthenticatedApiRoutes(jwtMiddleware),
    );

    const response = await app.fetch(
      new Request("http://localhost/api/auth/add-todo", { method: "POST" }),
    );

    expect(response.status).toBe(401);
    expect(await response.text()).toContain("Invalid token");
  });
});
