import { describe, expect, test } from "bun:test";
import { createAppConfig } from "@shared/appConfig.ts";
import { createAppConfigMiddleware } from "@shared/appConfigMiddleware.ts";
import type { AppVariables } from "@shared/appVariables.ts";
import { pageRoutes } from "@shared/pageRoutes.ts";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import { addToDoPage } from "./addToDoPage.tsx";

describe("addToDoPage", () => {
  test("redirects to login when JWT cookie is missing", async () => {
    const appConfig = createAppConfig({
      JWT_SECRET: "12345678901234567890123456789012",
    });
    const app = new Hono<{ Variables: AppVariables }>()
      .use("*", createAppConfigMiddleware(appConfig))
      .route(pageRoutes.ADD_TODO, addToDoPage);

    const response = await app.fetch(
      new Request(`http://localhost${pageRoutes.ADD_TODO}`),
    );

    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe(pageRoutes.LOGIN);
  });

  test("renders the add todo page HTML when JWT cookie is valid", async () => {
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
      .route(pageRoutes.ADD_TODO, addToDoPage);

    const response = await app.fetch(
      new Request(`http://localhost${pageRoutes.ADD_TODO}`, {
        headers: {
          Cookie: `${appConfig.jwt.cookieName}=${token}`,
        },
      }),
    );
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toContain("<title>ToDo</title>");
    expect(html).toContain("<h1>Add ToDo</h1>");
    expect(html).toContain('<a href="/">Home</a>');
    expect(html).not.toContain('<a href="/add-todo">Add</a>');
    expect(html).toContain('<a href="/about">About</a>');
    expect(html).toContain("<li>admin</li>");
    expect(html).toContain('<form action="/api/logout" method="post">');
  });
});
