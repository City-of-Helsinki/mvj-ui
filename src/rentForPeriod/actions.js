// @flow
import {createAction} from 'redux-actions';

import type {
  RentForPeriodOptions,
  RentForPeriodDeleteOptions,
  RentForPeriod,
  FetchRentForPeriodAction,
  ReceiveRentForPeriodByLeaseAction,
  DeleteRentForPeriodByLeaseAction,
  ReceiveIsSaveClickedAction,
  RentForPeriodNotFoundAction,
} from './types';

export const fetchRentForPeriodByLease = (payload: RentForPeriodOptions): FetchRentForPeriodAction =>
  createAction('mvj/rentforperiod/FETCH_ALL')(payload);

export const receiveRentForPeriodByLease = (rent: RentForPeriod): ReceiveRentForPeriodByLeaseAction =>
  createAction('mvj/rentforperiod/RECEIVE_BY_LEASE')(rent);

export const deleteRentForPeriodByLease = (payload: RentForPeriodDeleteOptions): DeleteRentForPeriodByLeaseAction =>
  createAction('mvj/rentforperiod/DELETE_BY_LEASE')(payload);

export const receiveIsSaveClicked = (isClicked: boolean): ReceiveIsSaveClickedAction =>
  createAction('mvj/rentforperiod/RECEIVE_SAVE_CLICKED')(isClicked);

export const notFound = (): RentForPeriodNotFoundAction =>
  createAction('mvj/rentforperiod/NOT_FOUND')();
