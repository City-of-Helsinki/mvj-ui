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
  CreditInvoiceAction,
  PatchInvoiceAction,
  ReceivePatchedInvoiceAction,
  ClearPatchedInvoiceAction,
  InvoiceNotFoundAction,
  ReceiveIsCreateInvoicePanelOpenAction,
  ReceiveIsCreditInvoicePanelOpenAction,
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

export const creditInvoice = (invoice: Object): CreditInvoiceAction =>
  createAction('mvj/invoices/CREDIT_INVOICE')(invoice);

export const patchInvoice = (invoice: Invoice): PatchInvoiceAction =>
  createAction('mvj/invoices/PATCH')(invoice);

export const receivePatchedInvoice = (invoice: Invoice): ReceivePatchedInvoiceAction =>
  createAction('mvj/invoices/RECEIVE_PATCHED')(invoice);

export const clearPatchedInvoice = (): ClearPatchedInvoiceAction =>
  createAction('mvj/invoices/CLEAR_PATCHED')();

export const receiveIsCreateInvoicePanelOpen = (isOpen: boolean): ReceiveIsCreateInvoicePanelOpenAction =>
  createAction('mvj/invoices/RECEIVE_IS_CREATE_PANEL_OPEN')(isOpen);

export const receiveIsCreditInvoicePanelOpen = (isOpen: boolean): ReceiveIsCreditInvoicePanelOpenAction =>
  createAction('mvj/invoices/RECEIVE_IS_CREDIT_PANEL_OPEN')(isOpen);

export const notFound = (): InvoiceNotFoundAction =>
  createAction('mvj/invoices/NOT_FOUND')();
