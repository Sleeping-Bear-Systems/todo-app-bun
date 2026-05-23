import type { Child } from "hono/jsx";
import { NavigationBar, type NavigationBarProps } from "./navigationBar.tsx";

type SharedPageProps = Readonly<{
  title?: string;
  children?: Child;
  currentPath: string;
}>;

export type AuthenticatedPageProps = SharedPageProps &
  Readonly<{ type: "authenticated"; userId: string; username: string }>;

export type UnauthenticatedPageProps = SharedPageProps &
  Readonly<{ type: "unauthenticated" }>;

type PageProps = AuthenticatedPageProps | UnauthenticatedPageProps;

export const Page = (props: PageProps) => {
  const validTitle = props.title ?? "ToDo";
  let navigationBarProps: NavigationBarProps | undefined;
  switch (props.type) {
    case "authenticated":
      navigationBarProps = {
        type: "authenticated",
        currentPath: props.currentPath,
      };
      break;
    case "unauthenticated":
      navigationBarProps = {
        type: "unauthenticated",
        currentPath: props.currentPath,
      };
      break;
    default: {
      const _unknownType: never = props;
      return _unknownType;
    }
  }
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
        <NavigationBar {...navigationBarProps}></NavigationBar>
        <main>{props.children}</main>
      </body>
    </html>
  );
};
