import { useEffect } from "react";

/**
 * Calculates the active section of the page based on the headings in the
 * content area.
 *
 * Sections vary a lot in height, so instead of picking the topmost visible
 * heading we track which headings have crossed a line near the top of the
 * viewport: the active section is the last heading whose top is above that
 * line. This keeps a short section highlighted while its (taller) neighbour's
 * heading has not yet reached the line, and correctly advances through tall
 * sections.
 *
 * When scrolled to the very bottom we force the last entry active
 * so trailing short sections can still be reached.
 */
export function useCalculateActivePageSection(
  contentRef: React.RefObject<HTMLElement>,
  sectionEntryIds: string[],
  setActiveSectionId: (id: string) => void,
) {
  useEffect(() => {
    const content = contentRef.current;
    if (!content || sectionEntryIds.length === 0) {
      return;
    }

    const headingElements = sectionEntryIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (headingElements.length === 0) {
      return;
    }

    // Line 20% down from the top of the viewport used to decide the active
    // section. A heading counts as "passed" once its top rises above this line.
    const getActivationLine = () => window.innerHeight * 0.2;

    const updateActiveHeading = () => {
      const scrolledToBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;

      if (scrolledToBottom) {
        setActiveSectionId(headingElements[headingElements.length - 1].id);
        return;
      }

      const activationLine = getActivationLine();
      let activeId = headingElements[0].id;

      for (const heading of headingElements) {
        if (heading.getBoundingClientRect().top <= activationLine) {
          activeId = heading.id;
        } else {
          break;
        }
      }

      setActiveSectionId(activeId);
    };

    updateActiveHeading();

    window.addEventListener("scroll", updateActiveHeading, { passive: true });
    window.addEventListener("resize", updateActiveHeading);

    return () => {
      window.removeEventListener("scroll", updateActiveHeading);
      window.removeEventListener("resize", updateActiveHeading);
    };
  }, [sectionEntryIds, contentRef, setActiveSectionId]);
}
