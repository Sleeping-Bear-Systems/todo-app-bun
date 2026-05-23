import { describe, expect, test } from "bun:test";
import { getUsernameFromJwtPayload } from "./utility.ts";

describe("getUsernameFromJwtPayload", () => {
  test("returns preferred_username when it is a string", () => {
    const username = getUsernameFromJwtPayload({
      preferred_username: "admin",
    });

    expect(username).toBe("admin");
  });

  test("returns an empty string when payload is null", () => {
    const username = getUsernameFromJwtPayload(null);

    expect(username).toBe("");
  });

  test("returns an empty string when payload is not an object", () => {
    const username = getUsernameFromJwtPayload("not-an-object");

    expect(username).toBe("");
  });

  test("returns an empty string when preferred_username is missing", () => {
    const username = getUsernameFromJwtPayload({ sub: "1234" });

    expect(username).toBe("");
  });

  test("returns an empty string when preferred_username is not a string", () => {
    const username = getUsernameFromJwtPayload({
      preferred_username: 123,
    });

    expect(username).toBe("");
  });
});
