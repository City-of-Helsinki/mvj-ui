// @flow
import {createAction} from 'redux-actions';

import type {Attributes, Methods} from '$src/types';
import type {LeaseId} from '$src/leases/types';
import type {
  FetchAttributesAction,
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  AttributesNotFoundAction,
  FetchInvoiceSetsByLeaseAction,
  ReceiveInvoiceSetsByLeaseAction,
  CreditInvoiceSetAction,
  InvoiceSetsNotFoundAction,
} from './types';

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/invoiceSets/FETCH_ATTRIBUTES')();

export const receiveAttributes = (attributes: Attributes): ReceiveAttributesAction =>
  createAction('mvj/invoiceSets/RECEIVE_ATTRIBUTES')(attributes);

export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction('mvj/invoiceSets/RECEIVE_METHODS')(methods);

export const attributesNotFound = (): AttributesNotFoundAction =>
  createAction('mvj/invoiceSets/ATTRIBUTES_NOT_FOUND')();

export const fetchInvoiceSetsByLease = (leaseId: LeaseId): FetchInvoiceSetsByLeaseAction =>
  createAction('mvj/invoiceSets/FETCH_BY_LEASE')(leaseId);

export const receiveInvoiceSetsByLease = (payload: Object): ReceiveInvoiceSetsByLeaseAction =>
  createAction('mvj/invoiceSets/RECEIVE_BY_LEASE')(payload);

export const creditInvoiceSet = (invoiceset: Object): CreditInvoiceSetAction =>
  createAction('mvj/invoiceSets/CREDIT_INVOICESET')(invoiceset);

export const notFound = (): InvoiceSetsNotFoundAction =>
  createAction('mvj/invoiceSets/NOT_FOUND')();
