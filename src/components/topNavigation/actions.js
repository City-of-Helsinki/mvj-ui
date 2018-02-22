// @flow

import {createAction} from 'redux-actions';

import type {
  SetTopNavigationSettingsAction,
  TopNavigationSettings,
} from './types';

export const setTopNavigationSettings = (options: TopNavigationSettings): SetTopNavigationSettingsAction  =>
  createAction('mvj/topnavigation/SET_SETTINGS')(options);
