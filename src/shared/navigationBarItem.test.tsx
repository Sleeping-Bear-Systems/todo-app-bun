import { describe, expect, test } from "bun:test";
import { NavigationBarItem } from "./navigationBarItem.tsx";

describe("NavigationBarItem", () => {
  test("renders a link item when type is link", () => {
    const html = NavigationBarItem({
      type: "link",
      label: "About",
      url: "/about",
      currentPath: "/",
    });
    const htmlString = String(html);

    expect(htmlString).toContain("<li>");
    expect(htmlString).toContain('<a href="/about">About</a>');
    expect(htmlString).toContain("</li>");
  });

  test("renders a list item with provided children when type is generic", () => {
    const html = NavigationBarItem({
      type: "generic",
      children: "Custom content",
    });
    const htmlString = String(html);

    expect(htmlString).toContain("<li>Custom content</li>");
  });

  test("renders an empty list item when type is generic and children are not provided", () => {
    const html = NavigationBarItem({ type: "generic" });
    const htmlString = String(html);

    expect(htmlString).toContain("<li></li>");
  });

  test("returns null when link URL matches current path", () => {
    const html = NavigationBarItem({
      type: "link",
      label: "About",
      url: "/about",
      currentPath: "/about",
    });

    expect(html).toBeNull();
  });
});
