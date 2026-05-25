import { describe, expect, test } from "bun:test";
import { NavigationBar } from "./navigationBar.tsx";
import { apiRoutes, pageRoutes } from "./routes.ts";

describe("NavigationBar", () => {
  test("renders authenticated navigation links, username, and logout action", () => {
    const html = NavigationBar({
      type: "authenticated",
      currentPath: pageRoutes.ADD_TODO,
      username: "test-user",
    });
    const htmlString = String(html);

    expect(htmlString).toContain("<nav>");
    expect(htmlString).toContain(`<a href="${pageRoutes.HOME}">Home</a>`);
    expect(htmlString).not.toContain(
      `<a href="${pageRoutes.ADD_TODO}">Add</a>`,
    );
    expect(htmlString).toContain(`<a href="${pageRoutes.ABOUT}">About</a>`);
    expect(htmlString).toContain("<li>test-user</li>");
    expect(htmlString).toContain(
      `<form action="${apiRoutes.LOGOUT}" method="post">`,
    );
    expect(htmlString).toContain(
      '<button class="nav-link-button" type="submit">',
    );
  });

  test("hides the authenticated current route link", () => {
    const html = NavigationBar({
      type: "authenticated",
      currentPath: pageRoutes.HOME,
      username: "test-user",
    });
    const htmlString = String(html);

    expect(htmlString).not.toContain(`<a href="${pageRoutes.HOME}">Home</a>`);
    expect(htmlString).toContain(`<a href="${pageRoutes.ADD_TODO}">Add</a>`);
    expect(htmlString).toContain(`<a href="${pageRoutes.ABOUT}">About</a>`);
    expect(htmlString).toContain("<li>test-user</li>");
    expect(htmlString).toContain(
      `<form action="${apiRoutes.LOGOUT}" method="post">`,
    );
  });

  test("renders unauthenticated links", () => {
    const html = NavigationBar({ type: "unauthenticated", currentPath: "/" });
    const htmlString = String(html);

    expect(htmlString).toContain(`<a href="${pageRoutes.LOGIN}">Login</a>`);
    expect(htmlString).toContain(`<a href="${pageRoutes.ABOUT}">About</a>`);
    expect(htmlString).not.toContain("Logout");
  });

  test("hides the unauthenticated current route link", () => {
    const html = NavigationBar({
      type: "unauthenticated",
      currentPath: pageRoutes.LOGIN,
    });
    const htmlString = String(html);

    expect(htmlString).not.toContain(`<a href="${pageRoutes.LOGIN}">Login</a>`);
    expect(htmlString).toContain(`<a href="${pageRoutes.ABOUT}">About</a>`);
  });
});
