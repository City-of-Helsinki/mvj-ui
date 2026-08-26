import { describe, expect, it } from "vitest";
import { getTocScrollTarget } from "../useTableOfContents";

describe("getTocScrollTarget", () => {
  it("uses the enclosing StepByStep item so its title remains visible", () => {
    const step = document.createElement("li");
    step.className =
      "StepByStep-module_stepItem__abc step-by-step_hds-step-by-step__step-item__def";
    const descriptionTarget = document.createElement("div");
    step.append(descriptionTarget);

    expect(getTocScrollTarget(descriptionTarget)).toBe(step);
  });

  it("uses a regular TOC target as-is", () => {
    const heading = document.createElement("h2");

    expect(getTocScrollTarget(heading)).toBe(heading);
  });
});
