import { describe, expect, test } from "bun:test";
import { Hono } from "hono";
import { sseRedirect } from "./datastar.ts";

describe("sseRedirect", () => {
  test("returns an SSE response with the datastar redirect event", async () => {
    const app = new Hono().get("/", (c) => sseRedirect(c, "/login"));

    const response = await app.fetch(new Request("http://localhost/"));
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/event-stream");
    expect(body).toContain("event: datastar-patch-elements");
    expect(body).toContain('window.location.href="/login"');
  });

  test("includes the provided target URL in the emitted script", async () => {
    const targetUrl = "https://example.com/app/home";
    const app = new Hono().get("/", (c) => sseRedirect(c, targetUrl));

    const response = await app.fetch(new Request("http://localhost/"));
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(body).toContain(`window.location.href="${targetUrl}"`);
  });
});
