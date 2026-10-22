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
  getAsemakaavat,
  getAuthorizedSignatories,
  getLandUseList,
  getSummary,
  getParties,
  updateParties,
  getContracts,
  getBilling,
  getPaymentSchedule,
  updateDecisions,
  updateSummary,
  updateCompensations,
} from "@/landUse/api/landUseApi";
import type {
  AgreementStatusCode,
  LandUseUiMetadata,
} from "@/landUse/api/landUseTypes";
import type { LandUseCompensationsFormValues } from "@/landUse/components/tabs/LandUseCompensations";
import {
  createEmptySummaryFormValues,
  createEmptyPartyEntry,
} from "@/landUse/api/landUseFormValues";

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
    mockGet.mockResolvedValue({
      id: 1,
      identifier: "M-2026-1",
      agreement_type: "",
      district: null,
      is_promotion_area: false,
      status: "",
      estimated_presentation_year: null,
      estimated_payment_year: null,
      detailed_plan_sites: [],
      includes_housing_obligations: false,
      obligations_deadline: null,
      authorized_signatory: null,
      detailed_plan: null,
      addresses: [],
      preparers: [],
    });
  });

  it("maps list status codes separately from status labels", async () => {
    mockGetAllPages.mockResolvedValue([
      {
        id: 1,
        identifier: "M-2026-1",
        agreement_type: "",
        district: null,
        party: "List party",
        zoning_plan_number: "12345",
        site: "List site",
        is_promotion_area: true,
        status: "IN_PROGRESS",
        status_label: "Vireillä",
        estimated_presentation_year: null,
        estimated_payment_year: null,
      },
    ]);

    await expect(getLandUseList()).resolves.toEqual([
      {
        id: 1,
        identifier: "M-2026-1",
        party: "List party",
        zoningPlanNumber: "12345",
        site: "List site",
        projectArea: true,
        negotiationPhase: "IN_PROGRESS",
        negotiationPhaseLabel: "Vireillä",
      },
    ]);
  });

  it("keeps client row keys out of party and decision write payloads", async () => {
    const party = createEmptyPartyEntry();
    expect(party.id).toBeUndefined();
    expect(party.clientKey).toBeTruthy();
    expect(createEmptyPartyEntry().clientKey).not.toBe(party.clientKey);
    vi.mocked(callApiPut).mockResolvedValue([]);
    await updateParties("1", { parties: [party] });
    const partyPayload = vi.mocked(callApiPut).mock.lastCall?.[1] as object[];
    expect(partyPayload[0]).not.toHaveProperty("id");
    expect(partyPayload[0]).not.toHaveProperty("clientKey");

    mockGetAllPages.mockResolvedValue([]);
    await updateDecisions("1", {
      decisions: [
        {
          clientKey: crypto.randomUUID(),
          title: "New decision",
          paatospvm: "",
          diaarinumero: "",
          huomautus: "",
          ehdot: [],
        },
      ],
    });
    const decisionPayload = vi.mocked(callApiPut).mock
      .lastCall?.[1] as object[];
    expect(decisionPayload[0]).not.toHaveProperty("id");
    expect(decisionPayload[0]).not.toHaveProperty("clientKey");
  });

  it.each(["fi", "sv", "en", ""])(
    "preserves language %j and country codes for both recipients",
    async (language) => {
      const details = {
        id: 73,
        party_type: "COMPANY",
        name: "Actual party",
        national_identification_number: "",
        business_id: "1234567-1",
        language,
        country: language ? "DE" : "",
        street_address: "",
        postal_code: "",
        city: "",
        care_of: "",
        phone: "",
        email: "",
        note: "",
      };
      const party = {
        ...details,
        role: "LAND_OWNER",
        contact_persons: [],
        billing_details: null,
        invoice_recipient: { ...details, id: 89 },
      };
      mockGetAllPages.mockResolvedValue([party]);
      vi.mocked(callApiPut).mockResolvedValue([party]);
      const values = await getParties("1");
      expect(values.parties[0].party.details.language).toBe(
        language || undefined,
      );
      await expect(updateParties("1", values)).resolves.toMatchObject(values);
      expect(callApiPut).toHaveBeenCalledWith("agreements/1/parties/", [
        expect.objectContaining({
          id: 73,
          language,
          country: language ? "DE" : "",
          invoice_recipient: expect.objectContaining({
            language,
            country: language ? "DE" : "",
          }),
        }),
      ]);
    },
  );

  it("retains all collateral subtype details and contract/change identities", async () => {
    const codes = [
      "MORTGAGE_DEED",
      "CASH_DEPOSIT",
      "PERSONAL_GUARANTEE",
      "DEPOSIT_PLEDGE",
      "OTHER",
    ];
    const collaterals = codes.map((guarantee_type, index) => ({
      id: 80 + index,
      guarantee_type,
      parties: [73],
      document_category: "ELECTRONIC",
      target: "PROPERTY",
      property_identifiers: [{ identifier: "91-1-1-1" }],
      facility_identifier: "FAC-1",
      mortgage_deed_number: "DEED-1",
      mortgage_deed_date: "2024-02-29",
      subsequent_pledgee_name: "Pledgee",
      subsequent_pledgee_business_id: "123",
      guarantor_name: "Guarantor",
      guarantor_business_id: "456",
      guarantor_national_identification_number: "ID-1",
      guarantee_identifier: "G-1",
      account_number: "FI123",
      paid_at_date: "2026-01-01",
      third_party_pledger_name: "Third party",
      third_party_pledger_business_id: "789",
      start_date: "2026-01-01",
      end_date: null,
      amount: "123.45",
      returned_date: "2026-02-01",
      marked_returned_by: "Actual officer",
      additional_information: "Details",
    }));
    mockGetAllPages.mockResolvedValue([
      {
        id: 91,
        title: "Contract",
        identifier: "C-91",
        contract_type: "OTHER",
        signing_date: "2026-01-01",
        signing_deadline: null,
        first_invitation_sent_date: null,
        second_invitation_sent_date: null,
        third_invitation_sent_date: null,
        executor: null,
        decision: 51,
        note: "",
        changes: [{ id: 92, identifier: "Change", decision: 52 }],
        mortgage_deed_collaterals: [collaterals[0]],
        cash_deposit_collaterals: [collaterals[1]],
        personal_guarantee_collaterals: [collaterals[2]],
        deposit_pledge_collaterals: [collaterals[3]],
        other_collaterals: [collaterals[4]],
      },
    ]);
    const contract = (await getContracts("1")).contracts?.[0];
    expect(contract).toMatchObject({
      id: "91",
      paatos: "51",
      muutokset: [{ id: "92", paatos: "52" }],
    });
    expect(contract?.vakuudet.map((collateral) => collateral.tyyppi)).toEqual(
      codes,
    );
    expect(contract?.vakuudet[0]).toMatchObject({
      id: "80",
      osapuolet: ["73"],
      vakuusasiakirjanLaji: "ELECTRONIC",
      kiinteistoVaiLaitos: "PROPERTY",
      kiinteistotunnukset: ["91-1-1-1"],
      laitostunnus: "FAC-1",
      panttikirjanNumero: "DEED-1",
      panttikirjanPaivays: "29.02.2024",
      jalkipanttaus: true,
      jalkipantinSaajanNimi: "Pledgee",
      vierasvelkapanttaus: true,
      antajanNimi: "Guarantor",
      takausnumero: "G-1",
      tilinumero: "FI123",
      maara: "123.45",
      palautettuPvm: "01.02.2026",
      merkitsijaPalautus: "Actual officer",
    });
  });

  it.each(["LAND_USE_COMPENSATION", "PENALTY"])(
    "keeps invoice type %s and all item codes",
    async (invoice_type) => {
      const items = [
        "LAND_USE_COMPENSATION",
        "INCREASE",
        "INTEREST",
        "PENALTY",
      ].map((item_type) => ({
        id: 10,
        item_type,
        description: item_type,
        amount: "0.10",
      }));
      mockGetAllPages.mockResolvedValue([
        {
          id: 1,
          recipient_party: 73,
          invoice_type,
          status: "PAID",
          due_date: "2024-02-29",
          invoice_identifier: "INV-1",
          installment_sequence_number: 1,
          installment_count_total: 1,
          billed_amount: "0.40",
          remaining_amount: "0.00",
          source_payment_schedule_installment: 42,
          recipient_snapshot: {
            name: "Historical recipient",
            party_type: "COMPANY",
            business_id: "1234567-8",
            street_address: "Historic street 1",
            postal_code: "00100",
            city: "Helsinki",
            ovt_code: "OVT-1",
            sap_customer_number: "SAP-1",
            customer_reference: "REF-1",
          },
          items,
          payments: [
            {
              id: 20,
              paid_amount: "0.40",
              paid_date: "2024-03-01",
              filing_code: "LEDGER-1",
            },
          ],
        },
      ]);
      const invoice = (await getBilling("1")).invoices?.[0];
      expect(invoice).toMatchObject({
        id: "1",
        sourceInstallmentId: "42",
        recipientPartyIndex: "73",
        type: invoice_type,
        status: "PAID",
        dueDate: "29.02.2024",
        recipientSnapshot: {
          name: "Historical recipient",
          streetAddress: "Historic street 1",
        },
        payments: [
          { id: "20", paidAmount: "0.40", paidDate: "01.03.2024" },
        ],
      });
      expect(invoice?.invoiceItems?.map((item) => item.itemType)).toEqual(
        items.map((item) => item.item_type),
      );
    },
  );

  it("keeps schedule relationship IDs and normalizes installment API dates", async () => {
    const items = ["LAND_USE_COMPENSATION", "INCREASE", "INTEREST"].map(
      (item_type) => ({ item_type, description: "", amount: "100.00" }),
    );
    mockGetAllPages.mockResolvedValue([
      {
        id: 1,
        recipient_party: 73,
        contract: 91,
        status: "DRAFT",
        rejected_reason: "",
        signing_date: "2024-02-28",
        increase_percentage: null,
        base_interest_rate: null,
        interest_margin: null,
        installments: [
          {
            installment_sequence_number: 1,
            installment_count_total: 1,
            due_date: "2024-03-01",
            interest_calculation_period_start_date: "2024-02-28",
            interest_calculation_period_end_date: "2024-03-01",
            items,
          },
        ],
      },
    ]);
    const schedule = (await getPaymentSchedule("1")).paymentSchedules?.[0];
    expect(schedule).toMatchObject({
      recipientPartyIndex: "73",
      contractIndex: "91",
      installments: [
        {
          recipientPartyIndex: "73",
          contractIndex: "91",
          dueDate: "01.03.2024",
          laskentajaksonAlkupvm: "28.02.2024",
          laskentajaksonLoppupvm: "01.03.2024",
          type: "LAND_USE_COMPENSATION",
        },
      ],
    });
    expect(mockGetAllPages).toHaveBeenCalledTimes(1);
    expect(
      schedule?.installments[0].invoiceItems?.map((item) => item.itemType),
    ).toEqual(items.map((item) => item.item_type));
  });

  it("converts edited decision dates and clears them without changing codes", async () => {
    const decision = {
      id: 51,
      title: "Decision",
      decision_maker: "CITY_BOARD",
      decision_type: "LAND_USE_AGREEMENT_APPROVAL",
      decision_date: "2024-02-29",
      section: null,
      diary_number: "",
      note: "",
      conditions: [
        {
          id: 1,
          condition_type: "OTHER",
          supervision_date: "2026-01-01",
          supervised_date: null,
          note: "",
        },
      ],
    };
    mockGetAllPages.mockResolvedValue([decision]);
    const values = await getDecisions("1");
    expect(values.decisions?.[0].paatospvm).toBe("29.02.2024");
    await updateDecisions("1", values);
    expect(callApiPut).toHaveBeenLastCalledWith("agreements/1/decisions/", [
      expect.objectContaining({
        decision_date: "2024-02-29",
        decision_maker: "CITY_BOARD",
        decision_type: "LAND_USE_AGREEMENT_APPROVAL",
        conditions: [
          expect.objectContaining({
            condition_type: "OTHER",
            supervision_date: "2026-01-01",
            supervised_date: null,
          }),
        ],
      }),
    ]);
    values.decisions![0].paatospvm = "";
    await updateDecisions("1", values);
    expect(callApiPut).toHaveBeenLastCalledWith("agreements/1/decisions/", [
      expect.objectContaining({ decision_date: null }),
    ]);
    values.decisions![0].paatospvm = "31.02.2026";
    vi.mocked(callApiPut).mockClear();
    await updateDecisions("1", values);
    expect(callApiPut).toHaveBeenCalledWith("agreements/1/decisions/", [
      expect.objectContaining({ decision_date: "2026-02-31" }),
    ]);
  });

  it.each(["SR1", "SR2", "SR3", ""])(
    "round-trips preservation designation %j",
    async (designation) => {
      const site = {
        id: 41,
        identifier: "SITE-41",
        area_m2: null,
        floor_area_kem2: null,
        intended_use: null,
        tenure_types: [],
        preservation_designation: designation || null,
        has_housing_obligation: false,
        unit_price_euro_per_kem2: null,
      };
      mockGet.mockImplementation(async (path) =>
        path.endsWith("sites/") ? { agreement_sites: [site] } : null,
      );
      const values = await getCompensations("1");
      expect(values.sites[0].suojeltu).toBe(designation || undefined);
      await updateCompensations("1", values);
      expect(callApiPut).toHaveBeenCalledWith(
        "agreements/1/compensation-with-sites/",
        expect.objectContaining({
          sites: [expect.objectContaining({
          preservation_designation: designation || null,
          })],
        }),
      );
      expect((await getCompensations("1")).sites[0].suojeltu).toBe(
        designation || undefined,
      );
    },
  );

  it("rejects prototype preservation codes before any write", async () => {
    mockGet
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ agreement_sites: [] });
    const values = await getCompensations("1");
    values.sites = [
      {
        id: "41",
        kohteenTunnus: "",
        pintaAlaM2: "",
        kem2: "",
        kayttotarkoitus: undefined,
        hallintamuoto: [],
        suojeltu: "-",
        amVelvoite: false,
      },
    ];
    await expect(updateCompensations("1", values)).rejects.toThrow(
      "Invalid preservation designation",
    );
    expect(callApiPut).not.toHaveBeenCalled();
  });

  it.each(["", "   ", "\t"])("writes blank years %j as null", async (year) => {
    await updateSummary("1", {
      ...createEmptySummaryFormValues(),
      arvioituEsittelyvuosi: year,
      arvioituMaksuvuosi: year,
    });
    expect(callApiPatch).toHaveBeenCalledWith(
      "agreements/1/",
      expect.objectContaining({
        estimated_presentation_year: null,
        estimated_payment_year: null,
      }),
    );
  });

  it.each(["2026x", "2e3", "2026.5", "-2026"])(
    "rejects malformed year %j before writing",
    async (year) => {
      await expect(
        updateSummary("1", {
          ...createEmptySummaryFormValues(),
          arvioituMaksuvuosi: year,
        }),
      ).rejects.toThrow("Invalid year");
      expect(callApiPatch).not.toHaveBeenCalled();
    },
  );

  it("retains summary lookup IDs and free-text agreement type through save and reload", async () => {
    const plan = {
      id: 73,
      plan_number: "0012345",
      processing_stage: "EFFECTIVE",
      approval_date: "2026-01-10",
      effective_date: "2026-02-15",
      approver: "Plan approver",
      diary_number: "HEL-73",
    };
    const signatory = { id: 42, name: "Actual signatory" };
    const preparer = { preparer: 89, preparer_name: "Actual officer" };
    const agreement = {
      id: 1,
      identifier: "091-01-1",
      agreement_type: "Custom agreement type",
      district: null,
      is_promotion_area: false,
      status: "DRAFT",
      estimated_presentation_year: 2026,
      estimated_payment_year: 2027,
      detailed_plan_sites: [],
      includes_housing_obligations: false,
      obligations_deadline: null,
      authorized_signatory: signatory,
      detailed_plan: plan,
      addresses: [],
      preparers: [preparer],
    };
    mockGetAllPages
      .mockResolvedValueOnce([plan])
      .mockResolvedValueOnce([signatory]);
    await expect(getAsemakaavat()).resolves.toEqual([plan]);
    await expect(getAuthorizedSignatories()).resolves.toEqual([signatory]);
    expect(mockGetAllPages).toHaveBeenNthCalledWith(1, "detailed-plans/");
    expect(mockGetAllPages).toHaveBeenNthCalledWith(
      2,
      "authorized-signatories/",
    );
    mockGet.mockResolvedValueOnce(agreement);

    const values = await getSummary("1");
    expect(values).toMatchObject({
      detailedPlanId: 73,
      asemakaavanNumero: "0012345",
      asemakaavanKasittelyvaihe: "EFFECTIVE",
      toimivaltainenPaattaja: "42",
      valmistelijat: [{ value: "89" }],
      maankayttosopimusType: "Custom agreement type",
    });
    await updateSummary("1", values);
    const payload = vi.mocked(callApiPatch).mock.lastCall?.[1];
    expect(payload).toMatchObject({
      detailed_plan: 73,
      authorized_signatory: 42,
      preparers: [{ preparer: 89 }],
      agreement_type: "Custom agreement type",
    });
    expect(payload).not.toHaveProperty("processing_stage");
    expect(payload).not.toHaveProperty("approval_date");
    if (typeof payload !== "object" || payload === null) {
      throw new Error("Expected an agreement update payload");
    }
    mockGet.mockResolvedValueOnce({
      ...agreement,
      ...payload,
      detailed_plan: plan,
      authorized_signatory: signatory,
      preparers: [preparer],
    });
    await expect(getSummary("1")).resolves.toEqual(values);

    await updateSummary("1", createEmptySummaryFormValues());
    expect(callApiPatch).toHaveBeenLastCalledWith(
      "agreements/1/",
      expect.objectContaining({
        detailed_plan: null,
        authorized_signatory: null,
        preparers: [],
        agreement_type: "",
      }),
    );
  });

  it.each<AgreementStatusCode | "">([
    "DRAFT",
    "IN_PROGRESS",
    "NEGOTIATION",
    "DECISION",
    "SIGNATURE",
    "NO_AGREEMENT",
    "",
  ])(
    "preserves summary status '%s' through GET, unchanged save, and GET",
    async (status) => {
      const agreement = {
        id: 1,
        identifier: "091-01-1",
        agreement_type: "Maankäyttösopimus",
        district: { id: 1, name: "Kruununhaka", identifier: "01" },
        is_promotion_area: false,
        status,
        estimated_presentation_year: null,
        estimated_payment_year: null,
        detailed_plan_sites: [],
        includes_housing_obligations: false,
        obligations_deadline: null,
        authorized_signatory: null,
        detailed_plan: null,
        addresses: [],
        preparers: [],
      };
      mockGet.mockResolvedValueOnce(agreement);

      const values = await getSummary("1");
      expect(values.tila).toBe(status || undefined);
      expect(values.arvioituEsittelyvuosi).toBe("");
      expect(values.arvioituMaksuvuosi).toBe("");

      await updateSummary("1", values);

      expect(callApiPatch).toHaveBeenLastCalledWith(
        "agreements/1/",
        expect.objectContaining({
          status,
          estimated_presentation_year: null,
          estimated_payment_year: null,
        }),
      );
      const savedPayload = vi.mocked(callApiPatch).mock.lastCall?.[1];
      if (typeof savedPayload !== "object" || savedPayload === null) {
        throw new Error("Expected an agreement update payload");
      }
      mockGet.mockResolvedValueOnce({ ...agreement, ...savedPayload });

      expect((await getSummary("1")).tila).toBe(status || undefined);
      expect(mockGet).toHaveBeenNthCalledWith(1, "agreements/1/overview/");
      expect(mockGet).toHaveBeenNthCalledWith(2, "agreements/1/overview/");
    },
  );

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

    expect(callApiPut).toHaveBeenCalledWith(
      "agreements/agreement-1/compensation-with-sites/",
      expect.objectContaining({
        compensation: expect.objectContaining({
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
        sites: [],
      }),
    );
  });
});
