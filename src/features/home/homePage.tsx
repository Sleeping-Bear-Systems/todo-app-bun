import type { AuthenticatedAppVariables } from "@shared/appVariables.ts";
import { Page } from "@shared/page.tsx";
import { pageJwtMiddleware } from "@shared/pageJwtMiddleware.ts";
import { Hono } from "hono";

export const homePage = new Hono<{ Variables: AuthenticatedAppVariables }>()
  .use("/", pageJwtMiddleware)
  .get("/", (c) => {
    const username = c.var.validatedJwtPayload.preferred_username;
    return c.html(
      <Page type="authenticated" currentPath={c.req.path} username={username}>
        <h1>Home</h1>
      </Page>,
    );
  });
