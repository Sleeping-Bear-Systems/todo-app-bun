import { describe, expect, test } from "bun:test";
import type { AppVariables } from "@shared/appVariables.ts";
import { pageRoutes } from "@shared/pageRoutes.ts";
import { Hono } from "hono";
import { aboutPage } from "./aboutPage.tsx";

describe("aboutPage", () => {
  test("renders the about page HTML", async () => {
    const app = new Hono<{ Variables: AppVariables }>().route(
      pageRoutes.ABOUT,
      aboutPage,
    );

    const response = await app.fetch(
      new Request(`http://localhost${pageRoutes.ABOUT}`),
    );
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toContain("<title>ToDo</title>");
    expect(html).toContain("<h1>About</h1>");
    expect(html).toContain("<h2>Powered By</h2>");
    expect(html).toContain("<ul>");
  });

  test("renders unauthenticated navigation links", async () => {
    const app = new Hono<{ Variables: AppVariables }>().route(
      pageRoutes.ABOUT,
      aboutPage,
    );

    const response = await app.fetch(
      new Request(`http://localhost${pageRoutes.ABOUT}`),
    );
    const html = await response.text();

    expect(html).toContain('<a href="/login">Login</a>');
    expect(html).not.toContain('<a href="/about">About</a>');
    expect(html).not.toContain("Logout");
  });

  test("renders all powered-by entries and links", async () => {
    const app = new Hono<{ Variables: AppVariables }>().route(
      pageRoutes.ABOUT,
      aboutPage,
    );

    const response = await app.fetch(
      new Request(`http://localhost${pageRoutes.ABOUT}`),
    );
    const html = await response.text();

    expect(html).toContain("Bun:");
    expect(html).toContain('href="https://bun.com/"');
    expect(html).toContain(
      'href="https://bun.com/" target="_blank" rel="noopener noreferrer"',
    );
    expect(html).toContain('class="powered-by-link"');
    expect(html).toContain('src="/images/bun.svg"');
    expect(html).toContain("Hono:");
    expect(html).toContain('href="https://hono.dev"');
    expect(html).toContain(
      'href="https://hono.dev" target="_blank" rel="noopener noreferrer"',
    );
    expect(html).toContain('src="/images/hono.svg"');
    expect(html).toContain("Datastar:");
    expect(html).toContain('href="https://data-star.dev"');
    expect(html).toContain(
      'href="https://data-star.dev" target="_blank" rel="noopener noreferrer"',
    );
    expect(html).toContain('src="/images/datastar.svg"');
    expect(html).toContain("Biome:");
    expect(html).toContain('href="https://biomejs.dev"');
    expect(html).toContain(
      'href="https://biomejs.dev" target="_blank" rel="noopener noreferrer"',
    );
    expect(html).toContain('src="/images/biome.svg"');
  });
});
