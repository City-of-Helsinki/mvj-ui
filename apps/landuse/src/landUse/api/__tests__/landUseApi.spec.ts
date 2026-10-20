import { beforeEach, describe, expect, it, vi } from "vitest";
import { getSummary, updateSummary, getCompensationLookups } from "../landUseApi";
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