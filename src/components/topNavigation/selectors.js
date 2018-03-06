// @flow

import type {Selector} from '$src/types';

export const getLinkUrl: Selector<string, void> = (state: Object): string =>
  state.topnavigation.settings.linkUrl;

export const getPageTitle: Selector<string, void> = (state: Object): string =>
  state.topnavigation.settings.pageTitle;

export const getShowSearch: Selector<boolean, void> = (state: Object): boolean =>
  state.topnavigation.settings.showSearch;
