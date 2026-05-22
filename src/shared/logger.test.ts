import { describe, expect, test } from "bun:test";
import { SeqTransport } from "@datalust/winston-seq";
import winston from "winston";
import type { AppConfig } from "./appConfig.ts";
import { createLogger } from "./logger.ts";

function createAppConfig(overrides?: Partial<AppConfig>): AppConfig {
  return {
    port: 3000,
    environment: "test",
    jwt: {
      secret: "12345678901234567890123456789012",
      cookieName: "todo-app",
    },
    seq: {
      apiKey: undefined,
      url: undefined,
    },
    ...overrides,
  };
}

describe("createLogger", () => {
  test("creates an info logger with console transport and application metadata", () => {
    const logger = createLogger(createAppConfig({ environment: "production" }));

    expect(logger.level).toBe("info");
    expect(logger.defaultMeta).toEqual({
      application: "todo-app",
      environment: "production",
    });
    expect(logger.transports).toHaveLength(1);
    expect(logger.transports[0]).toBeInstanceOf(winston.transports.Console);
  });

  test("does not add a Seq transport when the Seq api key is missing", () => {
    const logger = createLogger(
      createAppConfig({
        seq: {
          apiKey: undefined,
          url: "https://seq.example.com",
        },
      }),
    );

    expect(logger.transports).toHaveLength(1);
    expect(logger.transports[0]).toBeInstanceOf(winston.transports.Console);
  });

  test("does not add a Seq transport when the Seq url is missing", () => {
    const logger = createLogger(
      createAppConfig({
        seq: {
          apiKey: "test-api-key",
          url: undefined,
        },
      }),
    );

    expect(logger.transports).toHaveLength(1);
    expect(logger.transports[0]).toBeInstanceOf(winston.transports.Console);
  });

  test("adds a Seq transport when the Seq configuration is complete", () => {
    const logger = createLogger(
      createAppConfig({
        seq: {
          apiKey: "test-api-key",
          url: "https://seq.example.com",
        },
      }),
    );

    expect(logger.transports).toHaveLength(2);
    expect(logger.transports[0]).toBeInstanceOf(winston.transports.Console);
    expect(logger.transports[1]).toBeInstanceOf(SeqTransport);
  });
});
