import { describe, expect, test } from "bun:test";
import { Page } from "./page.tsx";

describe("Page", () => {
  test("renders with correct title", () => {
    const html = Page({ title: "Test Page", children: null });
    const htmlString = String(html);

    expect(htmlString).toContain("<title>Test Page</title>");
  });

  test("renders the default title when title is omitted", () => {
    const html = Page({ children: null });
    const htmlString = String(html);

    expect(htmlString).toContain("<title>ToDo</title>");
  });

  test("renders with correct lang attribute", () => {
    const html = Page({ title: "Home", children: null });
    const htmlString = String(html);

    expect(htmlString).toContain('<html lang="en">');
  });

  test("renders with correct HTML structure", () => {
    const html = Page({ title: "Test", children: null });
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
});
