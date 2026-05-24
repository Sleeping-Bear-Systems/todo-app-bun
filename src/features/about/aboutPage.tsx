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
            Bun:{" "}
            <a
              class="powered-by-link"
              href="https://bun.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/images/bun.svg"
                alt=""
                width="16"
                height="16"
                aria-hidden="true"
              />
              https://bun.com
            </a>
          </li>
          <li>
            Hono:{" "}
            <a
              class="powered-by-link"
              href="https://hono.dev"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/images/hono.svg"
                alt=""
                width="16"
                height="16"
                aria-hidden="true"
              />
              https://hono.dev
            </a>
          </li>
          <li>
            Datastar:{" "}
            <a
              class="powered-by-link"
              href="https://data-star.dev"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/images/datastar.svg"
                alt=""
                width="16"
                height="16"
                aria-hidden="true"
              />
              https://data-star.dev
            </a>
          </li>
          <li>
            Biome:{" "}
            <a
              class="powered-by-link"
              href="https://biomejs.dev"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/images/biome.svg"
                alt=""
                width="16"
                height="16"
                aria-hidden="true"
              />
              https://biomejs.dev
            </a>
          </li>
          <li>
            Viconic:{" "}
            <a
              class="powered-by-link"
              href="https://viconic.dev/collections/svg_logos"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://viconic.dev/collections/svg_logos
            </a>
          </li>
        </ul>
      </Page>,
    );
  },
);
