// @flow

import {createAction} from 'redux-actions';

import type {
  Attributes,
  FetchAttributesAction,
  ReceiveAttributesAction,
  Invoice,
  InvoiceListMap,
  FetchInvoicesByLeaseAction,
  ReceiveInvoicesByLeaseAction,
  CreateInvoiceAction,
  CreditInvoiceAction,
  PatchInvoiceAction,
  ReceivePatchedInvoiceAction,
  ClearPatchedInvoiceAction,
  InvoiceNotFoundAction,
  ReceiveInvoiceToCreditAction,
  ReceiveIsCreateInvoicePanelOpenAction,
  ReceiveIsCreditInvoicePanelOpenAction,
  ReceiveIsCreateClickedAction,
  ReceiveIsCreditClickedAction,
  ReceiveIsEditClickedAction,
} from './types';
import type {LeaseId} from '$src/leases/types';

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/invoices/FETCH_ATTRIBUTES')();

export const receiveAttributes = (identifiers: Attributes): ReceiveAttributesAction =>
  createAction('mvj/invoices/RECEIVE_ATTRIBUTES')(identifiers);

export const fetchInvoicesByLease = (leaseId: LeaseId): FetchInvoicesByLeaseAction =>
  createAction('mvj/invoices/FETCH_BY_LEASE')(leaseId);

export const receiveInvoicesByLease = (invoices: InvoiceListMap): ReceiveInvoicesByLeaseAction =>
  createAction('mvj/invoices/RECEIVE_BY_LEASE')(invoices);

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

export const receiveIsCreateClicked = (isClicked: boolean): ReceiveIsCreateClickedAction =>
  createAction('mvj/invoices/RECEIVE_CREATE_CLICKED')(isClicked);

export const receiveIsCreditClicked = (isClicked: boolean): ReceiveIsCreditClickedAction =>
  createAction('mvj/invoices/RECEIVE_CREDIT_CLICKED')(isClicked);

export const receiveIsEditClicked = (isClicked: boolean): ReceiveIsEditClickedAction =>
  createAction('mvj/invoices/RECEIVE_EDIT_CLICKED')(isClicked);

export const receiveInvoiceToCredit = (invoiceId: ?string): ReceiveInvoiceToCreditAction =>
  createAction('mvj/invoices/RECEIVE_INVOICE_TO_CREDIT')(invoiceId);

export const notFound = (): InvoiceNotFoundAction =>
  createAction('mvj/invoices/NOT_FOUND')();
