export function getUsernameFromJwtPayload(payload: unknown): string {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "preferred_username" in payload &&
    typeof payload.preferred_username === "string"
  ) {
    return payload.preferred_username;
  }

  return "";
}
