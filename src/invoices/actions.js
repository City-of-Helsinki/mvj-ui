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
  CreateInvoiceAction,
  CreateCreditInvoiceAction,
  PatchInvoiceAction,
  ReceivePatchedInvoiceAction,
  ClearPatchedInvoiceAction,
  InvoiceNotFoundAction,
  ReceiveIsCreateOpenAction,
  ReceiveIsCreateCreditOpenAction,
} from './types';

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/invoices/FETCH_ATTRIBUTES')();

export const receiveAttributes = (identifiers: Attributes): ReceiveAttributesAction =>
  createAction('mvj/invoices/RECEIVE_ATTRIBUTES')(identifiers);

export const fetchInvoices = (search: string): FetchInvoicesAction =>
  createAction('mvj/invoices/FETCH_ALL')(search);

export const receiveInvoices = (invoices: InvoiceList): ReceiveInvoicesAction =>
  createAction('mvj/invoices/RECEIVE_ALL')(invoices);

export const createInvoice = (invoice: Invoice): CreateInvoiceAction =>
  createAction('mvj/invoices/CREATE')(invoice);

export const createCreditInvoice = (invoice: Invoice): CreateCreditInvoiceAction =>
  createAction('mvj/invoices/CREATE_CREDIT')(invoice);

export const patchInvoice = (invoice: Invoice): PatchInvoiceAction =>
  createAction('mvj/invoices/PATCH')(invoice);

export const receivePatchedInvoice = (invoice: Invoice): ReceivePatchedInvoiceAction =>
  createAction('mvj/invoices/RECEIVE_PATCHED')(invoice);

export const clearPatchedInvoice = (): ClearPatchedInvoiceAction =>
  createAction('mvj/invoices/CLEAR_PATCHED')();

export const receiveIsCreateOpen = (isOpen: boolean): ReceiveIsCreateOpenAction =>
  createAction('mvj/invoices/RECEIVE_IS_CREATE_OPEN')(isOpen);

export const receiveIsCreateCreditOpen = (isOpen: boolean): ReceiveIsCreateCreditOpenAction =>
  createAction('mvj/invoices/RECEIVE_IS_CREATE_CREDIT_OPEN')(isOpen);

export const notFound = (): InvoiceNotFoundAction =>
  createAction('mvj/invoices/NOT_FOUND')();
