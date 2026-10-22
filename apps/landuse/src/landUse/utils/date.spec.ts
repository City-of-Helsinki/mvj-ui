import { describe, expect, it } from "vitest";
import { parseIsoDateToFinnishDate, parseFinnishDateToIsoDate } from "./date";

describe("date-only form boundary", () => {
  it.each(["2024-02-29", "29.2.2024", " 29.02.2024 "])(
    "round-trips leap date %s",
    (value) => {
      expect(parseFinnishDateToIsoDate(value)).toBe("2024-02-29");
      expect(parseIsoDateToFinnishDate("2024-02-29")).toBe("29.02.2024");
      expect(parseFinnishDateToIsoDate(parseIsoDateToFinnishDate("2024-02-29"))).toBe("2024-02-29");
    },
  );
  it.each([
    ["31.2.2026", "2026-02-31"],
    ["2023-02-29", "2023-02-29"],
    ["garbage", "garbage"],
  ])("leaves calendar validation of %s to the API", (value, expected) => {
    expect(parseFinnishDateToIsoDate(value)).toBe(expected);
  });
  it("clears optional dates", () => {
    expect(parseFinnishDateToIsoDate("  ")).toBeNull();
    expect(parseIsoDateToFinnishDate(null)).toBe("");
    expect(parseIsoDateToFinnishDate(undefined)).toBe("");
    expect(parseIsoDateToFinnishDate("")).toBe("");
  });
});
