import { createForm } from "final-form";
import { describe, expect, it } from "vitest";
import {
  maankayttokorvausYhteensaDecorator,
  selectSiteLookups,
  selectLandPolicyProgram,
  type LandUseCompensationsFormValues,
} from "@/landUse/components/tabs/LandUseCompensations";

describe("compensation lookup selections", () => {
  it("retains authoritative IDs and names and applies the policy discount", () => {
    const site = selectSiteLookups({ id: 12, name: "Housing" }, [
      { id: 23, name: "Ownership" },
    ]);
    expect(site).toEqual({
      kayttotarkoitusId: 12,
      kayttotarkoitus: "Housing",
      hallintamuotoIds: [23],
      hallintamuoto: ["Ownership"],
    });
    expect(selectLandPolicyProgram({
      id: 34, name: "MAPO", default_discount_percentage: "15.00",
    })).toEqual({
      maapoliittinenOhjelmaId: 34,
      maapoliittinenOhjelma: "MAPO",
      huojennusProsentti: "15.00",
    });
  });
});

describe("maankayttokorvausYhteensaDecorator", () => {
  it("keeps the form pristine on mount and recalculates after an edit", () => {
    const form = createForm<LandUseCompensationsFormValues>({
      onSubmit: () => {},
    });
    form.initialize({
      rahakorvaus: "100",
      maakorvaus: "200",
      muuKorvaus: "300",
      maankayttokorvausYhteensa: "600",
    } as LandUseCompensationsFormValues);

    const fields: (keyof LandUseCompensationsFormValues)[] = [
      "rahakorvaus",
      "maakorvaus",
      "muuKorvaus",
      "maankayttokorvausYhteensa",
    ];
    const unregisterFields = fields.map((field) =>
      form.registerField(field, () => {}, {
        value: true,
      }),
    );

    const removeDecorator = maankayttokorvausYhteensaDecorator(form);

    expect(form.getState().dirty).toBe(false);
    expect(form.getState().values.maankayttokorvausYhteensa).toBe("600");

    form.change("rahakorvaus", "150");

    expect(form.getState().dirty).toBe(true);
    expect(form.getState().values.maankayttokorvausYhteensa).toBe("650");

    removeDecorator();
    unregisterFields.forEach((unregister) => unregister());
  });
});
