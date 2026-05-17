import { randomUUIDv7 } from "bun";

export type User = {
  id: string;
  username: string;
  passwordHash: string;
};

export async function addUser(
  username: string,
  password: string,
): Promise<User | undefined> {
  var normalizedUsername = normalizeUsername(username);

  const existingUser = getUserByUsername(username);
  if (existingUser !== undefined) {
    throw new Error("User exists");
  }
  const passwordHash = await Bun.password.hash(password);
  const newUser = {
    id: randomUUIDv7(),
    username: normalizedUsername,
    passwordHash,
  };
  users.push(newUser);
  return newUser;
}

export function getUserByUsername(username: string): User | undefined {
  const normalizedUsername = normalizeUsername(username);
  return users.find((u) => u.username === normalizedUsername);
}

function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

const users: User[] = [];
