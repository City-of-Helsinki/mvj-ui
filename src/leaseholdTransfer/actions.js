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
  DeleteAndUpdateLeaseholdTrasferPayload,
  DeleteLeaseholdTransferAndUpdateListAction,
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
  createAction('mvj/leaseholdTransfer/FETCH_ALL')(query);

export const receiveLeaseholdTransferList = (list: LeaseholdTransferList): ReceiveLeaseholdTransferListAction =>
  createAction('mvj/leaseholdTransfer/RECEIVE_ALL')(list);

export const deleteLeaseholdTransferAndUpdateList = (payload: DeleteAndUpdateLeaseholdTrasferPayload): DeleteLeaseholdTransferAndUpdateListAction =>
  createAction('mvj/leaseholdTransfer/DELETE_AND_UPDATE')(payload);

export const notFound = (): NotFoundAction =>
  createAction('mvj/leaseholdTransfer/NOT_FOUND')();
