// @flow
import {createAction} from 'redux-actions';

import type {Attributes, Methods} from '$src/types';

import type {
  InvoiceNoteList,
  FetchAttributesAction,
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  AttributesNotFoundAction,
  FetchInvoiceNoteListAction,
  ReceiveInvoiceNoteListAction,
  NotFoundAction,
} from './types';

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/invoiceNote/FETCH_ATTRIBUTES')();

export const receiveAttributes = (attributes: Attributes): ReceiveAttributesAction =>
  createAction('mvj/invoiceNote/RECEIVE_ATTRIBUTES')(attributes);

export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction('mvj/invoiceNote/RECEIVE_METHODS')(methods);

export const attributesNotFound = (): AttributesNotFoundAction =>
  createAction('mvj/invoiceNote/ATTRIBUTES_NOT_FOUND')();

export const fetchInvoiceNoteList = (params: Object): FetchInvoiceNoteListAction =>
  createAction('mvj/invoiceNote/FETCH_ALL')(params);

export const receiveInvoiceNoteList = (invoiceNotes: InvoiceNoteList): ReceiveInvoiceNoteListAction =>
  createAction('mvj/invoiceNote/RECEIVE_ALL')(invoiceNotes);

export const notFound = (): NotFoundAction =>
  createAction('mvj/invoiceNote/NOT_FOUND')();
