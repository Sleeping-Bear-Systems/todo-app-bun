import type { AppVariables } from "@shared/appVariables";
import { Page } from "@shared/page";
import { Hono } from "hono";

export const loginPage = new Hono<{ Variables: AppVariables }>().get(
  "/",
  (c) => {
    return c.html(
      <Page>
        <h1>Login</h1>
      </Page>,
    );
  },
);
