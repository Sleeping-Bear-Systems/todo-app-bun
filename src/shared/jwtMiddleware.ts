import { addDays } from "date-fns";

export type TodoJwtPayload = {
  sub: string;
  preferred_username: string;
  role: string;
  iss: string;
  exp: number;
  iat: number;
};

export function createTodoJwtPayload(
  userId: string,
  username: string,
  role: string,
  now: Date,
): TodoJwtPayload {
  return {
    sub: userId,
    preferred_username: username,
    role,
    iss: "todo-app",
    exp: Math.floor(addDays(now, 1).getTime() / 1000),
    iat: Math.floor(now.getTime() / 1000),
  };
}
