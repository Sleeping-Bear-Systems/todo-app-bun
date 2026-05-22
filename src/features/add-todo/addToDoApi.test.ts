import { describe, expect, test } from "bun:test";
import type { AppVariables } from "@shared/appVariables.ts";
import { Hono } from "hono";
import { addToDoApi } from "./addToDoApi.tsx";

describe("addToDoApi", () => {
  test("responds with 200 and an empty object on POST", async () => {
    const app = new Hono<{ Variables: AppVariables }>().route("/", addToDoApi);

    const response = await app.fetch(
      new Request("http://localhost/", { method: "POST" }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({});
  });
});
