import type { AppVariables } from "@shared/appVariables.ts";
import { Page } from "@shared/page.tsx";
import { pageRoutes } from "@shared/pageRoutes.ts";
import { Hono } from "hono";

export const homePage = new Hono<{ Variables: AppVariables }>().get(
  "/",
  (c) => {
    return c.html(
      <Page>
        <h1>Home</h1>
        <p>
          <a href={pageRoutes.ABOUT}>About</a>
        </p>
      </Page>,
    );
  },
);
