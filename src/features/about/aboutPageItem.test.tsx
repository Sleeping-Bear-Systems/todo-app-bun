import { describe, expect, test } from "bun:test";
import { AboutPageItem } from "./aboutPageItem.tsx";

describe("AboutPageItem", () => {
  test("renders link-only item", () => {
    const html = AboutPageItem({
      type: "LinkAboutPageItemProps",
      label: "Viconic",
      url: "https://viconic.dev/collections/svg_logos",
    });
    const htmlString = String(html);

    expect(htmlString).toContain("<li>");
    expect(htmlString).toContain("Viconic:");
    expect(htmlString).toContain(
      '<a class="powered-by-link" href="https://viconic.dev/collections/svg_logos" target="_blank" rel="noopener noreferrer">',
    );
    expect(htmlString).toContain("https://viconic.dev/collections/svg_logos");
    expect(htmlString).not.toContain("<img");
    expect(htmlString).toContain("</li>");
  });

  test("renders link with decorative icon", () => {
    const html = AboutPageItem({
      type: "LinkWithIconAboutPageItemProps",
      label: "Bun",
      url: "https://bun.com/",
      imageUrl: "/images/bun.svg",
    });
    const htmlString = String(html);

    expect(htmlString).toContain("<li>");
    expect(htmlString).toContain("Bun:");
    expect(htmlString).toContain(
      '<a class="powered-by-link" href="https://bun.com/" target="_blank" rel="noopener noreferrer">',
    );
    expect(htmlString).toContain(
      '<img src="/images/bun.svg" alt="" width="16" height="16" aria-hidden="true"',
    );
    expect(htmlString).toContain("https://bun.com/");
    expect(htmlString).toContain("</li>");
  });
});
