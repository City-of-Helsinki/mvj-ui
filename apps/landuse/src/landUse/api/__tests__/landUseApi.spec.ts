import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  callApiGet,
  callApiGetAllPages,
  callApiPatch,
  callApiPut,
} from "@/landUse/api/fetchClient";
import {
  getCompensations,
  getLandPolicyPrograms,
  getLandUseUiMetadata,
  getSiteIntendedUses,
  getSiteTenureTypes,
  getDecisions,
  getPreparers,
  updateSummary,
  updateCompensations,
} from "@/landUse/api/landUseApi";
import type { LandUseUiMetadata } from "@/landUse/api/landUseTypes";
import type { LandUseCompensationsFormValues } from "@/landUse/components/tabs/LandUseCompensations";
import { createEmptySummaryFormValues } from "@/landUse/api/landUseFormValues";

vi.mock("@/landUse/api/fetchClient", () => ({
  callApiGet: vi.fn(),
  callApiGetAllPages: vi.fn(),
  callApiPatch: vi.fn(),
  callApiPut: vi.fn(),
}));

const mockGet = vi.mocked(callApiGet);
const mockGetAllPages = vi.mocked(callApiGetAllPages);

describe("land use API contract adapters", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("saves signatory, addresses, and preparers using backend field names and IDs", async () => {
    const values = {
      ...createEmptySummaryFormValues(),
      toimivaltainenPaattaja: "17",
      osoitteet: [
        {
          katuosoite: "Testikatu 1",
          postinumero: "00100",
          kaupunki: "Helsinki",
        },
        { katuosoite: "", postinumero: "", kaupunki: "" },
      ],
      valmistelijat: [{ value: "23" }, { value: undefined }],
    };

    await updateSummary("1", values);

    expect(callApiPatch).toHaveBeenLastCalledWith(
      "agreements/1/",
      expect.objectContaining({
        authorized_signatory: 17,
        addresses: [
          {
            street_address: "Testikatu 1",
            postal_code: "00100",
            city: "Helsinki",
          },
        ],
        preparers: [{ preparer: 23 }],
      }),
    );

    await updateSummary("1", createEmptySummaryFormValues());

    expect(callApiPatch).toHaveBeenLastCalledWith(
      "agreements/1/",
      expect.objectContaining({
        authorized_signatory: null,
        addresses: [],
        preparers: [],
      }),
    );
  });

  it("loads real preparer IDs and names from the shared user API", async () => {
    mockGetAllPages.mockResolvedValue([
      { id: 23, username: "preparer", first_name: "Test", last_name: "User" },
      { id: 24, username: "another", first_name: "", last_name: "" },
    ]);

    await expect(getPreparers()).resolves.toEqual([
      { id: 23, name: "Test User" },
      { id: 24, name: "another" },
    ]);
    expect(mockGetAllPages).toHaveBeenCalledWith("officer/", {
      apiNamespace: "",
    });
  });

  it("loads backend metadata and named lookup DTOs without replacing codes or IDs", async () => {
    const metadata: LandUseUiMetadata = {
      agreement_statuses: [{ value: "DRAFT", label: "Luonnos" }],
      detailed_plan_processing_stages: [
        { value: "EFFECTIVE", label: "Lainvoimainen" },
      ],
      party_types: [{ value: "COMPANY", label: "Yritys" }],
      agreement_party_roles: [{ value: "LAND_OWNER", label: "Maanomistaja" }],
      contract_types: [
        { value: "LAND_USE_AGREEMENT", label: "Maankäyttösopimus" },
      ],
      collateral_types: [{ value: "MORTGAGE_DEED", label: "Panttirja" }],
      collateral_document_categories: [
        { value: "ELECTRONIC", label: "Sähköinen" },
      ],
      mortgage_deed_collateral_targets: [
        { value: "PROPERTY", label: "Kiinteistö" },
      ],
      decision_makers: [{ value: "CITY_BOARD", label: "Kaupunginhallitus" }],
      decision_types: [
        { value: "LAND_USE_AGREEMENT_APPROVAL", label: "Hyväksyminen" },
      ],
      decision_condition_types: [{ value: "OTHER", label: "Muu" }],
      invoice_types: [
        { value: "LAND_USE_COMPENSATION", label: "Maankäyttökorvaus" },
      ],
      invoice_statuses: [{ value: "OPEN", label: "Avoin" }],
      invoice_item_types: [
        { value: "LAND_USE_COMPENSATION", label: "Maankäyttökorvaus" },
      ],
      payment_schedule_statuses: [{ value: "DRAFT", label: "Luonnos" }],
      payment_schedule_item_types: [
        { value: "LAND_USE_COMPENSATION", label: "Maankäyttökorvaus" },
      ],
      preservation_designations: [
        { value: "SR1", label: "SR1" },
        { value: "SR2", label: "SR2" },
        { value: "SR3", label: "SR3" },
      ],
      languages: [{ value: "fi", label: "suomi" }],
      countries: [{ value: "DE", label: "Saksa" }],
    };
    mockGet.mockResolvedValue(metadata);
    mockGetAllPages
      .mockResolvedValueOnce([{ id: 17, name: "Asuinkerrostalot" }])
      .mockResolvedValueOnce([{ id: 23, name: "Pitkä korkotuki" }])
      .mockResolvedValueOnce([
        {
          id: 31,
          name: "MAPO 2030",
          default_discount_percentage: "12.50",
        },
      ]);

    await expect(getLandUseUiMetadata()).resolves.toEqual(metadata);
    await expect(getSiteIntendedUses()).resolves.toEqual([
      { id: 17, name: "Asuinkerrostalot" },
    ]);
    await expect(getSiteTenureTypes()).resolves.toEqual([
      { id: 23, name: "Pitkä korkotuki" },
    ]);
    await expect(getLandPolicyPrograms()).resolves.toEqual([
      {
        id: 31,
        name: "MAPO 2030",
        default_discount_percentage: "12.50",
      },
    ]);

    expect(mockGet).toHaveBeenCalledWith("ui-metadata/");
    expect(mockGetAllPages).toHaveBeenNthCalledWith(1, "site-intended-uses/");
    expect(mockGetAllPages).toHaveBeenNthCalledWith(2, "site-tenure-types/");
    expect(mockGetAllPages).toHaveBeenNthCalledWith(3, "land-policy-programs/");
  });

  it("maps serializer-shaped site and decision values without losing IDs, decimals, or nulls", async () => {
    mockGet
      .mockResolvedValueOnce({
        excel_calculation_url: null,
        monetary_compensation: "100.25",
        land_compensation: null,
        other_compensation: "0.00",
        total_compensation: "100.25",
        base_price: "0.10",
        land_compensation_description: "",
        other_compensation_description: "",
        value_before_detailed_plan_proposal: null,
        demolition_or_other_deduction: null,
        land_use_compensation: "100.25",
        land_policy_program: { id: 31, name: "MAPO 2030" },
        land_policy_program_discount_percentage: "12.50",
        public_areas_m2: null,
        public_areas_acquisition_value: null,
      })
      .mockResolvedValueOnce({
        agreement_sites: [
          {
            id: 41,
            identifier: "SITE-41",
            area_m2: "123.45",
            floor_area_kem2: null,
            intended_use: { id: 17, name: "Asuinkerrostalot" },
            tenure_types: [{ id: 23, name: "Pitkä korkotuki" }],
            preservation_designation: "SR3",
            has_housing_obligation: false,
            unit_price_euro_per_kem2: "0.01",
          },
        ],
      });
    mockGetAllPages.mockResolvedValue([
      {
        id: 51,
        title: "Päätös",
        decision_maker: "CITY_BOARD",
        decision_date: null,
        section: 12,
        decision_type: "LAND_USE_AGREEMENT_APPROVAL",
        diary_number: "HEL-51",
        note: "",
        conditions: [
          {
            id: 61,
            condition_type: "OTHER",
            supervision_date: null,
            supervised_date: null,
            note: "",
          },
        ],
      },
    ]);

    const compensations = await getCompensations("agreement-1");
    const decisions = await getDecisions("agreement-1");

    expect(compensations.sites[0]).toMatchObject({
      id: "41",
      kayttotarkoitusId: 17,
      hallintamuotoIds: [23],
      suojeltu: "SR3",
      pintaAlaM2: "123.45",
    });
    expect(compensations).toMatchObject({
      rahakorvaus: "100.25",
      maakorvaus: "",
      maankayttokorvaus: "100.25",
      maapoliittinenOhjelmaId: 31,
      huojennusProsentti: "12.50",
    });
    expect(decisions.decisions[0]).toMatchObject({
      id: "51",
      paattaja: "CITY_BOARD",
      pykala: "12",
      paatoksenTyyppi: "LAND_USE_AGREEMENT_APPROVAL",
      ehdot: [{ conditionType: "OTHER" }],
    });
    expect(mockGet).toHaveBeenNthCalledWith(
      1,
      "agreements/agreement-1/compensation/",
    );
    expect(mockGet).toHaveBeenNthCalledWith(2, "agreements/agreement-1/sites/");
    expect(mockGetAllPages).toHaveBeenCalledWith(
      "agreements/agreement-1/decisions/",
    );
  });

  it("writes decimal values as exact strings and preserves blanks as null", async () => {
    mockGet
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ agreement_sites: [] });
    vi.mocked(callApiPut).mockResolvedValue(undefined);
    const values = {
      sites: [],
      rahakorvaus: "999999999999999999.99",
      maakorvaus: "",
      muuKorvaus: "0.10",
      maankayttokorvausYhteensa: "999999999999999999.99",
      perushinta: "12.30",
      maakorvausSelite: "",
      muuSelite: "",
      excelLaskelmaUrl: "",
      kaavaehdotustaEdeltavaArvo: "",
      perustietotaulukkoRowsBySiteId: {},
      purkuTaiMuuVahennys: 0,
      maankayttokorvaus: "999999999999999999.99",
      maapoliittinenOhjelmaId: null,
      maapoliittinenOhjelma: undefined,
      huojennusProsentti: "12.50",
      yleisetAlueetNeliot: "",
      yleisetAlueetHankinnanArvo: "0.01",
    } as LandUseCompensationsFormValues;

    await updateCompensations("agreement-1", values);

    expect(callApiPut).toHaveBeenNthCalledWith(
      1,
      "agreements/agreement-1/compensation/",
      expect.objectContaining({
        monetary_compensation: "999999999999999999.99",
        land_compensation: null,
        other_compensation: "0.10",
        total_compensation: "999999999999999999.99",
        base_price: "12.30",
        value_before_detailed_plan_proposal: null,
        land_use_compensation: "999999999999999999.99",
        land_policy_program_discount_percentage: "12.50",
        public_areas_m2: null,
        public_areas_acquisition_value: "0.01",
      }),
    );
    expect(callApiPut).toHaveBeenNthCalledWith(
      2,
      "agreements/agreement-1/sites/",
      [],
    );
  });
});
