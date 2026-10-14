import { describe, expect, it } from "vitest";
import { html } from "./html";

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
        '      <p><strong>Identifier:</strong> &lt;img src=x onerror="alert(1)"&gt;</p>\n' +
        "      <p><strong>Status:</strong> Active</p>",
    );

    const popup = document.createElement("div");
    popup.innerHTML = popupHtml;

    expect(popup.querySelector("img")).toBeNull();
    expect(popup.textContent).toContain(identifier);
  });
});
