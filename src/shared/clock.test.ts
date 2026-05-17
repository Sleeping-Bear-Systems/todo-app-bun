import { describe, expect, test } from "bun:test";
import { createFixedClock } from "./clock.ts";

describe("createFixedClock", () => {
  test("returns the fixed date on first call", () => {
    const fixed = new Date("2026-01-01T00:00:00.000Z");
    const clock = createFixedClock(fixed);

    expect(clock.now()).toEqual(fixed);
  });

  test("returns the same date on repeated calls", () => {
    const fixed = new Date("2026-06-15T08:30:00.000Z");
    const clock = createFixedClock(fixed);

    expect(clock.now()).toEqual(clock.now());
  });
});
