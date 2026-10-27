import { describe, expect, it } from "vitest";
import { html } from "@/util/html";

describe("html", () => {
  it("escapes every interpolated value into text instead of executable markup", () => {
    const id = 25;
    const identifier = '<img src=x onerror="alert(1)">';
    const status = "Active";

    const popupHtml = html`<p><strong>Id:</strong> ${id}</p>
      <p><strong>Identifier:</strong> ${identifier}</p>
      <p><strong>Status:</strong> ${status}</p>`;

    expect(popupHtml).toBe(
      "<p><strong>Id:</strong> 25</p>\n" +
        "      <p><strong>Identifier:</strong> &lt;img src=x onerror=&quot;alert(1)&quot;&gt;</p>\n" +
        "      <p><strong>Status:</strong> Active</p>",
    );

    const popup = document.createElement("div");
    popup.innerHTML = popupHtml;

    expect(popup.querySelector("img")).toBeNull();
    expect(popup.textContent).toContain(identifier);
  });

  it("keeps interpolated values inside quoted attributes", () => {
    const value = '" onmouseover="alert(1)';
    const popupHtml = html`<a href="/leases/${value}">Lease</a>`;
    const popup = document.createElement("div");
    popup.innerHTML = popupHtml;

    const link = popup.querySelector("a");
    expect(link?.getAttribute("href")).toBe(`/leases/${value}`);
    expect(link?.hasAttribute("onmouseover")).toBe(false);
  });
});
