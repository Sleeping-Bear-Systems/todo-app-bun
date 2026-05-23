import { describe, expect, test } from "bun:test";
import { NavigationBar } from "./navigationBar.tsx";

describe("NavigationBar", () => {
  test("renders authenticated navigation links, username, and logout action", () => {
    const html = NavigationBar({
      type: "authenticated",
      currentPath: "/add-todo",
      username: "test-user",
    });
    const htmlString = String(html);

    expect(htmlString).toContain("<nav>");
    expect(htmlString).toContain('<a href="/">Home</a>');
    expect(htmlString).not.toContain('<a href="/add-todo">Add</a>');
    expect(htmlString).toContain('<a href="/about">About</a>');
    expect(htmlString).toContain("<li>test-user</li>");
    expect(htmlString).toContain('<form action="/api/logout" method="post">');
    expect(htmlString).toContain(
      '<button class="nav-link-button" type="submit">',
    );
  });

  test("hides the authenticated current route link", () => {
    const html = NavigationBar({
      type: "authenticated",
      currentPath: "/",
      username: "test-user",
    });
    const htmlString = String(html);

    expect(htmlString).not.toContain('<a href="/">Home</a>');
    expect(htmlString).toContain('<a href="/add-todo">Add</a>');
    expect(htmlString).toContain('<a href="/about">About</a>');
    expect(htmlString).toContain("<li>test-user</li>");
    expect(htmlString).toContain('<form action="/api/logout" method="post">');
  });

  test("renders unauthenticated links", () => {
    const html = NavigationBar({ type: "unauthenticated", currentPath: "/" });
    const htmlString = String(html);

    expect(htmlString).toContain('<a href="/login">Login</a>');
    expect(htmlString).toContain('<a href="/about">About</a>');
    expect(htmlString).not.toContain("Logout");
  });

  test("hides the unauthenticated current route link", () => {
    const html = NavigationBar({
      type: "unauthenticated",
      currentPath: "/login",
    });
    const htmlString = String(html);

    expect(htmlString).not.toContain('<a href="/login">Login</a>');
    expect(htmlString).toContain('<a href="/about">About</a>');
  });
});
