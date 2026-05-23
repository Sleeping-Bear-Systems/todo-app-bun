import type { AppVariables } from "@shared/appVariables.ts";
import { Page } from "@shared/page.tsx";
import { pageJwtMiddleware } from "@shared/pageJwtMiddleware.ts";
import { Hono } from "hono";

export const homePage = new Hono<{ Variables: AppVariables }>()
  .use("/", pageJwtMiddleware)
  .get("/", (c) => {
    return c.html(
      <Page>
        <h1>Home</h1>
      </Page>,
    );
  });
