// @flow

import type {Action} from '../../types';

export type TopNavigationState = Object;

export type TopNavigationSettings = {
  pageTitle: string,
  showSearch: boolean,
};


export type SetTopNavigationSettingsAction = Action<'mvj/topnavigation/SET_SETTINGS', TopNavigationSettings>;
