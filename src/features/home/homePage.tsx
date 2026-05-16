import type { AppVariables } from "@shared/appVariables.ts";
import { Page } from "@shared/page.tsx";
import { Hono } from "hono";

export const homePage = new Hono<{ Variables: AppVariables }>().get(
  "/",
  (c) => {
    return c.html(
      <Page>
        <h1>Home</h1>
      </Page>,
    );
  },
);
