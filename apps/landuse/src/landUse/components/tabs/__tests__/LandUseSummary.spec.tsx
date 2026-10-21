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
  useLandUseMetadata: () => ({ data: undefined }),
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
