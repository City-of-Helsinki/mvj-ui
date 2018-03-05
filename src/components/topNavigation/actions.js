// @flow

import {createAction} from 'redux-actions';

import type {
  ReceiveTopNavigationSettingsAction,
  TopNavigationSettings,
} from './types';

export const receiveTopNavigationSettings = (options: TopNavigationSettings): ReceiveTopNavigationSettingsAction  =>
  createAction('mvj/topnavigation/RECEIVE')(options);
