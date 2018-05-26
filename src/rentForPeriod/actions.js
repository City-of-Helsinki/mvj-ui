// @flow
import {createAction} from 'redux-actions';

import type {
  RentForPeriodOptions,
  RentForPeriod,
  FetchRentForPeriodAction,
  ReceiveRentForPeriodAction,
  RentForPeriodNotFoundAction,
} from './types';

export const fetchRentForPeriodByLease = (payload: RentForPeriodOptions): FetchRentForPeriodAction =>
  createAction('mvj/rentforperiod/FETCH_ALL')(payload);

export const receiveRentForPeriodByLease = (rent: RentForPeriod): ReceiveRentForPeriodAction =>
  createAction('mvj/rentforperiod/RECEIVE_ALL')(rent);

export const notFound = (): RentForPeriodNotFoundAction =>
  createAction('mvj/rentforperiod/NOT_FOUND')();
