import React, { useState } from "react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  getTocScrollTarget,
  TableOfContentsProvider,
  useTocEntries,
} from "@/landUse/hooks/useTableOfContents";
import type { SectionEntry } from "@/landUse/components/SideNavigation";

const TocPublisher: React.FC<{ entries: SectionEntry[] }> = ({ entries }) => {
  useTocEntries(entries);
  return null;
};

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

describe("useTocEntries", () => {
  it("does not republish equivalent entries when their array identity changes", () => {
    const Harness: React.FC = () => {
      const [publishedEntries, setPublishedEntries] = useState<SectionEntry[]>(
        [],
      );

      return React.createElement(
        TableOfContentsProvider,
        { setEntries: setPublishedEntries },
        React.createElement(TocPublisher, {
          entries: [{ id: "heading", text: "Heading", level: 2 }],
        }),
        React.createElement(
          "output",
          null,
          publishedEntries.map(({ text }) => text).join(", "),
        ),
      );
    };

    const { container } = render(React.createElement(Harness));

    expect(container.querySelector("output")?.textContent).toBe("Heading");
  });
});
