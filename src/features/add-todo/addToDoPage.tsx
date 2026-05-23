import type { AppVariables } from "@shared/appVariables.ts";
import { Page } from "@shared/page.tsx";
import { pageJwtMiddleware } from "@shared/pageJwtMiddleware.ts";
import { Hono } from "hono";

export const addToDoPage = new Hono<{ Variables: AppVariables }>()
  .use("/", pageJwtMiddleware)
  .get("/", (c) => {
    const username =
      typeof c.var.jwtPayload.preferred_username === "string"
        ? c.var.jwtPayload.preferred_username
        : "";

    return c.html(
      <Page type="authenticated" currentPath={c.req.path} username={username}>
        <h1>Add ToDo</h1>
      </Page>,
    );
  });
