// @flow
import {createAction} from 'redux-actions';

import type {Attributes, Methods} from '$src/types';
import type {
  FetchAttributesAction,
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  AttributesNotFoundAction,
  RentForPeriodOptions,
  RentForPeriodDeleteOptions,
  RentForPeriod,
  FetchRentForPeriodAction,
  ReceiveRentForPeriodByLeaseAction,
  DeleteRentForPeriodByLeaseAction,
  ReceiveIsSaveClickedAction,
  RentForPeriodNotFoundAction,
} from './types';

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/rentforperiod/FETCH_ATTRIBUTES')();

export const receiveAttributes = (attributes: Attributes): ReceiveAttributesAction =>
  createAction('mvj/rentforperiod/RECEIVE_ATTRIBUTES')(attributes);

export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction('mvj/rentforperiod/RECEIVE_METHODS')(methods);

export const attributesNotFound = (): AttributesNotFoundAction =>
  createAction('mvj/rentforperiod/ATTRIBUTES_NOT_FOUND')();

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
