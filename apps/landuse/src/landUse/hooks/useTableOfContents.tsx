import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import type { SectionEntry } from "../components/SideNavigation";
import { HEADING_TAGS_TO_SHOW_IN_TOC } from "../components/SideNavigation";

interface TableOfContentsContextValue {
  setEntries: (entries: SectionEntry[]) => void;
}

const TableOfContentsContext =
  createContext<TableOfContentsContextValue | null>(null);

/**
 * Exposes a setter so the currently mounted tab can publish its table of
 * contents. Tabs derive their own entries via the hooks below, so neither the
 * detail page nor the side navigation needs to know how a tab produces them.
 */
export const TableOfContentsProvider: React.FC<{
  setEntries: (entries: SectionEntry[]) => void;
  children: React.ReactNode;
}> = ({ setEntries, children }) => {
  const value = useMemo(() => ({ setEntries }), [setEntries]);

  return (
    <TableOfContentsContext.Provider value={value}>
      {children}
    </TableOfContentsContext.Provider>
  );
};

const useTableOfContentsContext = (): TableOfContentsContextValue => {
  const context = useContext(TableOfContentsContext);
  if (!context) {
    throw new Error(
      "Table of contents hooks must be used within a TableOfContentsProvider",
    );
  }
  return context;
};

/** A tab publishes an explicit list of table of contents entries. */
export const useTocEntries = (entries: SectionEntry[]): void => {
  const { setEntries } = useTableOfContentsContext();

  useEffect(() => {
    setEntries(entries);
    return () => setEntries([]);
  }, [setEntries, entries]);
};

/** A tab publishes an entry for each heading rendered inside `contentRef`. */
export const useHeadingToc = (
  contentRef: React.RefObject<HTMLElement | null>,
  deps: React.DependencyList,
): void => {
  const { setEntries } = useTableOfContentsContext();

  const collectHeadings = useCallback(() => {
    const content = contentRef.current;
    if (!content) {
      setEntries([]);
      return;
    }

    const headings = Array.from(
      content.querySelectorAll(HEADING_TAGS_TO_SHOW_IN_TOC.join(", ")),
    );
    const entries: SectionEntry[] = headings.map((heading, index) => {
      if (!heading.id) {
        heading.id = `landuse-heading-${index}`;
      }
      return {
        id: heading.id,
        text: heading.textContent?.trim() ?? "",
        level: parseInt(heading.tagName.toLowerCase().replace("h", ""), 10),
      };
    });

    setEntries(entries);
  }, [contentRef, setEntries]);

  useEffect(() => {
    collectHeadings();
    return () => setEntries([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectHeadings, ...deps]);
};
