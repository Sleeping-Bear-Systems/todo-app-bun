import type { ValidatedJwtPayload } from "./authentication.ts";

export function createValidTestJwtPayload(
  overrides: Partial<ValidatedJwtPayload> = {},
): ValidatedJwtPayload {
  return {
    sub: "1234",
    preferred_username: "admin",
    role: "admin",
    iss: "todo-app",
    exp: 2000000000,
    iat: 1700000000,
    ...overrides,
  };
}
