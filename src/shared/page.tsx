import type { Child } from "hono/jsx";
import { NavigationBar } from "./navigationBar.tsx";

type SharedPageProps = Readonly<{
  title?: string;
  children?: Child;
  currentPath: string;
}>;

export type AuthenticatedPageProps = SharedPageProps &
  Readonly<{ type: "authenticated"; username: string }>;

export type UnauthenticatedPageProps = SharedPageProps &
  Readonly<{ type: "unauthenticated" }>;

type PageProps = AuthenticatedPageProps | UnauthenticatedPageProps;

export const Page = (props: PageProps) => {
  const validTitle = props.title ?? "ToDo";
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{validTitle}</title>
        <link rel="stylesheet" href="/styles/app.css" />
        <script src="/scripts/datastar.js" defer type="module" />
      </head>
      <body>
        {props.type === "authenticated" && (
          <NavigationBar
            type="authenticated"
            currentPath={props.currentPath}
            username={props.username}
          />
        )}
        {props.type === "unauthenticated" && (
          <NavigationBar
            type="unauthenticated"
            currentPath={props.currentPath}
          />
        )}
        <main>{props.children}</main>
      </body>
    </html>
  );
};
