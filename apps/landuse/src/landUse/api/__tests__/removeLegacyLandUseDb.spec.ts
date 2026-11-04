import { afterEach, describe, expect, it, vi } from "vitest";
import { removeLegacyLandUseDb } from "@/landUse/api/removeLegacyLandUseDb";

describe("removeLegacyLandUseDb", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("deletes the previous prototype database", () => {
    const deleteDatabase = vi.fn(() => ({}));
    vi.stubGlobal("indexedDB", { deleteDatabase });

    removeLegacyLandUseDb();

    expect(deleteDatabase).toHaveBeenCalledWith("landUseDb");
  });

  it("does not prevent startup if the browser rejects the deletion request", () => {
    const deleteDatabase = vi.fn(() => {
      throw new Error("IndexedDB is unavailable");
    });
    vi.stubGlobal("indexedDB", { deleteDatabase });
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    expect(() => removeLegacyLandUseDb()).not.toThrow();
    expect(warn).toHaveBeenCalled();
  });
});
