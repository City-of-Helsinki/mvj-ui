// @flow
import {createAction} from 'redux-actions';

import type {Attributes, Methods} from '$src/types';
import type {
  FetchAttributesAction,
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  AttributesNotFoundAction,
  LeaseholdTransferList,
  FetchLeaseholdTransferListAction,
  ReceiveLeaseholdTransferListAction,
  NotFoundAction,
} from '$src/leaseholdTransfer/types';

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/leaseholdTransfer/FETCH_ATTRIBUTES')();

export const receiveAttributes = (attributes: Attributes): ReceiveAttributesAction =>
  createAction('mvj/leaseholdTransfer/RECEIVE_ATTRIBUTES')(attributes);

export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction('mvj/leaseholdTransfer/RECEIVE_METHODS')(methods);

export const attributesNotFound = (): AttributesNotFoundAction =>
  createAction('mvj/leaseholdTransfer/ATTRIBUTES_NOT_FOUND')();

export const fetchLeaseholdTransferList = (query?: Object): FetchLeaseholdTransferListAction =>
  createAction('mvj/leaseholdTransfer/FETCH')(query);

export const receiveLeaseholdTransferList = (list: LeaseholdTransferList): ReceiveLeaseholdTransferListAction =>
  createAction('mvj/leaseholdTransfer/RECEIVE')(list);

export const notFound = (): NotFoundAction =>
  createAction('mvj/leaseholdTransfer/NOT_FOUND')();
