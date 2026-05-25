import { describe, expect, test } from "bun:test";
import { addDays } from "date-fns";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import { createAppConfig } from "./appConfig.ts";
import { createAppConfigMiddleware } from "./appConfigMiddleware.ts";
import type { AppVariables } from "./appVariables.ts";
import {
  createTodoJwtPayload,
  type JwtPayload,
  pageJwtMiddleware,
} from "./pageJwtMiddleware.ts";
import { pageRoutes } from "./pageRoutes.ts";

const fixedPayloadDate = new Date("2024-01-01T00:00:00.000Z");
const fixedIatInSeconds = Math.floor(fixedPayloadDate.getTime() / 1000);
const fixedExpInSeconds = Math.floor(
  new Date("2100-01-01T00:00:00.000Z").getTime() / 1000,
);

const createJwtPayload = (overrides: Partial<JwtPayload> = {}): JwtPayload => {
  return {
    ...createTodoJwtPayload("1234", "admin", "admin", fixedPayloadDate),
    exp: fixedExpInSeconds,
    iat: fixedIatInSeconds,
    ...overrides,
  };
};

describe("pageJwtMiddleware", () => {
  test("redirects to login when JWT cookie is missing", async () => {
    const appConfig = createAppConfig({
      JWT_SECRET: "12345678901234567890123456789012",
    });
    const app = new Hono<{ Variables: AppVariables }>()
      .use("*", createAppConfigMiddleware(appConfig))
      .use("*", pageJwtMiddleware)
      .get("/", (c) => c.text("ok", 200));

    const response = await app.fetch(new Request("http://localhost/"));

    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe(pageRoutes.LOGIN);
  });

  test("redirects to login when JWT cookie is invalid", async () => {
    const appConfig = createAppConfig({
      JWT_SECRET: "12345678901234567890123456789012",
    });
    const app = new Hono<{ Variables: AppVariables }>()
      .use("*", createAppConfigMiddleware(appConfig))
      .use("*", pageJwtMiddleware)
      .get("/", (c) => c.text("ok", 200));

    const response = await app.fetch(
      new Request("http://localhost/", {
        headers: {
          Cookie: `${appConfig.jwt.cookieName}=invalid-token`,
        },
      }),
    );

    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe(pageRoutes.LOGIN);
  });

  test("calls next when JWT cookie is valid", async () => {
    const appConfig = createAppConfig({
      JWT_SECRET: "12345678901234567890123456789012",
    });
    const token = await sign(createJwtPayload(), appConfig.jwt.secret, "HS256");
    let handlerReached = false;
    const app = new Hono<{ Variables: AppVariables }>()
      .use("*", createAppConfigMiddleware(appConfig))
      .use("*", pageJwtMiddleware)
      .get("/", (c) => {
        handlerReached = true;
        return c.text("ok", 200);
      });

    const response = await app.fetch(
      new Request("http://localhost/", {
        headers: {
          Cookie: `${appConfig.jwt.cookieName}=${token}`,
        },
      }),
    );

    expect(response.status).toBe(200);
    expect(handlerReached).toBe(true);
  });

  test("does not redirect when downstream handler throws", async () => {
    const appConfig = createAppConfig({
      JWT_SECRET: "12345678901234567890123456789012",
    });
    const token = await sign(createJwtPayload(), appConfig.jwt.secret, "HS256");
    const app = new Hono<{ Variables: AppVariables }>()
      .use("*", createAppConfigMiddleware(appConfig))
      .use("*", pageJwtMiddleware)
      .get("/", () => {
        throw new Error("handler failed");
      });

    const response = await app.fetch(
      new Request("http://localhost/", {
        headers: {
          Cookie: `${appConfig.jwt.cookieName}=${token}`,
        },
      }),
    );

    expect(response.status).toBe(500);
  });
});

describe("createTodoJwtPayload", () => {
  test("maps user fields and static issuer", () => {
    const now = new Date("2026-05-24T12:00:00.000Z");

    const payload = createTodoJwtPayload("user-123", "admin", "editor", now);

    expect(payload.sub).toBe("user-123");
    expect(payload.preferred_username).toBe("admin");
    expect(payload.role).toBe("editor");
    expect(payload.iss).toBe("todo-app");
  });

  test("sets iat to current time in seconds", () => {
    const now = new Date("2026-05-24T12:34:56.000Z");

    const payload = createTodoJwtPayload("user-1", "user", "admin", now);

    expect(payload.iat).toBe(Math.floor(now.getTime() / 1000));
  });

  test("sets exp to one day after current time in seconds", () => {
    const now = new Date("2026-05-24T12:34:56.000Z");

    const payload = createTodoJwtPayload("user-1", "user", "admin", now);

    expect(payload.exp).toBe(Math.floor(addDays(now, 1).getTime() / 1000));
    expect(payload.exp - payload.iat).toBe(24 * 60 * 60);
  });

  test("floors fractional milliseconds for both iat and exp", () => {
    const now = new Date("2026-05-24T12:34:56.789Z");

    const payload = createTodoJwtPayload("user-1", "user", "admin", now);

    expect(payload.iat).toBe(Math.floor(now.getTime() / 1000));
    expect(payload.exp).toBe(Math.floor(addDays(now, 1).getTime() / 1000));
  });
});
