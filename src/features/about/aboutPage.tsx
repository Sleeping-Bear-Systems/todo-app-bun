import type { AppVariables } from "@shared/appVariables.ts";
import { Page } from "@shared/page.tsx";
import { Hono } from "hono";

export const aboutPage = new Hono<{ Variables: AppVariables }>().get(
  "/",
  (c) => {
    return c.html(
      <Page>
        <h1>About</h1>
        <h2>Powered By</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Biome</td>
              <td>
                <a href="https://biomejs.dev">https://biomejs.dev</a>
              </td>
            </tr>
            <tr>
              <td>Hono</td>
              <td>
                <a href="https://hono.dev">https://hono.dev</a>
              </td>
            </tr>
          </tbody>
        </table>
      </Page>,
    );
  },
);
