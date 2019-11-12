// @flow

import {createAction} from 'redux-actions';

import type {
  HideEditModeAction,
  ShowEditModeAction,
  ReceiveCollapseStatesAction,
} from './types';

export const hideEditMode = (): HideEditModeAction =>
  createAction('mvj/property/HIDE_EDIT')();

export const showEditMode = (): ShowEditModeAction =>
  createAction('mvj/property/SHOW_EDIT')();

export const receiveCollapseStates = (status: Object): ReceiveCollapseStatesAction =>
  createAction('mvj/property/RECEIVE_COLLAPSE_STATES')(status);
