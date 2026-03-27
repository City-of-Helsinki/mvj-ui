import type { Selector } from "types";
export const getLinkUrl: Selector<string, void> = (
  state: Record<string, any>,
): string => state.topNavigation.settings.linkUrl;
export const getPageTitle: Selector<string, void> = (
  state: Record<string, any>,
): string => state.topNavigation.settings.pageTitle;
export const getShowSearch: Selector<boolean, void> = (
  state: Record<string, any>,
): boolean => state.topNavigation.settings.showSearch;
