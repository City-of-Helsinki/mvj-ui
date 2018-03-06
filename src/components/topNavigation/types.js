// @flow

import type {Action} from '$src/types';

export type TopNavigationState = Object;

export type TopNavigationSettings = {
  linkUrl: string,
  pageTitle: string,
  showSearch: boolean,
};


export type ReceiveTopNavigationSettingsAction = Action<'mvj/topnavigation/RECEIVE', TopNavigationSettings>;
