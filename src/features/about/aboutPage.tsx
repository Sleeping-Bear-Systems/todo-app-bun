import type { AppVariables } from "@shared/appVariables.ts";
import { Page } from "@shared/page.tsx";
import { Hono } from "hono";

export const aboutPage = new Hono<{ Variables: AppVariables }>().get(
  "/",
  (c) => {
    return c.html(
      <Page type="unauthenticated" currentPath={c.req.path}>
        <h1>About</h1>
        <h2>Powered By</h2>
        <ul>
          <li>
            Bun: <a href="https://bun.com/">https://bun.com</a>
          </li>
          <li>
            Hono: <a href="https://hono.dev">https://hono.dev</a>
          </li>
          <li>
            Datastar: <a href="https://data-star.dev">https://data-star.dev</a>
          </li>
          <li>
            Biome: <a href="https://biomejs.dev">https://biomejs.dev</a>
          </li>
        </ul>
      </Page>,
    );
  },
);
