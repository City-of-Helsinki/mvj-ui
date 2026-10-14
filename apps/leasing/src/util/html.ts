declare const escapedHtmlBrand: unique symbol;

export type EscapedHtml = string & {
  readonly [escapedHtmlBrand]: true;
};

const escapeHtml = (value: unknown): string => {
  const element = document.createElement("span");
  element.textContent = value == null ? "" : String(value);
  return element.innerHTML;
};

/**
 * Builds trusted popup markup while HTML-escaping every interpolated value.
 *
 * Leaflet parses popup strings as HTML, so directly inserting untrusted values
 * could allow stored cross-site scripting (XSS). This keeps the HTML written
 * in the template and adds inserted values as text only.
 *
 * For example, html`<p>${name}</p>` receives ["<p>", "</p>"] and name
 * separately, so it can escape name before placing it between the two strings.
 */
export const html = (
  strings: TemplateStringsArray,
  ...values: unknown[]
): EscapedHtml => {
  const escapedValues = values.map(escapeHtml);

  return (
    strings
      // Tagged templates provide the static strings and inserted values in
      // matching order. The final string has no following value.
      .map((string, index) => string + (escapedValues[index] ?? ""))
      .join("") as EscapedHtml
  );
};
