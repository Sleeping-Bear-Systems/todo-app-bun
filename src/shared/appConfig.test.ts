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
      jwt: { secret: validJwtSecret, cookieName: "todo-app" },
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
      jwt: { secret: validJwtSecret, cookieName: "todo-app" },
    });
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
