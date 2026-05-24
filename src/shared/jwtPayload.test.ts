import { describe, expect, test } from "bun:test";
import { addDays } from "date-fns";
import { HTTPException } from "hono/http-exception";
import { createTodoJwtPayload, parseJwtPayload } from "./jwtPayload.ts";

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

  test("floors fractional milliseconds for both iat and exp", () => {
    const now = new Date("2026-05-24T12:34:56.789Z");

    const payload = createTodoJwtPayload("user-1", "user", "admin", now);

    expect(payload.iat).toBe(Math.floor(now.getTime() / 1000));
    expect(payload.exp).toBe(Math.floor(addDays(now, 1).getTime() / 1000));
  });
});

describe("parseJwtPayload", () => {
  test("returns parsed payload when token payload shape is valid", () => {
    const jwtPayload = {
      sub: "user-1",
      preferred_username: "admin",
      role: "admin",
      iss: "todo-app",
      exp: 4_102_444_800,
      iat: 1_704_067_200,
    };

    const parsedPayload = parseJwtPayload(jwtPayload);

    expect(parsedPayload).toEqual(jwtPayload);
  });

  test("throws HTTP 400 when token payload shape is invalid", () => {
    expect.assertions(3);

    try {
      parseJwtPayload({
        sub: "user-1",
        preferred_username: "admin",
        role: "admin",
        iss: "todo-app",
        exp: "not-a-number",
        iat: 1_704_067_200,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(HTTPException);
      expect((error as HTTPException).status).toBe(400);
      expect((error as HTTPException).message).toBe("Invalid token");
    }
  });
});
