// @flow

import {createAction} from 'redux-actions';

import type {
  ServiceUnits,
  FetchServiceUnitsAction,
  ReceiveServiceUnitsAction,
  ServiceUnitsNotFoundAction,
} from './types';

export const fetchServiceUnits = (): FetchServiceUnitsAction =>
  createAction('mvj/serviceUnits/FETCH_ALL')();

export const receiveServiceUnits = (serviceUnits: ServiceUnits): ReceiveServiceUnitsAction =>
  createAction('mvj/serviceUnits/RECEIVE_ALL')(serviceUnits);

export const notFound = (): ServiceUnitsNotFoundAction =>
  createAction('mvj/serviceUnits/NOT_FOUND')();
