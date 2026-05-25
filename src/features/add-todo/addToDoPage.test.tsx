import { describe, expect, test } from "bun:test";
import { createAppConfig } from "@shared/appConfig.ts";
import { createAppConfigMiddleware } from "@shared/appConfigMiddleware.ts";
import type { AppVariables } from "@shared/appVariables.ts";
import {
  createTodoJwtPayload,
  type JwtPayload,
} from "@shared/pageJwtMiddleware.ts";
import { pageRoutes } from "@shared/pageRoutes.ts";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import { addToDoPage } from "./addToDoPage.tsx";

const fixedPayloadDate = new Date("2024-01-01T00:00:00.000Z");
const fixedIatInSeconds = Math.floor(fixedPayloadDate.getTime() / 1000);
const fixedExpInSeconds = Math.floor(
  new Date("2100-01-01T00:00:00.000Z").getTime() / 1000,
);

const createJwtPayload = (): JwtPayload => {
  return {
    ...createTodoJwtPayload("1234", "admin", "admin", fixedPayloadDate),
    exp: fixedExpInSeconds,
    iat: fixedIatInSeconds,
  };
};

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
    const token = await sign(createJwtPayload(), appConfig.jwt.secret, "HS256");
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
