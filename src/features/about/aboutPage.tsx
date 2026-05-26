import type { AuthenticatedAppVariables } from "@shared/appVariables.ts";
import { Page } from "@shared/page.tsx";
import { Hono } from "hono";
import { AboutPageItem } from "./aboutPageItem.tsx";

export const aboutPage = new Hono<{
  Variables: AuthenticatedAppVariables;
}>().get("/", (c) => {
  const username = c.var.validatedJwtPayload.preferred_username;
  return c.html(
    <Page type="authenticated" username={username} currentPath={c.req.path}>
      <h1>About</h1>
      <h2>Powered By</h2>
      <ul>
        <AboutPageItem
          type="LinkWithIconAboutPageItemProps"
          label="Bun"
          url="https://bun.com"
          imageUrl="/images/bun.svg"
        />
        <AboutPageItem
          type="LinkWithIconAboutPageItemProps"
          label="Hono"
          url="https://hono.dev"
          imageUrl="/images/hono.svg"
        />
        <AboutPageItem
          type="LinkAboutPageItemProps"
          label="Emmett"
          url="https://event-driven-io.github.io/emmett/"
        ></AboutPageItem>
        <AboutPageItem
          type="LinkWithIconAboutPageItemProps"
          label="Datastar"
          url="https://data-star.dev"
          imageUrl="/images/datastar.svg"
        />
        <AboutPageItem
          type="LinkWithIconAboutPageItemProps"
          label="Biome"
          url="https://biomejs.dev"
          imageUrl="/images/biome.svg"
        />
        <AboutPageItem
          type="LinkAboutPageItemProps"
          label="Viconic"
          url="https://viconic.dev/collections/svg_logos"
        />
      </ul>
    </Page>,
  );
});
