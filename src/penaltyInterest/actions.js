// @flow
import {createAction} from 'redux-actions';

import type {Attributes, Methods} from '$src/types';
import type {InvoiceId} from '$src/invoices/types';
import type {
  FetchAttributesAction,
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  AttributesNotFoundAction,
  FetchPenaltyInterestByInvoiceAction,
  ReceivePenaltyInterestByInvoiceAction,
  PenaltyInterestNotFoundByInvoiceAction,
} from './types';

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/penaltyInterest/FETCH_ATTRIBUTES')();

export const receiveAttributes = (attributes: Attributes): ReceiveAttributesAction =>
  createAction('mvj/penaltyInterest/RECEIVE_ATTRIBUTES')(attributes);

export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction('mvj/penaltyInterest/RECEIVE_METHODS')(methods);

export const attributesNotFound = (): AttributesNotFoundAction =>
  createAction('mvj/penaltyInterest/ATTRIBUTES_NOT_FOUND')();

export const fetchPenaltyInterestByInvoice = (invoiceId: InvoiceId): FetchPenaltyInterestByInvoiceAction =>
  createAction('mvj/penaltyInterest/FETCH_BY_INVOICE')(invoiceId);

export const receivePenaltyInterestByInvoice = (penaltyInterest: Object): ReceivePenaltyInterestByInvoiceAction =>
  createAction('mvj/penaltyInterest/RECEIVE_BY_INVOICE')(penaltyInterest);

export const penaltyInterestNotFoundByInvoice = (invoiceId: InvoiceId): PenaltyInterestNotFoundByInvoiceAction =>
  createAction('mvj/penaltyInterest/NOT_FOUND_BY_INVOICE')(invoiceId);
