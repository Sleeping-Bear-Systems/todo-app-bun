import { describe, expect, test } from "bun:test";
import type { AppVariables } from "@shared/appVariables.ts";
import { Hono } from "hono";

import { createTaskPage } from "./createTaskPage";

describe("createTaskPage", () => {
  test("renders the create task page HTML", async () => {
    const app = new Hono<{ Variables: AppVariables }>().route(
      "/",
      createTaskPage,
    );

    const response = await app.fetch(new Request("http://localhost/"));
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toMatchSnapshot();
  });
});
