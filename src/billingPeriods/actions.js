// @flow
import {createAction} from 'redux-actions';

import type {Attributes, Methods} from '$src/types';
import type {
  FetchAttributesAction,
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  AttributesNotFoundAction,
  BillingPeriodsOptions,
  FetchBillingPeriodsAction,
  ReceiveBillingPeriodsAction,
  BillingPeriodsNotFoundAction,
} from './types';

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/billingperiods/FETCH_ATTRIBUTES')();

export const receiveAttributes = (attributes: Attributes): ReceiveAttributesAction =>
  createAction('mvj/billingperiods/RECEIVE_ATTRIBUTES')(attributes);

export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction('mvj/billingperiods/RECEIVE_METHODS')(methods);

export const attributesNotFound = (): AttributesNotFoundAction =>
  createAction('mvj/billingperiods/ATTRIBUTES_NOT_FOUND')();

export const fetchBillingPeriodsByLease = (payload: BillingPeriodsOptions): FetchBillingPeriodsAction =>
  createAction('mvj/billingperiods/FETCH_ALL')(payload);

export const receiveBillingPeriodsByLease = (billingPeriods: Object): ReceiveBillingPeriodsAction =>
  createAction('mvj/billingperiods/RECEIVE_ALL')(billingPeriods);

export const notFound = (): BillingPeriodsNotFoundAction =>
  createAction('mvj/billingperiods/NOT_FOUND')();
