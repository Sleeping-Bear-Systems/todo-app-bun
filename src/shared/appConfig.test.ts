import { describe, expect, test } from "bun:test";
import { ZodError } from "zod";
import { createAppConfig } from "./appConfig.ts";

describe("createAppConfig", () => {
  const validJwtSecret = "12345678901234567890123456789012";

  test("uses the default port when PORT is missing", () => {
    const appConfig = createAppConfig({ JWT_SECRET: validJwtSecret });

    expect(appConfig).toEqual({
      port: 3000,
      environment: "development",
      jwt: { secret: validJwtSecret, cookieName: "todo-app-bun" },
      seq: { apiKey: undefined, url: undefined },
    });
  });

  test("uses the default environment when NODE_ENV is missing", () => {
    const appConfig = createAppConfig({ JWT_SECRET: validJwtSecret });

    expect(appConfig.environment).toBe("development");
  });

  test("uses NODE_ENV when it is provided", () => {
    const appConfig = createAppConfig({
      JWT_SECRET: validJwtSecret,
      NODE_ENV: "production",
    });

    expect(appConfig.environment).toBe("production");
  });

  test("coerces PORT to a number", () => {
    const appConfig = createAppConfig({
      PORT: "8080",
      JWT_SECRET: validJwtSecret,
    });

    expect(appConfig).toEqual({
      port: 8080,
      environment: "development",
      jwt: { secret: validJwtSecret, cookieName: "todo-app-bun" },
      seq: { apiKey: undefined, url: undefined },
    });
  });

  test("uses undefined seq values when seq env vars are missing", () => {
    const appConfig = createAppConfig({ JWT_SECRET: validJwtSecret });

    expect(appConfig.seq).toEqual({ apiKey: undefined, url: undefined });
  });

  test("maps seq env vars when they are provided", () => {
    const appConfig = createAppConfig({
      JWT_SECRET: validJwtSecret,
      SEQ_API_KEY: "test-api-key",
      SEQ_URL: "https://seq.example.com",
    });

    expect(appConfig.seq.apiKey).toBe("test-api-key");
    expect(appConfig.seq.url).toBe("https://seq.example.com");
  });

  test("rejects an invalid SEQ_URL", () => {
    expect(() =>
      createAppConfig({
        JWT_SECRET: validJwtSecret,
        SEQ_URL: "not-a-url",
      }),
    ).toThrow(ZodError);
  });

  test("rejects ports below the valid range", () => {
    expect(() =>
      createAppConfig({ PORT: "0", JWT_SECRET: validJwtSecret }),
    ).toThrow(ZodError);
  });

  test("rejects ports above the valid range", () => {
    expect(() =>
      createAppConfig({ PORT: "65536", JWT_SECRET: validJwtSecret }),
    ).toThrow(ZodError);
  });

  test("rejects a missing JWT secret", () => {
    expect(() => createAppConfig({ PORT: "3000" })).toThrow(ZodError);
  });

  test("rejects a JWT secret shorter than 32 characters", () => {
    expect(() =>
      createAppConfig({ PORT: "3000", JWT_SECRET: "too-short" }),
    ).toThrow(ZodError);
  });
});
