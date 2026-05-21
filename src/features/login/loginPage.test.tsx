import { describe, expect, test } from "bun:test";
import { apiRoutes } from "@shared/apiRoutes.ts";
import type { AppVariables } from "@shared/appVariables.ts";
import { Hono } from "hono";
import { loginPage } from "./loginPage.tsx";

describe("loginPage", () => {
  test("renders the login page HTML", async () => {
    const app = new Hono<{ Variables: AppVariables }>().route("/", loginPage);

    const response = await app.fetch(new Request("http://localhost/"));
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toContain("<title>ToDo</title>");
    expect(html).toContain("<h1>Login</h1>");
    expect(html).toContain('<form id="login"');
    expect(html).toContain('data-on:submit="@post(');
    expect(html).toContain('<label for="username">Username</label>');
    expect(html).toContain('<input id="username" type="text" name="username"');
    expect(html).toContain('autocomplete="username"');
    expect(html).toContain('<label for="password">Password</label>');
    expect(html).toContain(
      '<input id="password" type="password" name="password"',
    );
    expect(html).toContain('autocomplete="current-password"');
    expect(html).toContain('<button type="submit">Login</button>');
    expect(html).toContain(apiRoutes.LOGIN);
    expect(html).toContain("contentType: &#39;form&#39;");
  });
});
