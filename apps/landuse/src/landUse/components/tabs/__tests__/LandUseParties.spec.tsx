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
      languages: [
        { value: "fi", label: "suomi" },
        { value: "sv", label: "ruotsi" },
        { value: "en", label: "englanti" },
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

describe("LandUseParties", () => {
  it.each(["COMPANY", "PERSON"])(
    "selects and clears code-valued language/country for both %s recipients",
    async (partyType) => {
      const initialValues = createEmptyPartiesFormValues();
      const details = { ...initialValues.parties[0].party.details, partyType };
      initialValues.parties[0].party.details = details;
      initialValues.parties[0].invoiceRecipient = { details: { ...details } };
      const form = createForm<LandUsePartiesFormValues>({
        onSubmit: () => {},
        initialValues,
        mutators: { ...arrayMutators },
      });
      render(<LandUseParties form={form} isEditMode />);
      for (const language of ["suomi", "ruotsi", "englanti"]) {
        for (const control of screen.getAllByRole("combobox", {
          name: /Kieli/,
        })) {
          fireEvent.click(control);
          fireEvent.click(
            await screen.findByRole("option", { name: language }),
          );
        }
      }
      for (const control of screen.getAllByRole("combobox", { name: /Maa/ })) {
        fireEvent.click(control);
        fireEvent.click(await screen.findByRole("option", { name: "Saksa" }));
      }
      expect(form.getState().values.parties[0]).toMatchObject({
        party: { details: { language: "en", country: "DE" } },
        invoiceRecipient: { details: { language: "en", country: "DE" } },
      });
      for (const control of screen.getAllByRole("button", {
        name: /Poista nykyinen valinta/,
      })) {
        fireEvent.click(control);
      }
      const cleared = form.getState().values.parties[0];
      expect(cleared.party.details.language).toBeUndefined();
      expect(cleared.party.details.country).toBeUndefined();
      expect(cleared.invoiceRecipient?.details.language).toBeUndefined();
      expect(cleared.invoiceRecipient?.details.country).toBeUndefined();
    },
  );

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
