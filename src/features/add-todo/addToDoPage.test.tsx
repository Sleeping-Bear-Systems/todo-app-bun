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
      .route("/", addToDoPage);

    const response = await app.fetch(new Request("http://localhost/"));

    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe(pageRoutes.LOGIN);
  });

  test("renders the add todo page HTML when JWT cookie is valid", async () => {
    const appConfig = createAppConfig({
      JWT_SECRET: "12345678901234567890123456789012",
    });
    const token = await sign({ sub: "admin" }, appConfig.jwt.secret, "HS256");
    const app = new Hono<{ Variables: AppVariables }>()
      .use("*", createAppConfigMiddleware(appConfig))
      .route("/", addToDoPage);

    const response = await app.fetch(
      new Request("http://localhost/", {
        headers: {
          Cookie: `${appConfig.jwt.cookieName}=${token}`,
        },
      }),
    );
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toContain("Add ToDo");
  });
});
