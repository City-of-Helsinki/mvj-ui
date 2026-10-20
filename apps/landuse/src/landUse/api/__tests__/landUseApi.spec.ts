import { beforeEach, describe, expect, it, vi } from "vitest";
import { getSummary, updateSummary, getCompensationLookups, getUiMetadata, getLandUseList, getContracts, getBilling } from "../landUseApi";
import { callApiGet, callApiPatch, callApiGetAllPages } from "../fetchClient";
import { landUseNegotiationPhaseOptions, landUseSuojeltuOptions } from "../../options";
import { calculateInvoicingPeriodDays } from "../../utils/date";
import { createLandUseAgreement, updateContracts, updatePaymentSchedule, sendInvoiceToSap } from "../landUseApi";
import { callApiPost } from "../fetchClient";
import { callApiPut } from "../fetchClient";
import { metadataOptions } from "../../hooks/useUiMetadata";
import { getRelatedRecordIndex } from "../../utils/fieldUtils";

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

it("loads identifiable contracts and renders backend collateral types", async () => {
  vi.mocked(callApiGet).mockResolvedValue({
    contract_types: [{ value: "LAND_USE_AGREEMENT", label: "Maankäyttösopimus" }],
    collateral_types: [{ value: "MORTGAGE_DEED", label: "Panttikirja" }],
    collateral_document_categories: [{ value: "ELECTRONIC", label: "Sähköinen" }],
    mortgage_deed_collateral_targets: [{ value: "PROPERTY", label: "Kiinteistö" }],
  });
  vi.mocked(callApiGetAllPages).mockResolvedValue([{
    id: 12, identifier: "Contract 1", title: "", contract_type: "LAND_USE_AGREEMENT", changes: [],
    mortgage_deed_collaterals: [{ id: 23, guarantee_type: "MORTGAGE_DEED", parties: [34], document_category: "ELECTRONIC", target: "PROPERTY", property_identifiers: [], amount: "100.00" }],
    cash_deposit_collaterals: [], personal_guarantee_collaterals: [], deposit_pledge_collaterals: [], other_collaterals: [],
  }]);
  expect((await getContracts("1")).contracts?.[0]).toMatchObject({
    id: "12", sopimuksenTyyppi: "Maankäyttösopimus",
    vakuudet: [{ id: "23", tyyppi: "Panttikirja", osapuolet: ["34"], vakuusasiakirjanLaji: "Sähköinen", kiinteistoVaiLaitos: "Kiinteistö" }],
  });
});

it("loads historical invoice recipients and ledger entries with invoice identity", async () => {
  vi.mocked(callApiGetAllPages).mockResolvedValueOnce([{
    id: 12, recipient_party: 34, source_payment_schedule_installment: 23,
    installment_sequence_number: 1, installment_count_total: 1, invoice_identifier: "INV-12",
    invoice_type: "LAND_USE_COMPENSATION", status: "OPEN", items: [], billed_amount: "100.00", remaining_amount: "75.00",
    recipient_snapshot: { party_type: "COMPANY", name: "Historical Oy", street_address: "Old 1", city: "Helsinki", postal_code: "00100", business_id: "123", ovt_code: "OVT", sap_customer_number: "SAP", customer_reference: "REF" },
    payments: [{ id: 45, paid_amount: "25.00", paid_date: "2026-10-20", filing_code: "FILE" }],
  }]).mockResolvedValueOnce([]);
  expect((await getBilling("1")).invoices?.[0]).toMatchObject({
    id: "12", sourceInstallmentId: "23", type: "Maankäyttökorvaus",
    recipientSnapshot: { party: { details: { name: "Historical Oy" } } },
    payments: [{ id: 45, paid_amount: "25.00", paid_date: "2026-10-20", filing_code: "FILE" }],
  });
});

it("creates an agreement using server-side identifier allocation", async () => {
  vi.mocked(callApiPost).mockResolvedValue({ id: 12 });
  expect(await createLandUseAgreement("1", "23")).toBe("12");
  expect(callApiPost).toHaveBeenLastCalledWith("agreements/", { municipality: "1", district: 23 });
});

it("saves contract types using metadata codes and retains record IDs", async () => {
  vi.mocked(callApiGet).mockResolvedValue({ contract_types: [{ value: "LAND_USE_AGREEMENT", label: "Maankäyttösopimus" }] });
  vi.mocked(callApiGetAllPages).mockResolvedValue([]);
  await updateContracts("1", { contracts: [{ id: "12", title: "", sopimuksenTyyppi: "Maankäyttösopimus", sopimusnumero: "C1", allekirjoituspvm: "", huomautus: "", allekirjoitettavaMennessa: "", ensimmainenKutsuLahetetty: "", toinenKutsuLahetetty: "", kolmasKutsuLahetetty: "", muutokset: [], vakuudet: [], toimeenpanija: "" }] });
  expect(callApiPut).toHaveBeenCalledWith("agreements/1/contracts/", [expect.objectContaining({ id: 12, identifier: "C1", contract_type: "LAND_USE_AGREEMENT" })]);
});

it("saves draft schedules using party and contract IDs", async () => {
  vi.mocked(callApiGetAllPages).mockResolvedValue([]);
  await updatePaymentSchedule("1", { paymentSchedules: [{
    id: "schedule-new", recipientPartyId: "12", contractId: "23", recipientPartyIndex: undefined, contractIndex: undefined,
    status: "Luonnos", rejectedReason: null, signedDate: "", korotusProsentti: "0", korkoPeruskorko: "0", korkoMarginaali: "0", daysInYear: "365", installments: [],
  }] });
  expect(callApiPut).toHaveBeenLastCalledWith("agreements/1/payment-schedules/", [expect.objectContaining({ recipient_party: 12, contract: 23, installments: [] })]);
});

it("sends a persisted invoice using the backend SAP operation", async () => {
  await sendInvoiceToSap("12");
  expect(callApiPost).toHaveBeenLastCalledWith("invoices/12/send-to-sap/", {});
});

it("builds form options from authoritative metadata without losing codes", () => {
  const metadata = { decision_makers: [{ value: "LAND_MANAGER", label: "Manager" }] };
  expect(metadataOptions(metadata, "decision_makers")).toEqual(metadata.decision_makers);
  expect(metadataOptions(metadata, "decision_makers", true)).toEqual([{ value: "Manager", label: "Manager" }]);
});

it("resolves relationships by record ID after collection order changes", () => {
  expect(getRelatedRecordIndex("12", [{ id: "23" }, { id: "12" }])).toBe("1");
  expect(getRelatedRecordIndex("34", [{ id: "12" }])).toBeUndefined();
});