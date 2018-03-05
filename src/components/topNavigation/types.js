// @flow

import type {Action} from '../../types';

export type TopNavigationState = Object;

export type TopNavigationSettings = {
  pageTitle: string,
  showSearch: boolean,
};


export type ReceiveTopNavigationSettingsAction = Action<'mvj/topnavigation/RECEIVE', TopNavigationSettings>;
