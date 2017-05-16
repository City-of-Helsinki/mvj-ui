// @flow

import {createAction} from 'redux-actions';

import type {
  FetchIdentifiersAction,
  Identifiers,
  ReceiveIdentifiersAction,
} from './types';

export const fetchIdentifiers = (): FetchIdentifiersAction =>
  createAction('mvj/lease/FETCH_IDENTIFIERS')();

export const receiveIdentifiers = (identifiers: Identifiers): ReceiveIdentifiersAction =>
  createAction('mvj/lease/RECEIVE_IDENTIFIERS')(identifiers);
