import { describe, expect, test } from "bun:test";
import type { AppVariables } from "@shared/appVariables.ts";
import { Hono } from "hono";
import { aboutPage } from "./aboutPage.tsx";

describe("aboutPage", () => {
  test("renders the about page HTML", async () => {
    const app = new Hono<{ Variables: AppVariables }>().route("/", aboutPage);

    const response = await app.fetch(new Request("http://localhost/"));
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toContain("<title>ToDo</title>");
    expect(html).toContain("<h1>About</h1>");
    expect(html).toContain('<a href="/">Home</a>');
    expect(html).toContain("<h2>Powered By</h2>");
    expect(html).toContain("<th>Name</th>");
    expect(html).toContain("<th>Link</th>");
    expect(html).toContain("<td>Biome</td>");
    expect(html).toContain("https://biomejs.dev");
    expect(html).toContain("<td>Hono</td>");
    expect(html).toContain("https://hono.dev");
  });
});
