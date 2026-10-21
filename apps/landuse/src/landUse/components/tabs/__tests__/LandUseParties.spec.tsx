import React from "react";
import { createForm } from "final-form";
import arrayMutators from "final-form-arrays";
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createEmptyPartiesFormValues } from "@/landUse/api/landUseFormValues";
import {
  LandUseParties,
  type LandUsePartiesFormValues,
} from "@/landUse/components/tabs/LandUseParties";

vi.mock("@/landUse/api/useLandUseMetadata", () => ({
  useLandUseMetadata: () => ({
    data: {
      party_types: [
        { value: "COMPANY", label: "Yritys" },
        { value: "PERSON", label: "Yksityishenkilö" },
      ],
      countries: [{ value: "DE", label: "Saksa" }],
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

describe("LandUseParties", () => {
  it.each([
    ["COMPANY", "Y-tunnus", "Henkilötunnus"],
    ["PERSON", "Henkilötunnus", "Y-tunnus"],
  ])(
    "shows contact details when selecting %s",
    (partyType, label, otherLabel) => {
      const form = createForm<LandUsePartiesFormValues>({
        onSubmit: () => {},
        initialValues: createEmptyPartiesFormValues(),
        mutators: { ...arrayMutators },
      });

      render(<LandUseParties form={form} isEditMode />);

      expect(screen.queryByLabelText(label)).toBeNull();

      act(() => {
        form.change(
          "parties",
          form.getState().values.parties.map((partyEntry) => ({
            ...partyEntry,
            party: {
              details: { ...partyEntry.party.details, partyType },
            },
          })),
        );
      });

      expect(screen.getByLabelText(label)).toBeTruthy();
      expect(screen.queryByLabelText(otherLabel)).toBeNull();
      expect(screen.getAllByLabelText("Puhelinnumero")).toHaveLength(2);
      expect(screen.getAllByLabelText("Sähköposti")).toHaveLength(2);
    },
  );

  it.each(["COMPANY", "PERSON"])(
    "uses metadata country labels for %s parties and invoice recipients",
    (partyType) => {
      const initialValues = createEmptyPartiesFormValues();
      const details = {
        ...initialValues.parties[0].party.details,
        partyType,
        country: "DE",
      };
      initialValues.parties[0].party.details = details;
      initialValues.parties[0].invoiceRecipient = { details: { ...details } };
      const form = createForm<LandUsePartiesFormValues>({
        onSubmit: () => {},
        initialValues,
        mutators: { ...arrayMutators },
      });

      const { rerender } = render(<LandUseParties form={form} isEditMode />);

      expect(screen.getAllByText("Saksa")).toHaveLength(2);

      rerender(<LandUseParties form={form} isEditMode={false} />);

      expect(
        screen
          .getAllByLabelText<HTMLInputElement>("Maa")
          .map((input) => input.value),
      ).toEqual(["Saksa", "Saksa"]);
    },
  );
});
