import { describe, expect, test } from "bun:test";
import { createAppConfig } from "@shared/appConfig.ts";
import { createAppConfigMiddleware } from "@shared/appConfigMiddleware.ts";
import type { AppVariables } from "@shared/appVariables.ts";
import { apiRoutes, pageRoutes } from "@shared/routes.ts";
import { createValidTestJwtPayload } from "@shared/testJwt.ts";
import { Hono } from "hono";
import { jwt, sign } from "hono/jwt";
import { createAuthenticatedPageRoutes } from "../../shared/pageRoutes.ts";

describe("homePage", () => {
  test("redirects to login when JWT cookie is missing", async () => {
    const appConfig = createAppConfig({
      JWT_SECRET: "12345678901234567890123456789012",
    });
    const jwtMiddleware = jwt({
      secret: appConfig.jwt.secret,
      cookie: appConfig.jwt.cookieName,
      alg: "HS256",
    });
    const app = new Hono<{ Variables: AppVariables }>()
      .use("*", createAppConfigMiddleware(appConfig))
      .route("/", createAuthenticatedPageRoutes(jwtMiddleware));

    const response = await app.fetch(
      new Request(`http://localhost${pageRoutes.HOME}`),
    );

    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe(pageRoutes.LOGIN);
  });

  test("renders the home page HTML when JWT cookie is valid", async () => {
    const appConfig = createAppConfig({
      JWT_SECRET: "12345678901234567890123456789012",
    });
    const token = await sign(
      createValidTestJwtPayload(),
      appConfig.jwt.secret,
      "HS256",
    );
    const jwtMiddleware = jwt({
      secret: appConfig.jwt.secret,
      cookie: appConfig.jwt.cookieName,
      alg: "HS256",
    });
    const app = new Hono<{ Variables: AppVariables }>()
      .use("*", createAppConfigMiddleware(appConfig))
      .route("/", createAuthenticatedPageRoutes(jwtMiddleware));

    const response = await app.fetch(
      new Request(`http://localhost${pageRoutes.HOME}`, {
        headers: {
          Cookie: `${appConfig.jwt.cookieName}=${token}`,
        },
      }),
    );
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toContain("<title>ToDo</title>");
    expect(html).toContain("<h1>Home</h1>");
    expect(html).not.toContain(`<a href="${pageRoutes.HOME}">Home</a>`);
    expect(html).toContain(`<a href="${pageRoutes.ADD_TODO}">Add</a>`);
    expect(html).toContain(`<a href="${pageRoutes.ABOUT}">About</a>`);
    expect(html).toContain("<li>admin</li>");
    expect(html).toContain(`<form action="${apiRoutes.LOGOUT}" method="post">`);
  });
});
