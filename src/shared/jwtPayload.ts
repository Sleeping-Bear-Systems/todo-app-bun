import { addDays } from "date-fns";
import { HTTPException } from "hono/http-exception";
import z from "zod";

const todoJwtPayloadSchema = z.object({
  sub: z.string(),
  preferred_username: z.string(),
  role: z.string(),
  iss: z.string(),
  exp: z.number(),
  iat: z.number(),
});

export type TodoJwtPayload = z.infer<typeof todoJwtPayloadSchema>;

export function createTodoJwtPayload(
  userId: string,
  username: string,
  role: string,
  now: Date,
): TodoJwtPayload {
  const iat: number = Math.floor(now.getTime() / 1000);
  return {
    sub: userId,
    preferred_username: username,
    role,
    iss: "todo-app",
    exp: Math.floor(addDays(now, 1).getTime() / 1000),
    iat,
  };
}

export function parseJwtPayload(jwtPayload: unknown): TodoJwtPayload {
  const result = todoJwtPayloadSchema.safeParse(jwtPayload);
  if (result.success) {
    return result.data;
  }
  throw new HTTPException(400, { message: "Invalid token" });
}
