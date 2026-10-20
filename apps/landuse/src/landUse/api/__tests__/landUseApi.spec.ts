import { beforeEach, describe, expect, it, vi } from "vitest";
import { getSummary, updateSummary, getCompensationLookups, getUiMetadata, getLandUseList } from "../landUseApi";
import { callApiGet, callApiPatch, callApiGetAllPages } from "../fetchClient";
import { landUseNegotiationPhaseOptions, landUseSuojeltuOptions } from "../../options";
import { calculateInvoicingPeriodDays } from "../../utils/date";

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

it("maps searchable list fields and preserves the status code", async () => {
  vi.mocked(callApiGetAllPages).mockResolvedValue([{
    ...agreementOverview,
    party_names: ["Test Oy"], detailed_plan_number: "12345", detailed_plan_sites: ["91-1-1-1"],
  }]);
  expect(await getLandUseList()).toEqual([expect.objectContaining({
    party: "Test Oy", zoningPlanNumber: "12345", site: "91-1-1-1", negotiationPhase: "IN_PROGRESS",
  })]);
});

it("clears optional years and supports API preservation and date values", async () => {
  vi.mocked(callApiGet).mockResolvedValue(agreementOverview);
  await updateSummary("1", { ...(await getSummary("1")), arvioituMaksuvuosi: "" });
  expect(callApiPatch).toHaveBeenLastCalledWith("agreements/1/", expect.objectContaining({ estimated_payment_year: null }));
  expect(landUseSuojeltuOptions.map((option) => option.value)).toEqual(["", "SR1", "SR2", "SR3"]);
  expect(calculateInvoicingPeriodDays("2026-01-01", "2026-02-01")).toBe(31);
  expect(calculateInvoicingPeriodDays("01.01.2026", "01.02.2026")).toBe(31);
});