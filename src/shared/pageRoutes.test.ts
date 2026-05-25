import { describe, expect, test } from "bun:test";
import type { AppVariables } from "@shared/appVariables.ts";
import { createValidTestJwtPayload } from "@shared/testJwt.ts";
import { Hono, type MiddlewareHandler } from "hono";
import {
  createAuthenticatedPageRoutes,
  createPageRoutes,
} from "./pageRoutes.ts";
import { pageRoutes } from "./routes.ts";

describe("createPageRoutes", () => {
  test("registers login page", async () => {
    const app = new Hono<{ Variables: AppVariables }>().route(
      "/",
      createPageRoutes(),
    );

    const response = await app.fetch(
      new Request(`http://localhost${pageRoutes.LOGIN}`),
    );
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toContain("<h1>Login</h1>");
  });

  test("does not expose authenticated pages", async () => {
    const app = new Hono<{ Variables: AppVariables }>().route(
      "/",
      createPageRoutes(),
    );

    const response = await app.fetch(
      new Request(`http://localhost${pageRoutes.HOME}`),
    );

    expect(response.status).toBe(404);
  });
});

describe("createAuthenticatedPageRoutes", () => {
  test("registers authenticated pages when jwt payload is valid", async () => {
    const jwtMiddleware: MiddlewareHandler = async (c, next) => {
      c.set("jwtPayload", createValidTestJwtPayload());
      await next();
    };

    const app = new Hono<{ Variables: AppVariables }>().route(
      "/",
      createAuthenticatedPageRoutes(jwtMiddleware),
    );

    const response = await app.fetch(
      new Request(`http://localhost${pageRoutes.HOME}`),
    );
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toContain("<h1>Home</h1>");
    expect(html).toContain("admin");
  });

  test("registers authenticated about page when jwt payload is valid", async () => {
    const jwtMiddleware: MiddlewareHandler = async (c, next) => {
      c.set("jwtPayload", createValidTestJwtPayload());
      await next();
    };

    const app = new Hono<{ Variables: AppVariables }>().route(
      "/",
      createAuthenticatedPageRoutes(jwtMiddleware),
    );

    const response = await app.fetch(
      new Request(`http://localhost${pageRoutes.ABOUT}`),
    );
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toContain("<h1>About</h1>");
  });

  test("redirects to login when jwt middleware throws", async () => {
    const jwtMiddleware: MiddlewareHandler = async () => {
      throw new Error("Missing token");
    };

    const app = new Hono<{ Variables: AppVariables }>().route(
      "/",
      createAuthenticatedPageRoutes(jwtMiddleware),
    );

    const response = await app.fetch(
      new Request(`http://localhost${pageRoutes.ADD_TODO}`),
      {
        redirect: "manual",
      },
    );

    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe(pageRoutes.LOGIN);
  });
});
