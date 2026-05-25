import type { AuthenticatedAppVariables } from "@shared/appVariables.ts";
import { Page } from "@shared/page.tsx";
import { Hono } from "hono";

export const addToDoPage = new Hono<{
  Variables: AuthenticatedAppVariables;
}>().get("/", (c) => {
  const username = c.var.validatedJwtPayload.preferred_username;
  return c.html(
    <Page type="authenticated" currentPath={c.req.path} username={username}>
      <h1>Add ToDo</h1>
    </Page>,
  );
});
