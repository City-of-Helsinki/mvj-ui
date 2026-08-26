import { createForm } from "final-form";
import { describe, expect, it } from "vitest";
import {
  maankayttokorvausYhteensaDecorator,
  type LandUseCompensationsFormValues,
} from "../LandUseCompensations";

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

    const unregisterFields = [
      "rahakorvaus",
      "maakorvaus",
      "muuKorvaus",
      "maankayttokorvausYhteensa",
    ].map((field) =>
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
