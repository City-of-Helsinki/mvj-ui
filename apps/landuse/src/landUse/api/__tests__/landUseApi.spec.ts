import { beforeEach, describe, expect, it, vi } from "vitest";
import { getSummary, updateSummary, getCompensationLookups, getUiMetadata } from "../landUseApi";
import { callApiGet, callApiPatch, callApiGetAllPages } from "../fetchClient";
import { landUseNegotiationPhaseOptions } from "../../options";

vi.mock("../fetchClient", () => ({
  callApiGet: vi.fn(),
  callApiGetAllPages: vi.fn(),
  callApiPatch: vi.fn(),
  callApiPost: vi.fn(),
  callApiPut: vi.fn(),
}));

export const agreementOverview = {
  id: 1,
  identifier: "MA101-1",
  agreement_type: "",
  district: null,
  is_promotion_area: false,
  status: "IN_PROGRESS",
  estimated_presentation_year: 2026,
  estimated_payment_year: 2027,
  detailed_plan_sites: [],
  includes_housing_obligations: false,
  obligations_deadline: null,
  authorized_signatory: null,
  detailed_plan: null,
  addresses: [],
  preparers: [],
};

describe("landuse summary contract", () => {
  beforeEach(() => vi.resetAllMocks());

  it("loads and saves an agreement using status codes and labeled options", async () => {
    vi.mocked(callApiGet).mockResolvedValue(agreementOverview);
    const summary = await getSummary("1");
    await updateSummary("1", { ...summary, edistamisalue: true });

    expect(summary.tila).toBe("IN_PROGRESS");
    expect(callApiPatch).toHaveBeenCalledWith(
      "agreements/1/",
      expect.objectContaining({ status: "IN_PROGRESS", is_promotion_area: true }),
    );
    expect(landUseNegotiationPhaseOptions).toContainEqual({
      label: "Vireillä",
      value: "IN_PROGRESS",
    });
  });
});

it("loads authoritative compensation lookup records", async () => {
  vi.mocked(callApiGetAllPages)
    .mockResolvedValueOnce([{ id: 12, name: "Housing" }])
    .mockResolvedValueOnce([{ id: 23, name: "Ownership" }])
    .mockResolvedValueOnce([{ id: 34, name: "MAPO", default_discount_percentage: "15.00" }]);
  expect(await getCompensationLookups()).toEqual({
    intendedUses: [{ id: 12, name: "Housing" }],
    tenureTypes: [{ id: 23, name: "Ownership" }],
    landPolicyPrograms: [{ id: 34, name: "MAPO", default_discount_percentage: "15.00" }],
  });
});

it("loads authoritative UI choices with country and language codes", async () => {
  const metadata = { countries: [{ label: "Finland", value: "FI" }], languages: [{ label: "Finnish", value: "fi" }] };
  vi.mocked(callApiGet).mockResolvedValue(metadata);
  expect(await getUiMetadata()).toEqual(metadata);
  expect(callApiGet).toHaveBeenCalledWith("ui-metadata/");
});

it("saves summary relationships and reloads canonical overview values", async () => {
  vi.mocked(callApiGet).mockResolvedValue(agreementOverview);
  const summary = await getSummary("1");
  await updateSummary("1", {
    ...summary,
    asemakaavaId: 12,
    toimivaltainenPaattajaId: 23,
    valmistelijat: [{ value: "34" }],
    osoitteet: [{ katuosoite: "Testikatu 1", postinumero: "00100", kaupunki: "Helsinki" }],
  });
  expect(callApiPatch).toHaveBeenCalledWith("agreements/1/", expect.objectContaining({
    detailed_plan: 12,
    authorized_signatory: 23,
    preparers: [{ preparer: 34 }],
    addresses: [{ street_address: "Testikatu 1", postal_code: "00100", city: "Helsinki" }],
  }));
  expect(callApiGet).toHaveBeenLastCalledWith("agreements/1/overview/");
});