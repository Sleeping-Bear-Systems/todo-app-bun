import { describe, expect, test } from "bun:test";
import type { AppVariables } from "@shared/appVariables.ts";
import { Hono } from "hono";
import { homePage } from "./homePage.tsx";

describe("homePage", () => {
  test("homePage renders the home page HTML", async () => {
    const app = new Hono<{ Variables: AppVariables }>().route("/", homePage);

    const response = await app.fetch(new Request("http://localhost/"));
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toContain("<title>Art Show Tools</title>");
    expect(html).toContain("<h1>Home</h1>");
  });
});
