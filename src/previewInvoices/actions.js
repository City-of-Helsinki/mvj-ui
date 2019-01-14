// @flow
import {createAction} from 'redux-actions';

import type {Attributes, Methods} from '$src/types';
import type {
  FetchAttributesAction,
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  AttributesNotFoundAction,
  PreviewInvoices,
  PreviewInvoicesFetchPayload,
  FetchPreviewInvoicesAction,
  ReceivePreviewInvoicesAction,
  ClearPreviewInvoicesAction,
  PreviewInvoicesNotFoundAction,
} from './types';

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/previewInvoices/FETCH_ATTRIBUTES')();

export const receiveAttributes = (attributes: Attributes): ReceiveAttributesAction =>
  createAction('mvj/previewInvoices/RECEIVE_ATTRIBUTES')(attributes);

export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction('mvj/previewInvoices/RECEIVE_METHODS')(methods);

export const attributesNotFound = (): AttributesNotFoundAction =>
  createAction('mvj/previewInvoices/ATTRIBUTES_NOT_FOUND')();

export const fetchPreviewInvoices = (payload: PreviewInvoicesFetchPayload): FetchPreviewInvoicesAction =>
  createAction('mvj/previewInvoices/FETCH_ALL')(payload);

export const receivePreviewInvoices = (previewInvoices: PreviewInvoices): ReceivePreviewInvoicesAction =>
  createAction('mvj/previewInvoices/RECEIVE_ALL')(previewInvoices);

export const clearPreviewInvoices = (): ClearPreviewInvoicesAction =>
  createAction('mvj/previewInvoices/CLEAR')();

export const notFound = (): PreviewInvoicesNotFoundAction =>
  createAction('mvj/previewInvoices/NOT_FOUND')();
