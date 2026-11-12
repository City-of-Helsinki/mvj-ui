import React from "react";
import { createForm } from "final-form";
import arrayMutators from "final-form-arrays";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  LandUseContracts,
  type LandUseContractsFormValues,
} from "../LandUseContracts";
import {
  LandUseDecisions,
  type LandUseDecisionsFormValues,
} from "../LandUseDecisions";
import { createEmptyPartyEntry } from "@/landUse/api/landUseFormValues";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  LandUseCompensations,
  type LandUseCompensationsFormValues,
} from "../LandUseCompensations";
import {
  LandUseBilling,
  type LandUseBillingFormValues,
} from "../LandUseBilling";
import {
  LandUsePaymentSchedule,
  type LandUsePaymentScheduleFormValues,
} from "../LandUsePaymentSchedule";

vi.mock("@/landUse/api/landUseApi", () => ({
  getSiteIntendedUses: vi.fn(async () => []),
  getSiteTenureTypes: vi.fn(async () => []),
  getLandPolicyPrograms: vi.fn(async () => []),
}));

vi.mock("@/landUse/api/useLandUseMetadata", () => ({
  useLandUseMetadata: () => ({
    data: {
      contract_types: [{ value: "other", label: "Muu sopimus" }],
      collateral_types: [
        { value: "mortgage_deed", label: "Pantti" },
        { value: "cash_deposit", label: "Raha" },
        { value: "personal_guarantee", label: "Takaus" },
        { value: "deposit_pledge", label: "Tili" },
        { value: "other", label: "Muu" },
      ],
      mortgage_deed_collateral_targets: [
        { value: "property", label: "Kiinteisto" },
        { value: "facility", label: "Laitos" },
      ],
      collateral_document_categories: [
        { value: "electronic", label: "Sahkoinen" },
      ],
      decision_makers: [{ value: "city_board", label: "Kaupunginhallitus" }],
      decision_types: [
        { value: "land_use_agreement_approval", label: "Hyvaksyminen" },
      ],
      decision_condition_types: [{ value: "other", label: "Muu ehto" }],
      preservation_designations: ["sr1", "sr2", "sr3"].map((value) => ({
        value,
        label: value.toUpperCase(),
      })),
      invoice_types: [{ value: "land_use_compensation", label: "Korvaus" }],
      invoice_statuses: [{ value: "paid", label: "Maksettu" }],
      invoice_item_types: [
        { value: "land_use_compensation", label: "Korvaus" },
      ],
    },
  }),
}));
vi.mock("@/landUse/hooks/useTableOfContents", () => ({
  useTocEntries: vi.fn(),
}));

beforeEach(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const decision = {
  id: "51",
  title: "Actual decision",
  paattaja: "city_board",
  paatospvm: "29.02.2024",
  paatoksenTyyppi: "land_use_agreement_approval",
  diaarinumero: "HEL-51",
  huomautus: "",
  ehdot: [
    { conditionType: "other", valvontapvm: "", valvottuPvm: "", note: "" },
  ],
};

describe("backend-valued contract conventions", () => {
  it("keeps an unsaved decision row mounted when an earlier row is removed", () => {
    const form = createForm<LandUseDecisionsFormValues>({
      onSubmit: () => {},
      initialValues: { decisions: [] },
      mutators: { ...arrayMutators },
    });
    render(<LandUseDecisions form={form} isEditMode parties={[]} />);
    fireEvent.click(screen.getByRole("button", { name: "Lisää päätös" }));
    fireEvent.click(screen.getByRole("button", { name: "Lisää päätös" }));
    const rows = form.getState().values.decisions!;
    expect(rows[0].id).toBeUndefined();
    expect(rows[1].id).toBeUndefined();
    expect(rows[0].clientKey).not.toBe(rows[1].clientKey);
    const remainingInput = screen.getAllByLabelText("Diaarinumero")[1];
    act(() => form.mutators.remove("decisions", 0));
    expect(screen.getByLabelText("Diaarinumero")).toBe(remainingInput);
    expect(form.getState().values.decisions?.[0].clientKey).toBe(
      rows[1].clientKey,
    );
  });

  it("keeps schedule parties and contracts stable when lookup arrays reorder", () => {
    const first = createEmptyPartyEntry();
    first.id = "73";
    first.party.details.name = "Actual recipient";
    const second = createEmptyPartyEntry();
    second.id = "89";
    second.party.details.name = "Other recipient";
    const contract = {
      id: "91",
      title: "",
      sopimusnumero: "C-91",
      allekirjoituspvm: "",
      huomautus: "",
      allekirjoitettavaMennessa: "",
      ensimmainenKutsuLahetetty: "",
      toinenKutsuLahetetty: "",
      kolmasKutsuLahetetty: "",
      toimeenpanija: "",
      muutokset: [],
      vakuudet: [],
    };
    const otherContract = { ...contract, id: "92", sopimusnumero: "C-92" };
    const form = createForm<LandUsePaymentScheduleFormValues>({
      onSubmit: () => {},
      mutators: { ...arrayMutators },
      initialValues: {
        paymentSchedules: [
          {
            id: "1",
            recipientPartyIndex: "73",
            contractIndex: "91",
            status: "draft",
            rejectedReason: null,
            signedDate: "",
            korotusProsentti: "",
            korkoPeruskorko: "",
            korkoMarginaali: "",
            daysInYear: "365",
            installments: [
              {
                recipientPartyIndex: "73",
                contractIndex: "91",
                installmentNumber: "1",
                installmentTotal: "1",
                signedDate: "",
                asemakaavanLainvoimaisuusPvm: "",
                dueDate: "",
                laskentajaksonAlkupvm: "",
                laskentajaksonLoppupvm: "",
                invoiceNumber: "",
                type: "land_use_compensation",
                status: "draft",
                billedAmount: "",
                remainingAmount: "",
                invoiceItems: [],
              },
            ],
          },
        ],
      },
    });
    const props = {
      form,
      isEditMode: false,
      canSubmitSchedules: false,
      asemakaavanNumero: "",
      asemakaavanLainvoimaisuusPvm: "",
      agreementIdentifier: "",
      onSendToInvoicing: vi.fn(),
    };
    const { rerender } = render(
      <LandUsePaymentSchedule
        {...props}
        parties={[first, second]}
        contracts={[contract, otherContract]}
      />,
    );
    expect((screen.getByLabelText("Sopimus") as HTMLInputElement).value).toBe(
      "C-91",
    );
    rerender(
      <LandUsePaymentSchedule
        {...props}
        parties={[second, first]}
        contracts={[otherContract, contract]}
      />,
    );
    expect((screen.getByLabelText("Sopimus") as HTMLInputElement).value).toBe(
      "C-91",
    );
    expect(form.getState().values.paymentSchedules?.[0]).toMatchObject({
      recipientPartyIndex: "73",
      contractIndex: "91",
    });
    rerender(
      <LandUsePaymentSchedule
        {...props}
        parties={[first]}
        contracts={[contract]}
      />,
    );
    expect((screen.getByLabelText("Sopimus") as HTMLInputElement).value).toBe(
      "C-91",
    );
  });

  it.each(["sr1", "sr2", "sr3"])(
    "selects preservation code %s and clears the optional selection",
    async (code) => {
      const form = createForm<LandUseCompensationsFormValues>({
        onSubmit: () => {},
        mutators: { ...arrayMutators },
        initialValues: {
          sites: [
            {
              id: "41",
              kohteenTunnus: "SITE-41",
              pintaAlaM2: "",
              kem2: "",
              kayttotarkoitus: undefined,
              hallintamuoto: [],
              suojeltu: undefined,
              amVelvoite: false,
            },
          ],
          perustietotaulukkoRowsBySiteId: {},
        } as LandUseCompensationsFormValues,
      });
      render(
        <QueryClientProvider client={new QueryClient()}>
          <LandUseCompensations form={form} isEditMode />
        </QueryClientProvider>,
      );
      fireEvent.click(
        screen.getByRole("button", { name: "Avaa kohteen tiedot" }),
      );
      fireEvent.click(screen.getByRole("combobox", { name: /Suojeltu/ }));
      fireEvent.click(
        await screen.findByRole("option", { name: code.toUpperCase() }),
      );
      expect(form.getState().values.sites[0].suojeltu).toBe(code);
      fireEvent.click(
        screen.getByRole("button", { name: /Poista nykyinen valinta/ }),
      );
      expect(form.getState().values.sites[0].suojeltu).toBeUndefined();
    },
  );

  it("keeps invoice recipient references through party reordering and removal", () => {
    const first = createEmptyPartyEntry();
    first.id = "73";
    first.party.details.name = "Actual recipient";
    const second = createEmptyPartyEntry();
    second.id = "89";
    second.party.details.name = "Other recipient";
    const form = createForm<LandUseBillingFormValues>({
      onSubmit: () => {},
      mutators: { ...arrayMutators },
      initialValues: {
        invoices: [
          {
            recipientPartyIndex: "73",
            installmentNumber: "1",
            installmentTotal: "1",
            dueDate: "",
            invoiceNumber: "INV-1",
            type: "land_use_compensation",
            status: "paid",
            billedAmount: "100",
            remainingAmount: "0",
            invoiceItems: [],
          },
        ],
      },
    });
    const props = {
      form,
      isEditMode: false,
      canReviewSchedules: false,
      paymentSchedules: [],
      onAcceptSchedule: vi.fn(),
      onDeclineSchedule: vi.fn(),
    };
    const { rerender } = render(
      <LandUseBilling {...props} parties={[first, second]} />,
    );
    expect(screen.getByText("Actual recipient")).toBeTruthy();
    rerender(<LandUseBilling {...props} parties={[second, first]} />);
    expect(screen.getByText("Actual recipient")).toBeTruthy();
    expect(screen.getByText("Korvaus")).toBeTruthy();
    expect(screen.getByText("Maksettu")).toBeTruthy();
    rerender(<LandUseBilling {...props} parties={[second]} />);
    expect(form.getState().values.invoices?.[0].recipientPartyIndex).toBe("73");
    expect(screen.queryByText("Other recipient")).toBeNull();
  });

  it.each([
    ["mortgage_document", "Panttikirjan numero", "DEED-1"],
    ["financial_guarantee", "Maksettu päivämäärällä", "01.01.2026"],
    ["self_debtor_guarantee", "Takausnumero", "G-1"],
    ["pledge_of_funds", "Tilinumero", "FI123"],
    ["other", "Lisätiedot", "Actual details"],
  ] as const)(
    "renders %s subtype details and party labels",
    (collateralType, label, value) => {
      const party = createEmptyPartyEntry();
      party.id = "73";
      party.party.details.name = "Actual party";
      const form = createForm<LandUseContractsFormValues>({
        onSubmit: () => {},
        mutators: { ...arrayMutators },
        initialValues: {
          contracts: [
            {
              id: "91",
              title: "Contract",
              sopimuksenTyyppi: "other",
              sopimusnumero: "C-91",
              allekirjoituspvm: "",
              huomautus: "",
              allekirjoitettavaMennessa: "",
              ensimmainenKutsuLahetetty: "",
              toinenKutsuLahetetty: "",
              kolmasKutsuLahetetty: "",
              paatos: "51",
              toimeenpanija: "",
              muutokset: [],
              vakuudet: [
                {
                  id: "81",
                  collateralType,
                  osapuolet: ["73"],
                  kiinteistoVaiLaitos: "property",
                  vakuusasiakirjanLaji: "electronic",
                  kiinteistotunnukset: ["91-1-1-1"],
                  panttikirjanNumero: "DEED-1",
                  maksettuPvm: "01.01.2026",
                  takausnumero: "G-1",
                  tilinumero: "FI123",
                  lisatiedot: "Actual details",
                  palautettuPvm: "02.01.2026",
                  merkitsijaPalautus: "Actual officer",
                },
              ],
            },
          ],
        },
      });
      render(
        <LandUseContracts
          form={form}
          isEditMode={false}
          parties={[party]}
          decisions={[decision]}
        />,
      );
      expect((screen.getByLabelText(label) as HTMLInputElement).value).toBe(
        value,
      );
      expect(
        (screen.getByLabelText("Osapuolet") as HTMLInputElement).value,
      ).toBe("Actual party");
      expect((screen.getByLabelText("Päätös") as HTMLInputElement).value).toBe(
        "Actual decision",
      );
      expect(
        (screen.getByLabelText("Sopimuksen tyyppi") as HTMLInputElement).value,
      ).toBe("Muu sopimus");
      expect(
        form.getState().values.contracts?.[0].vakuudet[0].collateralType,
      ).toBe(collateralType);
    },
  );

  it("displays decision labels without mutating codes and clears optional selections", () => {
    const form = createForm<LandUseDecisionsFormValues>({
      onSubmit: () => {},
      initialValues: { decisions: [decision] },
      mutators: { ...arrayMutators },
    });
    const { rerender } = render(
      <LandUseDecisions form={form} isEditMode={false} parties={[]} />,
    );
    expect((screen.getByLabelText("Päättäjä") as HTMLInputElement).value).toBe(
      "Kaupunginhallitus",
    );
    expect(
      (screen.getByLabelText("Päätöksen tyyppi") as HTMLInputElement).value,
    ).toBe("Hyvaksyminen");
    expect(form.getState().values.decisions?.[0].paattaja).toBe("city_board");
    rerender(<LandUseDecisions form={form} isEditMode parties={[]} />);
    expect(
      screen.getByRole("combobox", { name: /Päättäjä/ }).textContent,
    ).toContain("Kaupunginhallitus");
    act(() => form.change("decisions", [{ ...decision, paattaja: undefined }]));
    fireEvent.click(screen.getByRole("combobox", { name: /Päättäjä/ }));
    fireEvent.click(screen.getByRole("option", { name: "Kaupunginhallitus" }));
    expect(form.getState().values.decisions?.[0].paattaja).toBe("city_board");
  });
});
