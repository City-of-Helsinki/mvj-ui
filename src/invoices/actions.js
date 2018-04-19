// @flow

import {createAction} from 'redux-actions';

import type {
  Attributes,
  FetchAttributesAction,
  ReceiveAttributesAction,
  Invoice,
  InvoiceList,
  FetchInvoicesAction,
  ReceiveInvoicesAction,
  PatchInvoiceAction,
  InvoiceNotFoundAction,
} from './types';

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/invoices/FETCH_ATTRIBUTES')();

export const receiveAttributes = (identifiers: Attributes): ReceiveAttributesAction =>
  createAction('mvj/invoices/RECEIVE_ATTRIBUTES')(identifiers);

export const fetchInvoices = (search: string): FetchInvoicesAction =>
  createAction('mvj/invoices/FETCH_ALL')(search);

export const receiveInvoices = (invoices: InvoiceList): ReceiveInvoicesAction =>
  createAction('mvj/invoices/RECEIVE_ALL')(invoices);

export const patchInvoice = (lease: Invoice): PatchInvoiceAction =>
  createAction('mvj/invoices/PATCH')(lease);

export const notFound = (): InvoiceNotFoundAction =>
  createAction('mvj/invoices/NOT_FOUND')();
