import { describe, expect, test } from "bun:test";
import type { AppVariables } from "@shared/appVariables.ts";
import { Hono } from "hono";
import { createToDoPage } from "./createToDoPage";

describe("createToDoPage", () => {
  test("renders the create todo page HTML", async () => {
    const app = new Hono<{ Variables: AppVariables }>().route(
      "/",
      createToDoPage,
    );

    const response = await app.fetch(new Request("http://localhost/"));
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toContain("Create ToDo");
  });
});
