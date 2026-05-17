import { describe, expect, test } from "bun:test";
import { ZodError } from "zod";
import { createAppConfig } from "./appConfig.ts";

describe("createAppConfig", () => {
  test("uses the default port when PORT is missing", () => {
    const appConfig = createAppConfig({});

    expect(appConfig).toEqual({ port: 3000 });
  });

  test("coerces PORT to a number", () => {
    const appConfig = createAppConfig({ PORT: "8080" });

    expect(appConfig).toEqual({ port: 8080 });
  });

  test("rejects ports below the valid range", () => {
    expect(() => createAppConfig({ PORT: "0" })).toThrow(ZodError);
  });

  test("rejects ports above the valid range", () => {
    expect(() => createAppConfig({ PORT: "65536" })).toThrow(ZodError);
  });
});
