import React from "react";
import { createForm } from "final-form";
import arrayMutators from "final-form-arrays";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { createEmptySummaryFormValues } from "@/landUse/api/landUseFormValues";
import { callApiPut } from "@/landUse/api/fetchClient";
import { updateSummary } from "@/landUse/api/landUseApi";
import {
  LandUseSummary,
  type LandUseSummaryFormValues,
} from "@/landUse/components/tabs/LandUseSummary";

vi.mock("@/landUse/api/fetchClient", () => ({
  callApiPut: vi.fn(),
  callApiGet: vi.fn(),
  callApiGetAllPages: vi.fn(async (path: string) =>
    path === "authorized-signatories/"
      ? [
          { id: 17, name: "First signatory" },
          { id: 42, name: "Second signatory" },
        ]
      : path === "detailed-plans/"
        ? [
            {
              id: 73,
              plan_number: "0012345",
              processing_stage: "effective",
              approval_date: "2026-01-10",
              effective_date: "2026-02-15",
              approver: "Plan approver",
              diary_number: "HEL-73",
            },
          ]
        : path === "officer/"
          ? [
              {
                id: 89,
                username: "officer",
                first_name: "Actual",
                last_name: "Officer",
              },
            ]
          : [],
  ),
}));

vi.mock("@/landUse/api/useLandUseMetadata", () => ({
  useLandUseMetadata: () => ({
    data: {
      detailed_plan_processing_stages: [
        { value: "effective", label: "Lainvoimainen" },
      ],
      agreement_statuses: [
        { value: "draft", label: "Luonnos" },
        { value: "in_progress", label: "Vireillä" },
        { value: "negotiation", label: "Neuvottelu" },
        { value: "decision", label: "Päätös" },
        { value: "signature", label: "Allekirjoitus" },
        { value: "no_agreement", label: "Ei sopimusta" },
      ],
    },
  }),
}));

vi.mock("@/landUse/hooks/useTableOfContents", () => ({
  useTocEntries: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(callApiPut).mockResolvedValue({
    identifier: "M-1",
    district: null,
    detailed_plan_sites: [],
    preparers: [],
    addresses: [],
    detailed_plan: null,
    authorized_signatory: null,
  });
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
  vi.clearAllMocks();
});

it("displays the status label without changing the stored backend code", () => {
  const form = createForm<LandUseSummaryFormValues>({
    onSubmit: () => {},
    initialValues: { ...createEmptySummaryFormValues(), tila: "draft" },
    mutators: { ...arrayMutators },
  });
  render(
    <QueryClientProvider client={new QueryClient()}>
      <LandUseSummary form={form} isEditMode={false} />
    </QueryClientProvider>,
  );

  expect(
    (screen.getByLabelText("Maankäyttösopimuksen tila") as HTMLInputElement)
      .value,
  ).toBe("Luonnos");
  expect(form.getState().values.tila).toBe("draft");
});

it("selects and clears summary status using backend codes rather than labels", async () => {
  const form = createForm<LandUseSummaryFormValues>({
    onSubmit: () => {},
    initialValues: { ...createEmptySummaryFormValues(), tila: "draft" },
    mutators: { ...arrayMutators },
  });
  render(
    <QueryClientProvider client={new QueryClient()}>
      <LandUseSummary form={form} isEditMode />
    </QueryClientProvider>,
  );

  const statusSelect = screen.getByRole("combobox", {
    name: /Maankäyttösopimuksen tila/,
  });
  expect(statusSelect.textContent).toContain("Luonnos");
  fireEvent.click(statusSelect);
  fireEvent.click(await screen.findByRole("option", { name: "Ei sopimusta" }));

  expect(form.getState().values.tila).toBe("no_agreement");
  await updateSummary("1", form.getState().values);
  expect(callApiPut).toHaveBeenLastCalledWith(
    "agreements/1/summary/",
    expect.objectContaining({ status: "no_agreement" }),
  );

  fireEvent.click(screen.getByRole("button", { name: "Tyhjennä tila" }));

  expect(form.getState().values.tila).toBeUndefined();
  await updateSummary("1", form.getState().values);
  expect(callApiPut).toHaveBeenLastCalledWith(
    "agreements/1/summary/",
    expect.objectContaining({ status: "" }),
  );
});

it("saves the selected signatory API ID rather than its option index", async () => {
  const form = createForm<LandUseSummaryFormValues>({
    onSubmit: () => {},
    initialValues: {
      ...createEmptySummaryFormValues(),
      toimivaltainenPaattaja: "17",
    },
    mutators: { ...arrayMutators },
  });
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <LandUseSummary form={form} isEditMode />
    </QueryClientProvider>,
  );

  await waitFor(() =>
    expect(
      screen.getByRole("combobox", { name: /Toimivaltainen päättäjä/ })
        .textContent,
    ).toContain("First signatory"),
  );
  fireEvent.click(
    screen.getByRole("combobox", { name: /Toimivaltainen päättäjä/ }),
  );
  fireEvent.click(
    await screen.findByRole("option", { name: "Second signatory" }),
  );

  await waitFor(() =>
    expect(form.getState().values.toimivaltainenPaattaja).toBe("42"),
  );
  await updateSummary("1", form.getState().values);
  expect(callApiPut).toHaveBeenCalledWith(
    "agreements/1/summary/",
    expect.objectContaining({ authorized_signatory: 42 }),
  );
});

it("selects a plan by database ID, derives read-only fields, and clears the relationship", async () => {
  const form = createForm<LandUseSummaryFormValues>({
    onSubmit: () => {},
    initialValues: createEmptySummaryFormValues(),
    mutators: { ...arrayMutators },
  });
  render(
    <QueryClientProvider client={new QueryClient()}>
      <LandUseSummary form={form} isEditMode />
    </QueryClientProvider>,
  );

  fireEvent.click(
    await screen.findByRole("button", { name: /Asemakaavan numero/ }),
  );
  fireEvent.click(await screen.findByRole("option", { name: "0012345" }));
  expect(form.getState().values).toMatchObject({
    detailedPlanId: 73,
    asemakaavanNumero: "0012345",
    asemakaavanKasittelyvaihe: "effective",
    vahvistamisHyvaksymisPvm: "10.01.2026",
    asemakaavanLainvoimaisuusPvm: "15.02.2026",
    asemakaavanHyvaksyjä: "Plan approver",
    asemakaavanDiaarinumero: "HEL-73",
  });
  for (const [label, value] of [
    ["Asemakaavan käsittelyvaihe", "Lainvoimainen"],
    ["Vahvistamis/hyväksymispäivä", "10.01.2026"],
    ["Lainvoimaisuuspäivä", "15.02.2026"],
    ["Asemakaavan hyväksyjä", "Plan approver"],
    ["Asemakaavan diaarinumero", "HEL-73"],
  ]) {
    const field = screen.getByLabelText(label) as HTMLInputElement;
    expect(field.value).toBe(value);
    expect(field.readOnly).toBe(true);
  }
  await updateSummary("1", form.getState().values);
  expect(callApiPut).toHaveBeenLastCalledWith(
    "agreements/1/summary/",
    expect.objectContaining({ detailed_plan: 73 }),
  );

  fireEvent.click(screen.getByRole("button", { name: "Tyhjennä asemakaava" }));
  expect(form.getState().values).toMatchObject({
    detailedPlanId: null,
    asemakaavanNumero: "",
    asemakaavanKasittelyvaihe: "",
    vahvistamisHyvaksymisPvm: "",
    asemakaavanLainvoimaisuusPvm: "",
    asemakaavanHyvaksyjä: "",
    asemakaavanDiaarinumero: "",
  });
  await updateSummary("1", form.getState().values);
  expect(callApiPut).toHaveBeenLastCalledWith(
    "agreements/1/summary/",
    expect.objectContaining({ detailed_plan: null }),
  );
});

it("saves free-text agreement types and preparers selected from real officer IDs", async () => {
  const form = createForm<LandUseSummaryFormValues>({
    onSubmit: () => {},
    initialValues: createEmptySummaryFormValues(),
    mutators: { ...arrayMutators },
  });
  render(
    <QueryClientProvider client={new QueryClient()}>
      <LandUseSummary form={form} isEditMode />
    </QueryClientProvider>,
  );
  fireEvent.click(await screen.findByRole("button", { name: /Valmistelija/ }));
  fireEvent.click(
    await screen.findByRole("option", { name: "Actual Officer" }),
  );
  expect(form.getState().values.valmistelijat).toEqual([{ value: "89" }]);
  await updateSummary("1", form.getState().values);
  expect(callApiPut).toHaveBeenLastCalledWith(
    "agreements/1/summary/",
    expect.objectContaining({
      preparers: [{ preparer: 89 }],
    }),
  );
});

it.each([false, true])(
  "uses summary edit mode (%s) for address and preparer fields",
  async (isEditMode) => {
    const form = createForm<LandUseSummaryFormValues>({
      onSubmit: () => {},
      initialValues: {
        ...createEmptySummaryFormValues(),
        osoitteet: [
          {
            katuosoite: "Testikatu 1",
            postinumero: "00100",
            kaupunki: "Helsinki",
          },
        ],
        valmistelijat: [{ value: "89" }],
      },
      mutators: { ...arrayMutators },
    });
    render(
      <QueryClientProvider client={new QueryClient()}>
        <LandUseSummary form={form} isEditMode={isEditMode} />
      </QueryClientProvider>,
    );
    expect(
      (screen.getByLabelText("Katuosoite") as HTMLInputElement).readOnly,
    ).toBe(!isEditMode);
    expect(
      (screen.getByLabelText("Postinumero") as HTMLInputElement).readOnly,
    ).toBe(!isEditMode);
    expect(
      (screen.getByLabelText("Kaupunki") as HTMLInputElement).readOnly,
    ).toBe(!isEditMode);
    if (isEditMode) {
      expect(
        await screen.findByRole("button", { name: /Valmistelija/ }),
      ).toBeDefined();
      expect(
        screen.getByRole("button", { name: "Lisää osoite" }),
      ).toBeDefined();
      expect(
        screen.getByRole("button", { name: "Lisää valmistelija" }),
      ).toBeDefined();
      return;
    }
    await waitFor(() =>
      expect(
        (screen.getByLabelText("Valmistelija") as HTMLInputElement).value,
      ).toBe("Actual Officer"),
    );
    expect(
      (screen.getByLabelText("Valmistelija") as HTMLInputElement).readOnly,
    ).toBe(true);
    expect(screen.queryByRole("button", { name: "Lisää osoite" })).toBeNull();
    expect(
      screen.queryByRole("button", { name: "Lisää valmistelija" }),
    ).toBeNull();
  },
);
