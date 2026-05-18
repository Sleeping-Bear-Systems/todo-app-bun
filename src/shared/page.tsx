import { navigationBar } from "@shared/navigationBar.tsx";
import type { PropsWithChildren } from "hono/jsx";

interface PageProps extends PropsWithChildren {
  title?: string;
}

export const Page = (props: PageProps) => {
  const validTitle = props.title ?? "ToDo";
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{validTitle}</title>
        <link rel="stylesheet" href="/styles/app.css" />
        <script src="/scripts/datastar.js" defer />
      </head>
      <body>
        {navigationBar()}
        <main>{props.children}</main>
      </body>
    </html>
  );
};
