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
import { callApiPatch } from "@/landUse/api/fetchClient";
import { updateSummary } from "@/landUse/api/landUseApi";
import {
  LandUseSummary,
  type LandUseSummaryFormValues,
} from "@/landUse/components/tabs/LandUseSummary";

vi.mock("@/landUse/api/fetchClient", () => ({
  callApiPatch: vi.fn(),
  callApiGet: vi.fn(),
  callApiGetAllPages: vi.fn(async (path: string) =>
    path === "authorized-signatories/"
      ? [
          { id: 17, name: "First signatory" },
          { id: 42, name: "Second signatory" },
        ]
      : [],
  ),
}));

vi.mock("@/landUse/api/useLandUseMetadata", () => ({
  useLandUseMetadata: () => ({
    data: {
      detailed_plan_processing_stages: [],
      agreement_statuses: [
        { value: "DRAFT", label: "Luonnos" },
        { value: "IN_PROGRESS", label: "Vireillä" },
        { value: "NEGOTIATION", label: "Neuvottelu" },
        { value: "DECISION", label: "Päätös" },
        { value: "SIGNATURE", label: "Allekirjoitus" },
        { value: "NO_AGREEMENT", label: "Ei sopimusta" },
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
  vi.clearAllMocks();
});

it("displays the status label without changing the stored backend code", () => {
  const form = createForm<LandUseSummaryFormValues>({
    onSubmit: () => {},
    initialValues: { ...createEmptySummaryFormValues(), tila: "DRAFT" },
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
  expect(form.getState().values.tila).toBe("DRAFT");
});

it("selects and clears summary status using backend codes rather than labels", async () => {
  const form = createForm<LandUseSummaryFormValues>({
    onSubmit: () => {},
    initialValues: { ...createEmptySummaryFormValues(), tila: "DRAFT" },
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

  expect(form.getState().values.tila).toBe("NO_AGREEMENT");
  await updateSummary("1", form.getState().values);
  expect(callApiPatch).toHaveBeenLastCalledWith(
    "agreements/1/",
    expect.objectContaining({ status: "NO_AGREEMENT" }),
  );

  fireEvent.click(screen.getByRole("button", { name: "Tyhjennä tila" }));

  expect(form.getState().values.tila).toBeUndefined();
  await updateSummary("1", form.getState().values);
  expect(callApiPatch).toHaveBeenLastCalledWith(
    "agreements/1/",
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
  expect(callApiPatch).toHaveBeenCalledWith(
    "agreements/1/",
    expect.objectContaining({ authorized_signatory: 42 }),
  );
});
