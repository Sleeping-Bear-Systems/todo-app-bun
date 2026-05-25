import { describe, expect, test } from "bun:test";
import { Page } from "./page.tsx";
import { apiRoutes, pageRoutes } from "./routes.ts";

const unauthenticatedPageProps = { type: "unauthenticated" } as const;
const authenticatedPageProps = {
  type: "authenticated",
  username: "test-user",
} as const;

describe("Page", () => {
  test("renders with correct title", () => {
    const html = Page({
      ...unauthenticatedPageProps,
      title: "Test Page",
      children: null,
      currentPath: "/test-page",
    });
    const htmlString = String(html);

    expect(htmlString).toContain("<title>Test Page</title>");
  });

  test("renders the default title when title is omitted", () => {
    const html = Page({
      ...unauthenticatedPageProps,
      currentPath: "/todo",
      children: null,
    });
    const htmlString = String(html);

    expect(htmlString).toContain("<title>ToDo</title>");
  });

  test("renders with correct lang attribute", () => {
    const html = Page({
      ...unauthenticatedPageProps,
      title: "Home",
      children: null,
      currentPath: "/home",
    });
    const htmlString = String(html);

    expect(htmlString).toContain('<html lang="en">');
  });

  test("renders with correct HTML structure", () => {
    const html = Page({
      ...unauthenticatedPageProps,
      title: "Test",
      children: null,
      currentPath: "/test",
    });
    const htmlString = String(html);

    expect(htmlString).toContain("<head>");
    expect(htmlString).toContain('<meta charset="UTF-8"');
    expect(htmlString).toContain(
      '<meta name="viewport" content="width=device-width, initial-scale=1.0"',
    );
    expect(htmlString).toContain(
      '<script src="/scripts/datastar.js" defer="" type="module"></script>',
    );
    expect(htmlString).toContain("</head>");
    expect(htmlString).toContain("<body>");
    expect(htmlString).toContain("</body>");
    expect(htmlString).toContain("</html>");
  });

  test("hides current unauthenticated route from navigation", () => {
    const html = Page({
      ...unauthenticatedPageProps,
      currentPath: pageRoutes.ABOUT,
      children: null,
    });
    const htmlString = String(html);

    expect(htmlString).toContain(`<a href="${pageRoutes.LOGIN}">Login</a>`);
    expect(htmlString).not.toContain(`<a href="${pageRoutes.ABOUT}">About</a>`);
    expect(htmlString).not.toContain("Logout");
  });

  test("hides current authenticated route from navigation", () => {
    const html = Page({
      ...authenticatedPageProps,
      currentPath: pageRoutes.HOME,
      children: null,
    });
    const htmlString = String(html);

    expect(htmlString).not.toContain(`<a href="${pageRoutes.HOME}">Home</a>`);
    expect(htmlString).toContain(`<a href="${pageRoutes.ADD_TODO}">Add</a>`);
    expect(htmlString).toContain(`<a href="${pageRoutes.ABOUT}">About</a>`);
    expect(htmlString).toContain("<li>test-user</li>");
    expect(htmlString).toContain(
      `<form action="${apiRoutes.LOGOUT}" method="post">`,
    );
    expect(htmlString).toContain(
      '<button class="nav-link-button" type="submit">',
    );
  });
});
