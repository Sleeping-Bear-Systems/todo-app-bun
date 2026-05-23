export function getUsernameFromJwtPayload(payload: unknown): string {
  if (typeof payload === "object" && payload !== null) {
    const payloadRecord = payload as Record<string, unknown>;

    if (
      "preferred_username" in payloadRecord &&
      typeof payloadRecord["preferred_username"] === "string"
    ) {
      return payloadRecord["preferred_username"];
    }
  }

  return "";
}
