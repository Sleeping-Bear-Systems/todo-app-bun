import { describe, expect, test } from "bun:test";
import { addDays } from "date-fns";
import { createTodoJwtPayload } from "./jwtMiddleware.ts";

describe("createTodoJwtPayload", () => {
  test("maps user fields and static issuer", () => {
    const now = new Date("2026-05-24T12:00:00.000Z");

    const payload = createTodoJwtPayload("user-123", "admin", "editor", now);

    expect(payload.sub).toBe("user-123");
    expect(payload.preferred_username).toBe("admin");
    expect(payload.role).toBe("editor");
    expect(payload.iss).toBe("todo-app");
  });

  test("sets iat to current time in seconds", () => {
    const now = new Date("2026-05-24T12:34:56.000Z");

    const payload = createTodoJwtPayload("user-1", "user", "admin", now);

    expect(payload.iat).toBe(Math.floor(now.getTime() / 1000));
  });

  test("sets exp to one day after current time in seconds", () => {
    const now = new Date("2026-05-24T12:34:56.000Z");

    const payload = createTodoJwtPayload("user-1", "user", "admin", now);

    expect(payload.exp).toBe(Math.floor(addDays(now, 1).getTime() / 1000));
    expect(payload.exp - payload.iat).toBe(24 * 60 * 60);
  });
});
