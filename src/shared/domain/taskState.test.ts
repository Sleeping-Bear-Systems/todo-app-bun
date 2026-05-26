import { describe, expect, test } from "bun:test";
import { initialState } from "./taskState";

describe("initialState()", () => {
  test("returns 'Unknown' state", () => {
    const state = initialState();
    expect(state.status).toEqual("Unknown");
  });
});
