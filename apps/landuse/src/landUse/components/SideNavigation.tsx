import React from "react";
import {
  Button,
  ButtonVariant,
  IconCheckCircle,
  IconCross,
  IconPen,
  IconAlertCircle,
  IconError,
  IconSize,
} from "hds-react";

export interface SideNavigationTab {
  label: string;
  isDirty?: boolean;
  hasError?: boolean;
}

export interface TocEntry {
  id: string;
  text: string;
  /** Heading level */
  level: number;
}

interface SideNavigationProps {
  title: string;
  tabs: SideNavigationTab[];
  activeTab: number;
  onTabClick: (tabIndex: number) => void;
  tocEntries: TocEntry[];
  activeTocId: string | null;
  onTocClick: (id: string) => void;
  isEditMode: boolean;
  onEditClick: () => void;
  onSaveClick: () => void;
  onDiscardClick: () => void;
}

// Constants for the heading tags to show in the table of contents (TOC).
export const HEADING_TAGS_TO_SHOW_IN_TOC = ["h2"];

/**
 * Custom vertical sidebar navigation for the land use detail page.
 * Replaces the HDS horizontal Tabs with a left-hand rail so that the
 * middle section can host a table of contents for the active tab.
 */
export const SideNavigation: React.FC<SideNavigationProps> = ({
  title,
  tabs,
  activeTab,
  onTabClick,
  tocEntries,
  activeTocId,
  onTocClick,
  isEditMode,
  onEditClick,
  onSaveClick,
  onDiscardClick,
}) => {
  return (
    <nav className="landuse-detail__sidebar" aria-label="Sivunavigointi">
      <div className="landuse-detail__sidebar-section landuse-detail__sidebar-title">
        <h1>{title}</h1>
      </div>
      <div className="landuse-detail__sidebar-section landuse-detail__sidebar-tabs">
        <ul className="landuse-detail__sidebar-list" role="tablist">
          {tabs.map((tab, index) => {
            const isActive = index === activeTab;
            return (
              <li key={tab.label} role="presentation">
                <button
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`landuse-detail__sidebar-tab${
                    isActive ? " landuse-detail__sidebar-tab--active" : ""
                  }`}
                  onClick={() => onTabClick(index)}
                >
                  <span className="landuse-detail__sidebar-tab-label">
                    {tab.label}
                  </span>
                  {tab.isDirty && (
                    <IconAlertCircle
                      size={IconSize.Small}
                      className="landuse-detail__tab-icon landuse-detail__tab-icon--dirty"
                      aria-label="Tallentamattomia muutoksia"
                    />
                  )}
                  {tab.hasError && (
                    <IconError
                      size={IconSize.Small}
                      className="landuse-detail__tab-icon landuse-detail__tab-icon--error"
                      aria-label="Lomakkeessa on virheitä"
                    />
                  )}
                </button>
                {isActive && tocEntries.length > 0 && (
                  <ul className="landuse-detail__sidebar-toc-list">
                    {tocEntries.map((entry) => {
                      const isTocActive = entry.id === activeTocId;
                      return (
                        <li key={entry.id}>
                          <button
                            type="button"
                            className={`landuse-detail__sidebar-toc-item${
                              isTocActive
                                ? " landuse-detail__sidebar-toc-item--active"
                                : ""
                            }`}
                            onClick={() => onTocClick(entry.id)}
                          >
                            {entry.text}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="landuse-detail__sidebar-section landuse-detail__sidebar-actions">
        {isEditMode ? (
          <>
            <Button
              variant={ButtonVariant.Secondary}
              onClick={onDiscardClick}
              iconStart={<IconCross />}
            >
              Hylkää muutokset
            </Button>
            <Button
              variant={ButtonVariant.Primary}
              onClick={onSaveClick}
              iconStart={<IconCheckCircle />}
            >
              Tallenna
            </Button>
          </>
        ) : (
          <Button
            variant={ButtonVariant.Primary}
            onClick={onEditClick}
            iconStart={<IconPen />}
          >
            Muokkaa
          </Button>
        )}
      </div>
    </nav>
  );
};
