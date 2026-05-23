import type { AppVariables } from "@shared/appVariables.ts";
import { Page } from "@shared/page.tsx";
import { pageJwtMiddleware } from "@shared/pageJwtMiddleware.ts";
import { Hono } from "hono";

export const addToDoPage = new Hono<{ Variables: AppVariables }>()
  .use("/", pageJwtMiddleware)
  .get("/", (c) => {
    return c.html(
      <Page type="authenticated" currentPath={c.req.path} username="test">
        <h1>Add ToDo</h1>
      </Page>,
    );
  });
