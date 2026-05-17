import type { AppVariables } from "@shared/appVariables.ts";
import { Page } from "@shared/page";
import { Hono } from "hono";

export const createTaskPage = new Hono<{ Variables: AppVariables }>().get(
  "/",
  (c) => {
    return c.html(
      <Page>
        <h1>Create Task</h1>
      </Page>,
    );
  },
);
