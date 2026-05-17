import type { PropsWithChildren } from "hono/jsx";

interface PageProps extends PropsWithChildren {
  title?: string;
}

export const Page = (props: PageProps) => {
  const validTitle = props.title ?? "Art Show Tools";
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{validTitle}</title>
      </head>
      <body>{props.children}</body>
    </html>
  );
};
