import { expect, test } from "bun:test";

import { pingApi } from "./pingApi.ts";

test("pingApi responds with an empty JSON object", async () => {
  const response = await pingApi.fetch(new Request("http://localhost/"));

  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({});
});
