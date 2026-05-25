import { describe, expect, test } from "bun:test";
import type { AppVariables } from "@shared/appVariables.ts";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import { createAppConfig } from "./appConfig.ts";
import { createAppConfigMiddleware } from "./appConfigMiddleware.ts";
import { pageJwtMiddleware } from "./pageJwtMiddleware.ts";
import { pageRoutes } from "./pageRoutes.ts";

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
    const token = await sign(
      {
        sub: "1234",
        preferred_username: "admin",
        role: "admin",
        iss: "todo-app",
        exp: 2000000000,
        iat: 1700000000,
      },
      appConfig.jwt.secret,
      "HS256",
    );
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
    const token = await sign(
      {
        sub: "1234",
        preferred_username: "admin",
        role: "admin",
        iss: "todo-app",
        exp: 2000000000,
        iat: 1700000000,
      },
      appConfig.jwt.secret,
      "HS256",
    );
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
