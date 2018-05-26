// @flow

import type {Selector} from '$src/types';

export const getLinkUrl: Selector<string, void> = (state: Object): string =>
  state.topNavigation.settings.linkUrl;

export const getPageTitle: Selector<string, void> = (state: Object): string =>
  state.topNavigation.settings.pageTitle;

export const getShowSearch: Selector<boolean, void> = (state: Object): boolean =>
  state.topNavigation.settings.showSearch;
