// @flow
import {createAction} from 'redux-actions';

import type {
  VatList,
  FetchVatsAction,
  ReceiveVatsAction,
  VatsNotFoundAction,
} from './types';

export const fetchVats = (): FetchVatsAction =>
  createAction('mvj/vat/FETCH_ALL')();

export const receiveVats = (vats: VatList): ReceiveVatsAction =>
  createAction('mvj/vat/RECEIVE_ALL')(vats);

export const notFound = (): VatsNotFoundAction =>
  createAction('mvj/vat/NOT_FOUND')();
