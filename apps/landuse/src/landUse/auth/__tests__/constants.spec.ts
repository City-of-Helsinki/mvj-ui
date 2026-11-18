import { describe, expect, it, vi } from "vitest";
import { LANDUSE_BASE_PATH } from "../../../../constants";
import { loginProviderProperties } from "@/landUse/auth/constants";

vi.mock("hds-react", () => ({
  createTokenizedFetchModule: vi.fn(() => ({})),
}));

describe("landuse authentication configuration", () => {
  it("returns authentication to the callback within the landuse router", () => {
    const callbackUrl = new URL(
      loginProviderProperties.userManagerSettings.redirect_uri,
    );

    expect(callbackUrl.origin).toBe(location.origin);
    expect(callbackUrl.pathname).toBe(`${LANDUSE_BASE_PATH}/callback`);
    expect(callbackUrl.pathname).toBe("/maankayttosopimukset/callback");
  });
});
